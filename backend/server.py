#!/usr/bin/env python3
"""CheckDin Backend Server - stdlib-only HTTP server for admin, customer, partner apps."""

import json
import sqlite3
import hashlib
import hmac
import base64
import time
import uuid
import re
import traceback
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote

DB_PATH = "/home/prasad526/project/checkdin/backend/database.sqlite"
SECRET = "checkdin-secret-key-change-in-production"
TOKEN_TTL = 86400 * 7
HOST, PORT = "0.0.0.0", 3001


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn

def row_to_dict(row):
    return dict(row) if row else None

def rows_to_list(rows):
    return [dict(r) for r in rows]

def gen_id():
    return uuid.uuid4().hex[:12]

def now_iso():
    return time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())

def hash_password(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def check_password(pw, ph):
    return hash_password(pw) == ph

def make_ref(prefix="REF"):
    return f"{prefix}-{uuid.uuid4().hex[:8].upper()}"


def create_token(user_id, user_type, role="user"):
    exp = int(time.time()) + TOKEN_TTL
    payload = f"{user_id}|{user_type}|{role}|{exp}"
    payload_b64 = base64.urlsafe_b64encode(payload.encode()).decode()
    sig = hmac.new(SECRET.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{sig}"

def verify_token(token):
    try:
        payload_b64, sig = token.split(".", 1)
        expected = hmac.new(SECRET.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        payload = base64.urlsafe_b64decode(payload_b64.encode()).decode()
        uid, utype, role, exp = payload.split("|", 3)
        if int(exp) < time.time():
            return None
        return {"user_id": uid, "user_type": utype, "role": role}
    except Exception:
        return None

def auth_from_header(handler):
    auth = handler.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return verify_token(auth[7:])
    return None


def db_fetch(query, params=()):
    conn = get_db()
    try:
        return row_to_dict(conn.execute(query, params).fetchone())
    finally:
        conn.close()

def db_fetch_all(query, params=()):
    conn = get_db()
    try:
        return rows_to_list(conn.execute(query, params).fetchall())
    finally:
        conn.close()

def db_execute(query, params=()):
    conn = get_db()
    try:
        conn.execute(query, params)
        conn.commit()
    finally:
        conn.close()


def read_body(handler):
    length = int(handler.headers.get("Content-Length", 0))
    if length == 0:
        return {}
    raw = handler.rfile.read(length)
    try:
        return json.loads(raw)
    except Exception:
        return {}

def send_json(handler, data, status=200):
    body = json.dumps(data, default=str).encode()
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json")
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type,Authorization")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)

def send_error(handler, status, message):
    send_json(handler, {"error": message}, status)

def paginate(items, qp):
    page = int(qp.get("page", ["1"])[0])
    limit = int(qp.get("limit", ["20"])[0])
    if limit <= 0:
        limit = 20
    offset = (page - 1) * limit
    total = len(items)
    return {
        "data": items[offset:offset + limit],
        "total": total, "page": page, "limit": limit,
        "pages": max(1, (total + limit - 1) // limit),
    }

def get_query_params(handler):
    parsed = urlparse(handler.path)
    return parse_qs(parsed.query)

def parse_path(path):
    path = unquote(path).rstrip("/")
    if not path:
        path = "/"
    segments = [s for s in path.split("/") if s]
    return path, segments

def get_id_from_segments(segments, after):
    try:
        idx = segments.index(after)
        if idx + 1 < len(segments):
            return segments[idx + 1]
    except ValueError:
        pass
    return None


def filter_items(items, qp, field_map):
    """Generic in-memory filter. field_map = {query_param: db_column}."""
    result = items
    for qp_key, col in field_map.items():
        val = qp.get(qp_key, [None])[0]
        if val:
            val_lower = val.lower()
            result = [r for r in result if val_lower in str(r.get(col, "")).lower()]
    return result


# ---------------------------------------------------------------------------
# AUTH ROUTES
# ---------------------------------------------------------------------------
def handle_auth_login_admin(handler, body):
    email = body.get("email", "").strip()
    password = body.get("password", "")
    if not email or not password:
        return send_error(handler, 400, "Email and password required")
    user = db_fetch("SELECT * FROM admin_users WHERE email=?", (email,))
    if not user or not check_password(password, user["password_hash"]):
        return send_error(handler, 401, "Invalid credentials")
    if user.get("status") != "Active":
        return send_error(handler, 403, "Account disabled")
    token = create_token(user["id"], "admin", user.get("role", "admin"))
    send_json(handler, {"token": token, "user": {
        "id": user["id"], "name": user["name"], "email": user["email"],
        "role": user["role"], "role_name": user["role_name"],
    }})

def handle_auth_login_customer(handler, body):
    email = body.get("email", body.get("phone", "")).strip()
    phone = body.get("phone", "").strip()
    name = body.get("name", "Guest").strip()
    if not email:
        return send_error(handler, 400, "Email or phone required")
    if not phone:
        phone = email
    user = db_fetch("SELECT * FROM customers WHERE email=? OR phone=?", (email, phone))
    if not user:
        cid = gen_id()
        now = now_iso()
        db_execute(
            "INSERT INTO customers (id,name,email,phone,city,joined_at,status) VALUES (?,?,?,?,?,?,?)",
            (cid, name, email, phone, body.get("city", ""), now, "Active"),
        )
        user = db_fetch("SELECT * FROM customers WHERE id=?", (cid,))
    token = create_token(user["id"], "customer")
    send_json(handler, {"token": token, "user": {
        "id": user["id"], "name": user["name"], "email": user["email"],
        "phone": user["phone"],
    }})

def handle_auth_login_partner(handler, body):
    hotel_id = body.get("hotelId", body.get("hotel_id", "")).strip()
    user_id = body.get("userId", body.get("user_id", "")).strip()
    user_password = body.get("userPassword", body.get("user_password", "")).strip()
    if hotel_id and not user_id:
        users = db_fetch_all(
            "SELECT id,name,role_id,active FROM partner_users WHERE hotel_id=? AND active=1",
            (hotel_id,),
        )
        send_json(handler, {"step": 2, "users": users})
        return
    if not user_id or not user_password:
        return send_error(handler, 400, "userId and userPassword required")
    user = db_fetch("SELECT * FROM partner_users WHERE id=? AND hotel_id=?", (user_id, hotel_id))
    if not user:
        return send_error(handler, 401, "User not found")
    if not check_password(user_password, user["password_hash"]):
        return send_error(handler, 401, "Invalid password")
    if not user.get("active"):
        return send_error(handler, 403, "Account disabled")
    db_execute("UPDATE partner_users SET last_login=? WHERE id=?", (now_iso(), user_id))
    token = create_token(user_id, "partner", user.get("role_id", "manager"))
    send_json(handler, {"token": token, "user": {
        "id": user["id"], "name": user["name"], "role_id": user["role_id"],
        "hotel_id": user["hotel_id"],
    }})

def handle_auth_me(handler, user_info):
    uid, utype = user_info["user_id"], user_info["user_type"]
    if utype == "admin":
        row = db_fetch("SELECT id,name,email,role,role_name FROM admin_users WHERE id=?", (uid,))
    elif utype == "customer":
        row = db_fetch("SELECT id,name,email,phone,city FROM customers WHERE id=?", (uid,))
    elif utype == "partner":
        row = db_fetch("SELECT id,name,hotel_id,role_id FROM partner_users WHERE id=?", (uid,))
    else:
        return send_error(handler, 400, "Unknown user type")
    send_json(handler, row or {"error": "User not found"})

def handle_auth_profile(handler, user_info, body):
    if user_info["user_type"] != "customer":
        return send_error(handler, 403, "Customers only")
    uid = user_info["user_id"]
    fields, vals = [], []
    for f in ["name", "email", "phone", "city", "gender", "emergency_name", "emergency_phone", "emergency_relation"]:
        if f in body:
            fields.append(f"{f}=?")
            vals.append(body[f])
    if not fields:
        return send_error(handler, 400, "No fields to update")
    vals.append(uid)
    db_execute(f"UPDATE customers SET {','.join(fields)} WHERE id=?", vals)
    send_json(handler, {"ok": True})

# ---------------------------------------------------------------------------
# ADMIN ROUTES
# ---------------------------------------------------------------------------
def require_admin(user_info):
    return user_info and user_info["user_type"] == "admin"

def require_partner(user_info):
    return user_info and user_info["user_type"] == "partner"

def handle_admin_dashboard(handler, qp):
    stats = {}
    stats["total_properties"] = db_fetch("SELECT COUNT(*) as c FROM properties").get("c", 0)
    stats["total_bookings"] = db_fetch("SELECT COUNT(*) as c FROM bookings").get("c", 0)
    stats["total_customers"] = db_fetch("SELECT COUNT(*) as c FROM customers").get("c", 0)
    stats["total_partners"] = db_fetch("SELECT COUNT(*) as c FROM partners").get("c", 0)
    stats["total_revenue"] = db_fetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings").get("s", 0)
    stats["pending_bookings"] = db_fetch("SELECT COUNT(*) as c FROM bookings WHERE status='Pending'").get("c", 0)
    stats["active_properties"] = db_fetch("SELECT COUNT(*) as c FROM properties WHERE status='Active'").get("c", 0)
    stats["pending_refunds"] = db_fetch("SELECT COUNT(*) as c FROM refunds WHERE status='Requested'").get("c", 0)
    stats["open_tickets"] = db_fetch("SELECT COUNT(*) as c FROM tickets WHERE status='Open'").get("c", 0)
    stats["open_fraud"] = db_fetch("SELECT COUNT(*) as c FROM fraud_alerts WHERE status='Open'").get("c", 0)
    send_json(handler, stats)

def handle_admin_bookings(handler, qp, segments):
    item_id = get_id_from_segments(segments, "bookings")
    if item_id and "mutate" in segments and handler.command == "POST":
        body = read_body(handler)
        act = body.get("action", "")
        allowed = ["approve", "cancel", "checkin", "checkout", "confirm", "pending"]
        if act not in allowed:
            return send_error(handler, 400, f"Invalid action: {act}")
        now = now_iso()
        db_execute("UPDATE bookings SET status=? WHERE id=?", (act.capitalize(), item_id))
        b = db_fetch("SELECT * FROM bookings WHERE id=?", (item_id,))
        if b:
            tl = json.loads(b.get("timeline", "[]") or "[]")
            tl.append({"action": act, "at": now, "by": "admin"})
            db_execute("UPDATE bookings SET timeline=? WHERE id=?", (json.dumps(tl), item_id))
        return send_json(handler, {"ok": True, "status": act.capitalize()})
    if item_id and item_id != "mutate":
        b = db_fetch("SELECT * FROM bookings WHERE id=?", (item_id,))
        return send_json(handler, b or {"error": "Not found"})
    items = db_fetch_all("SELECT * FROM bookings ORDER BY created_at DESC")
    items = filter_items(items, qp, {
        "status": "status", "city": "city", "customer": "customer_name",
        "property": "property_name",
    })
    send_json(handler, paginate(items, qp))

def handle_admin_properties(handler, qp, segments):
    item_id = get_id_from_segments(segments, "properties")
    if item_id and "mutate" in segments and handler.command == "POST":
        body = read_body(handler)
        fields, vals = [], []
        for f in ["name", "city", "state", "address", "type", "status", "rooms", "rating"]:
            if f in body:
                fields.append(f"{f}=?")
                vals.append(body[f])
        if fields:
            vals.append(item_id)
            db_execute(f"UPDATE properties SET {','.join(fields)} WHERE id=?", vals)
        return send_json(handler, {"ok": True})
    if item_id and item_id != "mutate":
        p = db_fetch("SELECT * FROM properties WHERE id=?", (item_id,))
        return send_json(handler, p or {"error": "Not found"})
    items = db_fetch_all("SELECT * FROM properties ORDER BY onboarded_at DESC")
    items = filter_items(items, qp, {
        "city": "city", "status": "status", "type": "type", "partner": "partner_name",
    })
    send_json(handler, paginate(items, qp))

def handle_admin_rooms(handler, qp, segments):
    item_id = get_id_from_segments(segments, "rooms")
    if handler.command == "POST" and "mutate" in segments and item_id:
        body = read_body(handler)
        fields, vals = [], []
        for f in ["name", "type", "capacity", "base_rate", "status", "floor"]:
            if f in body:
                fields.append(f"{f}=?")
                vals.append(body[f])
        if fields:
            vals.append(item_id)
            db_execute(f"UPDATE rooms SET {','.join(fields)} WHERE id=?", vals)
        return send_json(handler, {"ok": True})
    if handler.command == "POST" and not item_id:
        body = read_body(handler)
        rid = gen_id()
        db_execute(
            "INSERT INTO rooms (id,code,property_id,property_name,name,type,capacity,base_rate,status,floor) VALUES (?,?,?,?,?,?,?,?,?,?)",
            (rid, body.get("code", f"R-{rid[:6].upper()}"), body.get("property_id", ""),
             body.get("property_name", ""), body.get("name", ""), body.get("type", "Standard"),
             body.get("capacity", 2), body.get("base_rate", 0), body.get("status", "Available"),
             body.get("floor", 1)),
        )
        return send_json(handler, {"ok": True, "id": rid})
    items = db_fetch_all("SELECT * FROM rooms ORDER BY property_name,name")
    items = filter_items(items, qp, {
        "property": "property_name", "status": "status", "type": "type",
    })
    send_json(handler, paginate(items, qp))

def handle_admin_partners(handler, qp, segments):
    item_id = get_id_from_segments(segments, "partners")
    if item_id and "mutate" in segments and handler.command == "POST":
        body = read_body(handler)
        fields, vals = [], []
        for f in ["name", "company", "email", "phone", "city", "status", "commission_rate"]:
            if f in body:
                fields.append(f"{f}=?")
                vals.append(body[f])
        if fields:
            vals.append(item_id)
            db_execute(f"UPDATE partners SET {','.join(fields)} WHERE id=?", vals)
        return send_json(handler, {"ok": True})
    if item_id and item_id != "mutate":
        p = db_fetch("SELECT * FROM partners WHERE id=?", (item_id,))
        return send_json(handler, p or {"error": "Not found"})
    items = db_fetch_all("SELECT * FROM partners ORDER BY joined_at DESC")
    items = filter_items(items, qp, {"city": "city", "status": "status"})
    send_json(handler, paginate(items, qp))

def handle_admin_customers(handler, qp, segments):
    item_id = get_id_from_segments(segments, "customers")
    if item_id and "mutate" in segments and handler.command == "POST":
        body = read_body(handler)
        fields, vals = [], []
        for f in ["name", "email", "phone", "city", "status"]:
            if f in body:
                fields.append(f"{f}=?")
                vals.append(body[f])
        if fields:
            vals.append(item_id)
            db_execute(f"UPDATE customers SET {','.join(fields)} WHERE id=?", vals)
        return send_json(handler, {"ok": True})
    if item_id and item_id != "mutate":
        c = db_fetch("SELECT * FROM customers WHERE id=?", (item_id,))
        return send_json(handler, c or {"error": "Not found"})
    items = db_fetch_all("SELECT * FROM customers ORDER BY joined_at DESC")
    items = filter_items(items, qp, {"city": "city", "status": "status", "name": "name"})
    send_json(handler, paginate(items, qp))

def handle_admin_payouts(handler, qp, segments):
    item_id = get_id_from_segments(segments, "payouts")
    if item_id and "mutate" in segments and handler.command == "POST":
        body = read_body(handler)
        fields, vals = [], []
        for f in ["status", "utr", "note", "stage"]:
            if f in body:
                fields.append(f"{f}=?")
                vals.append(body[f])
        if fields:
            vals.append(item_id)
            db_execute(f"UPDATE payouts SET {','.join(fields)} WHERE id=?", vals)
        return send_json(handler, {"ok": True})
    items = db_fetch_all("SELECT * FROM payouts ORDER BY requested_at DESC")
    items = filter_items(items, qp, {"status": "status", "partner": "partner_name"})
    send_json(handler, paginate(items, qp))

def handle_admin_refunds(handler, qp, segments):
    item_id = get_id_from_segments(segments, "refunds")
    if item_id and "mutate" in segments and handler.command == "POST":
        body = read_body(handler)
        act = body.get("action", body.get("status", ""))
        if act:
            db_execute("UPDATE refunds SET status=? WHERE id=?", (act.capitalize(), item_id))
        return send_json(handler, {"ok": True})
    items = db_fetch_all("SELECT * FROM refunds ORDER BY requested_at DESC")
    items = filter_items(items, qp, {"status": "status", "customer": "customer_name"})
    send_json(handler, paginate(items, qp))

def handle_admin_reviews(handler, qp, segments):
    item_id = get_id_from_segments(segments, "reviews")
    if item_id and "mutate" in segments and handler.command == "POST":
        body = read_body(handler)
        fields, vals = [], []
        for f in ["status", "response"]:
            if f in body:
                fields.append(f"{f}=?")
                vals.append(body[f])
        if fields:
            now = now_iso()
            if "response" in body:
                fields.append("replied_on=?")
                vals.append(now)
            vals.append(item_id)
            db_execute(f"UPDATE reviews SET {','.join(fields)} WHERE id=?", vals)
        return send_json(handler, {"ok": True})
    items = db_fetch_all("SELECT * FROM reviews ORDER BY created_at DESC")
    items = filter_items(items, qp, {"status": "status", "property": "property_name"})
    send_json(handler, paginate(items, qp))

def handle_admin_tickets(handler, qp, segments):
    item_id = get_id_from_segments(segments, "tickets")
    if item_id and "mutate" in segments and handler.command == "POST":
        body = read_body(handler)
        fields, vals = [], []
        for f in ["status", "priority", "agent"]:
            if f in body:
                fields.append(f"{f}=?")
                vals.append(body[f])
        if fields:
            vals.append(item_id)
            db_execute(f"UPDATE tickets SET {','.join(fields)} WHERE id=?", vals)
        return send_json(handler, {"ok": True})
    items = db_fetch_all("SELECT * FROM tickets ORDER BY created_at DESC")
    items = filter_items(items, qp, {"status": "status", "priority": "priority", "category": "category"})
    send_json(handler, paginate(items, qp))

def handle_admin_coupons(handler, qp, segments):
    item_id = get_id_from_segments(segments, "coupons")
    if handler.command == "POST" and not item_id:
        body = read_body(handler)
        cid = gen_id()
        db_execute(
            "INSERT INTO coupons (id,code,description,type,value,min_booking,max_discount,coupon_limit,valid_from,valid_to,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            (cid, body.get("code", ""), body.get("description", ""), body.get("type", "flat"),
             body.get("value", 0), body.get("min_booking", 0), body.get("max_discount"),
             body.get("coupon_limit", 0), body.get("valid_from", now_iso()),
             body.get("valid_to", now_iso()), body.get("status", "Active")),
        )
        return send_json(handler, {"ok": True, "id": cid})
    if handler.command == "PUT" and item_id:
        body = read_body(handler)
        fields, vals = [], []
        for f in ["code", "description", "type", "value", "min_booking", "max_discount", "coupon_limit", "valid_from", "valid_to", "status"]:
            if f in body:
                fields.append(f"{f}=?")
                vals.append(body[f])
        if fields:
            vals.append(item_id)
            db_execute(f"UPDATE coupons SET {','.join(fields)} WHERE id=?", vals)
        return send_json(handler, {"ok": True})
    items = db_fetch_all("SELECT * FROM coupons ORDER BY valid_from DESC")
    items = filter_items(items, qp, {"status": "status", "type": "type"})
    send_json(handler, paginate(items, qp))

def handle_admin_campaigns(handler, qp):
    items = db_fetch_all("SELECT * FROM campaigns ORDER BY scheduled_at DESC")
    items = filter_items(items, qp, {"status": "status", "channel": "channel"})
    send_json(handler, paginate(items, qp))

def handle_admin_audit_logs(handler, qp):
    items = db_fetch_all("SELECT * FROM audit_logs ORDER BY at DESC")
    items = filter_items(items, qp, {"actor": "actor", "action": "action", "role": "role"})
    send_json(handler, paginate(items, qp))

def handle_admin_fraud(handler, qp, segments):
    item_id = get_id_from_segments(segments, "fraud")
    if item_id and "mutate" in segments and handler.command == "POST":
        body = read_body(handler)
        act = body.get("action", body.get("status", ""))
        if act:
            db_execute("UPDATE fraud_alerts SET status=? WHERE id=?", (act.capitalize(), item_id))
        return send_json(handler, {"ok": True})
    items = db_fetch_all("SELECT * FROM fraud_alerts ORDER BY detected_at DESC")
    items = filter_items(items, qp, {"status": "status", "type": "type"})
    send_json(handler, paginate(items, qp))

def handle_admin_admin_users(handler, qp):
    items = db_fetch_all("SELECT id,name,email,role,role_name,status FROM admin_users ORDER BY created_at DESC")
    items = filter_items(items, qp, {"status": "status", "role": "role", "name": "name"})
    send_json(handler, paginate(items, qp))

def handle_admin_pricing_rules(handler, qp):
    items = db_fetch_all("SELECT * FROM pricing_rules ORDER BY updated_at DESC")
    items = filter_items(items, qp, {"status": "status", "scope": "scope"})
    send_json(handler, paginate(items, qp))

def handle_admin_reports(handler, qp):
    report = {
        "revenue": {
            "total": db_fetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings").get("s", 0),
            "this_month": db_fetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings WHERE created_at >= date('now','start of month')").get("s", 0),
        },
        "bookings": {
            "total": db_fetch("SELECT COUNT(*) as c FROM bookings").get("c", 0),
            "confirmed": db_fetch("SELECT COUNT(*) as c FROM bookings WHERE status='Confirmed'").get("c", 0),
            "cancelled": db_fetch("SELECT COUNT(*) as c FROM bookings WHERE status='Cancelled'").get("c", 0),
        },
        "occupancy_rate": db_fetch("SELECT COALESCE(AVG(occupancy),0) as a FROM properties").get("a", 0),
        "avg_rating": db_fetch("SELECT COALESCE(AVG(rating),0) as a FROM properties WHERE rating > 0").get("a", 0),
    }
    send_json(handler, report)

def handle_admin_settings(handler, qp, body=None):
    if handler.command == "POST" and body:
        send_json(handler, {"ok": True, "message": "Settings saved"})
    else:
        send_json(handler, {
            "site_name": "CheckDin",
            "currency": "INR",
            "tax_rate": 18,
            "commission_rate": 15,
            "min_booking_amount": 100,
            "support_email": "support@checkdin.com",
            "maintenance_mode": False,
        })

# ---------------------------------------------------------------------------
# CUSTOMER ROUTES
# ---------------------------------------------------------------------------
def handle_customer_hotels(handler, qp, segments):
    item_id = get_id_from_segments(segments, "hotels")
    if item_id:
        h = db_fetch("SELECT * FROM hotels WHERE id=?", (item_id,))
        if not h:
            return send_error(handler, 404, "Hotel not found")
        rooms = db_fetch_all("SELECT * FROM rooms WHERE property_id=?", (item_id,))
        pricing = db_fetch("SELECT * FROM slot_pricing WHERE property_id=?", (item_id,))
        return send_json(handler, {**h, "rooms": rooms, "pricing": row_to_dict(pricing)})
    search = qp.get("search", [None])[0]
    city = qp.get("city", [None])[0]
    items = db_fetch_all("SELECT * FROM hotels ORDER BY rating DESC")
    if search:
        s = search.lower()
        items = [h for h in items if s in h.get("name", "").lower() or s in h.get("area", "").lower()]
    if city:
        items = [h for h in items if h.get("city", "").lower() == city.lower()]
    send_json(handler, paginate(items, qp))

def handle_customer_bookings(handler, qp, user_info, segments):
    item_id = get_id_from_segments(segments, "bookings")
    if not user_info:
        return send_error(handler, 401, "Login required")
    cid = user_info["user_id"]
    if item_id:
        if "cancel" in segments and handler.command == "POST":
            b = db_fetch("SELECT * FROM customer_bookings WHERE id=? AND customer_id=?", (item_id, cid))
            if not b:
                return send_error(handler, 404, "Booking not found")
            db_execute("UPDATE customer_bookings SET status=? WHERE id=?", ("cancelled", item_id))
            return send_json(handler, {"ok": True})
        if "rate" in segments and handler.command == "POST":
            body = read_body(handler)
            b = db_fetch("SELECT * FROM customer_bookings WHERE id=? AND customer_id=?", (item_id, cid))
            if not b:
                return send_error(handler, 404, "Booking not found")
            db_execute("UPDATE customer_bookings SET rated=1 WHERE id=?", (item_id,))
            rid = gen_id()
            db_execute(
                "INSERT INTO reviews (id,property_id,property_name,customer_name,rating,title,body,created_at,room,duration,stayed_on) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                (rid, b.get("hotel_id", ""), "Hotel", user_info.get("name", "Guest"),
                 body.get("rating", 5), body.get("title", ""), body.get("body", ""),
                 now_iso(), "", b.get("duration", 0), b.get("date", "")),
            )
            return send_json(handler, {"ok": True, "review_id": rid})
        b = db_fetch("SELECT * FROM customer_bookings WHERE id=? AND customer_id=?", (item_id, cid))
        return send_json(handler, b or {"error": "Not found"})
    if handler.command == "POST":
        body = read_body(handler)
        bid = gen_id()
        ref = make_ref("CBK")
        hotel = db_fetch("SELECT * FROM hotels WHERE id=?", (body.get("hotel_id", ""),))
        amount = body.get("amount", 0)
        if not amount and hotel:
            dur = body.get("duration", 3)
            if dur <= 3:
                amount = hotel.get("rate_3h", 0)
            elif dur <= 6:
                amount = hotel.get("rate_6h", 0)
            else:
                amount = hotel.get("rate_12h", 0)
        db_execute(
            "INSERT INTO customer_bookings (id,reference,hotel_id,date,check_in,duration,guests,amount,status,otp,customer_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            (bid, ref, body.get("hotel_id", ""), body.get("date", now_iso()[:10]),
             body.get("check_in", "14:00"), body.get("duration", 3), body.get("guests", 1),
             amount, "ongoing", str(uuid.uuid4().int % 1000000).zfill(6), cid),
        )
        return send_json(handler, {"ok": True, "id": bid, "reference": ref, "otp": body.get("otp", "")})
    items = db_fetch_all("SELECT * FROM customer_bookings WHERE customer_id=? ORDER BY date DESC", (cid,))
    send_json(handler, paginate(items, qp))

def handle_customer_leads(handler, body):
    lid = gen_id()
    db_execute(
        "INSERT INTO property_leads (id,property_name,contact_name,mobile,whatsapp,email,city,property_type,total_rooms,short_stay_interest,couple_friendly,source,comments,consent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (lid, body.get("property_name", ""), body.get("contact_name", ""),
         body.get("mobile", ""), body.get("whatsapp", ""), body.get("email", ""),
         body.get("city", ""), body.get("property_type", ""), body.get("total_rooms", 0),
         body.get("short_stay_interest", 0), body.get("couple_friendly", 0),
         body.get("source", "website"), body.get("comments", ""),
         body.get("consent", 0)),
    )
    send_json(handler, {"ok": True, "id": lid})

# ---------------------------------------------------------------------------
# PARTNER ROUTES
# ---------------------------------------------------------------------------
def get_partner_hotel_id(user_info):
    if not user_info or user_info["user_type"] != "partner":
        return None
    u = db_fetch("SELECT hotel_id FROM partner_users WHERE id=?", (user_info["user_id"],))
    return u.get("hotel_id") if u else None

def handle_partner_dashboard(handler, qp, user_info):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    stats = {}
    stats["total_bookings"] = db_fetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=?", (hid,)).get("c", 0)
    stats["active_bookings"] = db_fetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=? AND status='ongoing'", (hid,)).get("c", 0)
    stats["total_revenue"] = db_fetch("SELECT COALESCE(SUM(amount),0) as s FROM customer_bookings WHERE hotel_id=?", (hid,)).get("s", 0)
    stats["today_bookings"] = db_fetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=? AND date=?", (hid, now_iso()[:10])).get("c", 0)
    stats["rooms_available"] = db_fetch("SELECT COUNT(*) as c FROM rooms WHERE property_id=? AND status='Available'", (hid,)).get("c", 0)
    stats["avg_rating"] = db_fetch("SELECT COALESCE(AVG(rating),0) as a FROM reviews WHERE property_id=?", (hid,)).get("a", 0)
    stats["pending_reviews"] = db_fetch("SELECT COUNT(*) as c FROM reviews WHERE property_id=? AND status='Pending'", (hid,)).get("c", 0)
    stats["open_tickets"] = db_fetch("SELECT COUNT(*) as c FROM support_tickets WHERE property_id=? AND status='Open'", (hid,)).get("c", 0)
    send_json(handler, stats)

def handle_partner_bookings(handler, qp, user_info, segments):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    item_id = get_id_from_segments(segments, "bookings")
    if item_id and handler.command == "POST":
        action = ""
        for a in ["approve", "reject", "checkin", "checkout", "cancel"]:
            if a in segments:
                action = a
                break
        if not action:
            return send_error(handler, 400, "Action required")
        now = now_iso()
        status_map = {"approve": "confirmed", "reject": "rejected", "checkin": "checked_in", "checkout": "checked_out", "cancel": "cancelled"}
        db_execute("UPDATE customer_bookings SET status=? WHERE id=? AND hotel_id=?", (status_map.get(action, action), item_id, hid))
        if action == "checkin":
            db_execute("UPDATE customer_bookings SET check_in_time=? WHERE id=?", (now, item_id))
        elif action == "checkout":
            db_execute("UPDATE customer_bookings SET check_out_time=? WHERE id=?", (now, item_id))
        return send_json(handler, {"ok": True, "status": status_map.get(action)})
    items = db_fetch_all("SELECT * FROM customer_bookings WHERE hotel_id=? ORDER BY date DESC", (hid,))
    items = filter_items(items, qp, {"status": "status"})
    send_json(handler, paginate(items, qp))

def handle_partner_rooms(handler, qp, user_info):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    if handler.command == "PUT":
        body = read_body(handler)
        rid = body.get("id", "")
        if rid:
            fields, vals = [], []
            for f in ["name", "type", "capacity", "base_rate", "status"]:
                if f in body:
                    fields.append(f"{f}=?")
                    vals.append(body[f])
            if fields:
                vals.append(rid)
                db_execute(f"UPDATE rooms SET {','.join(fields)} WHERE id=? AND property_id=?", vals + [hid])
        return send_json(handler, {"ok": True})
    items = db_fetch_all("SELECT * FROM rooms WHERE property_id=? ORDER BY name", (hid,))
    send_json(handler, {"data": items, "total": len(items)})

def handle_partner_pricing(handler, qp, user_info):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    if handler.command == "PUT":
        body = read_body(handler)
        p = db_fetch("SELECT * FROM slot_pricing WHERE property_id=?", (hid,))
        if p:
            fields, vals = [], []
            for f in ["price_3h", "price_6h", "price_12h", "extra_hour", "weekend_surcharge", "active_3h", "active_6h", "active_12h"]:
                if f in body:
                    fields.append(f"{f}=?")
                    vals.append(body[f])
            if fields:
                vals.append(hid)
                db_execute(f"UPDATE slot_pricing SET {','.join(fields)} WHERE property_id=?", vals)
        else:
            db_execute(
                "INSERT INTO slot_pricing (id,property_id,price_3h,price_6h,price_12h,extra_hour,weekend_surcharge) VALUES (?,?,?,?,?,?,?)",
                (gen_id(), hid, body.get("price_3h", 0), body.get("price_6h", 0), body.get("price_12h", 0), body.get("extra_hour", 0), body.get("weekend_surcharge", 0)),
            )
        return send_json(handler, {"ok": True})
    p = db_fetch("SELECT * FROM slot_pricing WHERE property_id=?", (hid,))
    send_json(handler, row_to_dict(p) or {})

def handle_partner_availability(handler, qp, user_info, segments):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    date_param = get_id_from_segments(segments, "availability")
    if date_param and handler.command == "PUT":
        body = read_body(handler)
        d = db_fetch("SELECT * FROM day_availability WHERE property_id=? AND date=?", (hid, date_param))
        if d:
            fields, vals = [], []
            for f in ["allocated", "booked", "blocked"]:
                if f in body:
                    fields.append(f"{f}=?")
                    vals.append(body[f])
            if fields:
                vals.extend([hid, date_param])
                db_execute(f"UPDATE day_availability SET {','.join(fields)} WHERE property_id=? AND date=?", vals)
        else:
            db_execute(
                "INSERT INTO day_availability (id,property_id,date,day,allocated,booked,blocked) VALUES (?,?,?,?,?,?,?)",
                (gen_id(), hid, date_param, body.get("day", ""), body.get("allocated", 0), body.get("booked", 0), body.get("blocked", 0)),
            )
        return send_json(handler, {"ok": True})
    items = db_fetch_all("SELECT * FROM day_availability WHERE property_id=? ORDER BY date", (hid,))
    send_json(handler, {"data": items, "total": len(items)})

def handle_partner_reviews(handler, qp, user_info, segments):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    item_id = get_id_from_segments(segments, "reviews")
    if item_id and "reply" in segments and handler.command == "POST":
        body = read_body(handler)
        db_execute("UPDATE reviews SET response=?, replied_on=? WHERE id=? AND property_id=?",
                   (body.get("response", ""), now_iso(), item_id, hid))
        return send_json(handler, {"ok": True})
    items = db_fetch_all("SELECT * FROM reviews WHERE property_id=? ORDER BY created_at DESC", (hid,))
    send_json(handler, {"data": items, "total": len(items)})

def handle_partner_revenue(handler, qp, user_info):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    items = db_fetch_all("SELECT * FROM earnings WHERE property_id=? ORDER BY date DESC", (hid,))
    total_gross = sum(i.get("gross", 0) for i in items)
    total_commission = sum(i.get("commission", 0) for i in items)
    total_net = sum(i.get("net", 0) for i in items)
    send_json(handler, {"data": items, "total_gross": total_gross, "total_commission": total_commission, "total_net": total_net})

def handle_partner_payouts(handler, qp, user_info):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    items = db_fetch_all("SELECT * FROM payouts WHERE partner_id=? ORDER BY requested_at DESC", (hid,))
    send_json(handler, {"data": items, "total": len(items)})

def handle_partner_reports(handler, qp, user_info):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    report = {
        "total_bookings": db_fetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=?", (hid,)).get("c", 0),
        "total_revenue": db_fetch("SELECT COALESCE(SUM(amount),0) as s FROM customer_bookings WHERE hotel_id=?", (hid,)).get("s", 0),
        "avg_rating": db_fetch("SELECT COALESCE(AVG(rating),0) as a FROM reviews WHERE property_id=?", (hid,)).get("a", 0),
        "rooms": db_fetch("SELECT COUNT(*) as c FROM rooms WHERE property_id=?", (hid,)).get("c", 0),
    }
    send_json(handler, report)

def handle_partner_audit_log(handler, qp, user_info):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    items = db_fetch_all("SELECT * FROM partner_audit_logs WHERE property_id=? ORDER BY time DESC", (hid,))
    send_json(handler, {"data": items, "total": len(items)})

def handle_partner_support(handler, qp, user_info):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    items = db_fetch_all("SELECT * FROM support_tickets WHERE property_id=? ORDER BY created_on DESC", (hid,))
    send_json(handler, {"data": items, "total": len(items)})

def handle_partner_settings(handler, qp, user_info):
    hid = get_partner_hotel_id(user_info)
    if not hid:
        return send_error(handler, 403, "Partner access required")
    hotel = db_fetch("SELECT * FROM hotels WHERE id=?", (hid,))
    send_json(handler, row_to_dict(hotel) or {"error": "Hotel not found"})

# ---------------------------------------------------------------------------
# HTTP Request Handler
# ---------------------------------------------------------------------------
class RequestHandler(BaseHTTPRequestHandler):

    def log_message(self, fmt, *args):
        pass

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type,Authorization")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        self._route("GET")

    def do_POST(self):
        self._route("POST")

    def do_PUT(self):
        self._route("PUT")

    def do_DELETE(self):
        self._route("DELETE")

    def _route(self, method):
        self.command = method
        parsed = urlparse(self.path)
        path = unquote(parsed.path).rstrip("/") or "/"
        segments = [s for s in path.split("/") if s]
        qp = parse_qs(parsed.query)
        user_info = auth_from_header(self)

        try:
            if path == "/":
                return send_json(self, {"status": "ok", "server": "CheckDin Backend", "version": "1.0"})

            # ---- AUTH ROUTES ----
            if path == "/api/auth/login/admin" and method == "POST":
                return handle_auth_login_admin(self, read_body(self))
            if path == "/api/auth/login/customer" and method == "POST":
                return handle_auth_login_customer(self, read_body(self))
            if path == "/api/auth/login/partner" and method == "POST":
                return handle_auth_login_partner(self, read_body(self))
            if path == "/api/auth/me":
                if not user_info:
                    return send_error(self, 401, "Auth required")
                return handle_auth_me(self, user_info)
            if path == "/api/auth/profile" and method == "PUT":
                if not user_info:
                    return send_error(self, 401, "Auth required")
                return handle_auth_profile(self, user_info, read_body(self))

            # ---- ADMIN ROUTES ----
            if path.startswith("/api/admin"):
                if not require_admin(user_info):
                    return send_error(self, 403, "Admin access required")
                if path == "/api/admin/dashboard":
                    return handle_admin_dashboard(self, qp)
                if path.startswith("/api/admin/bookings"):
                    return handle_admin_bookings(self, qp, segments)
                if path.startswith("/api/admin/properties"):
                    return handle_admin_properties(self, qp, segments)
                if path.startswith("/api/admin/rooms"):
                    return handle_admin_rooms(self, qp, segments)
                if path.startswith("/api/admin/partners"):
                    return handle_admin_partners(self, qp, segments)
                if path.startswith("/api/admin/customers"):
                    return handle_admin_customers(self, qp, segments)
                if path.startswith("/api/admin/payouts"):
                    return handle_admin_payouts(self, qp, segments)
                if path.startswith("/api/admin/refunds"):
                    return handle_admin_refunds(self, qp, segments)
                if path.startswith("/api/admin/reviews"):
                    return handle_admin_reviews(self, qp, segments)
                if path.startswith("/api/admin/tickets"):
                    return handle_admin_tickets(self, qp, segments)
                if path.startswith("/api/admin/coupons"):
                    return handle_admin_coupons(self, qp, segments)
                if path.startswith("/api/admin/campaigns"):
                    return handle_admin_campaigns(self, qp)
                if path.startswith("/api/admin/audit-logs"):
                    return handle_admin_audit_logs(self, qp)
                if path.startswith("/api/admin/fraud"):
                    return handle_admin_fraud(self, qp, segments)
                if path.startswith("/api/admin/admin-users"):
                    return handle_admin_admin_users(self, qp)
                if path.startswith("/api/admin/pricing-rules"):
                    return handle_admin_pricing_rules(self, qp)
                if path.startswith("/api/admin/reports"):
                    return handle_admin_reports(self, qp)
                if path.startswith("/api/admin/settings"):
                    return handle_admin_settings(self, qp, read_body(self) if method == "POST" else None)

            # ---- CUSTOMER ROUTES ----
            if path.startswith("/api/customer"):
                if path.startswith("/api/customer/hotels"):
                    return handle_customer_hotels(self, qp, segments)
                if path.startswith("/api/customer/bookings"):
                    return handle_customer_bookings(self, qp, user_info, segments)
                if path == "/api/customer/leads" and method == "POST":
                    return handle_customer_leads(self, read_body(self))

            # ---- PARTNER ROUTES ----
            if path.startswith("/api/partner"):
                if not require_partner(user_info):
                    return send_error(self, 403, "Partner access required")
                if path == "/api/partner/dashboard":
                    return handle_partner_dashboard(self, qp, user_info)
                if path.startswith("/api/partner/bookings"):
                    return handle_partner_bookings(self, qp, user_info, segments)
                if path.startswith("/api/partner/rooms"):
                    return handle_partner_rooms(self, qp, user_info)
                if path.startswith("/api/partner/pricing"):
                    return handle_partner_pricing(self, qp, user_info)
                if path.startswith("/api/partner/availability"):
                    return handle_partner_availability(self, qp, user_info, segments)
                if path.startswith("/api/partner/reviews"):
                    return handle_partner_reviews(self, qp, user_info, segments)
                if path.startswith("/api/partner/revenue"):
                    return handle_partner_revenue(self, qp, user_info)
                if path.startswith("/api/partner/payouts"):
                    return handle_partner_payouts(self, qp, user_info)
                if path.startswith("/api/partner/reports"):
                    return handle_partner_reports(self, qp, user_info)
                if path.startswith("/api/partner/audit-log"):
                    return handle_partner_audit_log(self, qp, user_info)
                if path.startswith("/api/partner/support"):
                    return handle_partner_support(self, qp, user_info)
                if path.startswith("/api/partner/settings"):
                    return handle_partner_settings(self, qp, user_info)

            send_error(self, 404, "Not found")

        except Exception as e:
            traceback.print_exc()
            send_error(self, 500, str(e))


# ---------------------------------------------------------------------------
# Server Entry Point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), RequestHandler)
    print(f"CheckDin Backend running on http://{HOST}:{PORT}")
    server.serve_forever()
