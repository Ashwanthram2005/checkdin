#!/usr/bin/env node
"use strict";

const fastify = require("fastify")({ logger: false });
const cors = require("@fastify/cors");
const { Pool } = require("pg");
const crypto = require("crypto");

const PORT = parseInt(process.env.PORT, 10) || 3001;
const HOST = process.env.HOST || "0.0.0.0";
const SECRET = process.env.SECRET || "checkdin-secret-key-change-in-production";
const TOKEN_TTL = 86400 * 7;

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: parseInt(process.env.PGPORT, 10) || 5432,
  database: process.env.PGDATABASE || "checkdin",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "postgres",
  max: 20,
});

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

function genId() { return crypto.randomBytes(6).toString("hex"); }
function nowIso() { return new Date().toISOString().replace(/\.\d{3}Z$/, ""); }
function hashPassword(pw) { return crypto.createHash("sha256").update(pw).digest("hex"); }
function makeRef(prefix = "REF") { return `${prefix}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`; }

function createToken(userId, userType, role = "user") {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL;
  const payload = `${userId}|${userType}|${role}|${exp}`;
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(payloadB64).digest("hex");
  return `${payloadB64}.${sig}`;
}

function verifyToken(token) {
  try {
    const [payloadB64, sig] = token.split(".", 2);
    if (!payloadB64 || !sig) return null;
    const expected = crypto.createHmac("sha256", SECRET).update(payloadB64).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
    const payload = Buffer.from(payloadB64, "base64url").toString();
    const [uid, utype, role, exp] = payload.split("|", 4);
    if (parseInt(exp, 10) < Math.floor(Date.now() / 1000)) return null;
    return { user_id: uid, user_type: utype, role };
  } catch { return null; }
}

function authFromRequest(request) {
  const auth = request.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return verifyToken(auth.slice(7));
  return null;
}

async function dbFetch(query, params = []) {
  const { rows } = await pool.query(query, params);
  return rows[0] || null;
}
async function dbFetchAll(query, params = []) {
  const { rows } = await pool.query(query, params);
  return rows;
}
async function dbExecute(query, params = []) {
  await pool.query(query, params);
}

function paginate(items, query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  let limit = parseInt(query.limit, 10) || 20;
  if (limit <= 0) limit = 20;
  const offset = (page - 1) * limit;
  const total = items.length;
  return { data: items.slice(offset, offset + limit), total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}

function filterItems(items, query, fieldMap) {
  let result = items;
  for (const [qpKey, col] of Object.entries(fieldMap)) {
    const val = query[qpKey];
    if (val) {
      const valLower = val.toLowerCase();
      result = result.filter(r => String(r[col] ?? "").toLowerCase().includes(valLower));
    }
  }
  return result;
}

function getIdFromSegments(segments, after) {
  const idx = segments.indexOf(after);
  return (idx !== -1 && idx + 1 < segments.length) ? segments[idx + 1] : null;
}

// ---------------------------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------------------------
async function handleAuthLoginAdmin(request, reply) {
  const { email = "", password = "" } = request.body || {};
  const trimmedEmail = email.trim();
  if (!trimmedEmail || !password) return reply.code(400).send({ error: "Email and password required" });
  const user = await dbFetch("SELECT * FROM admin_users WHERE email=$1", [trimmedEmail]);
  if (!user || hashPassword(password) !== user.password_hash) return reply.code(401).send({ error: "Invalid credentials" });
  if (user.status !== "Active") return reply.code(403).send({ error: "Account disabled" });
  const token = createToken(user.id, "admin", user.role || "admin");
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, role_name: user.role_name } };
}

async function handleAuthLoginCustomer(request, reply) {
  const body = request.body || {};
  let email = (body.email || body.phone || "").trim();
  const phone = (body.phone || "").trim();
  const name = (body.name || "Guest").trim();
  if (!email) return reply.code(400).send({ error: "Email or phone required" });
  const phoneVal = phone || email;
  let user = await dbFetch("SELECT * FROM customers WHERE email=$1 OR phone=$2", [email, phoneVal]);
  if (!user) {
    const cid = genId();
    await dbExecute("INSERT INTO customers (id,name,email,phone,city,joined_at,status) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [cid, name, email, phoneVal, body.city || "", nowIso(), "Active"]);
    user = await dbFetch("SELECT * FROM customers WHERE id=$1", [cid]);
  }
  const token = createToken(user.id, "customer");
  return { token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } };
}

async function handleAuthLoginPartner(request, reply) {
  const body = request.body || {};
  const hotelId = (body.hotelId || body.hotel_id || "").trim();
  const userId = (body.userId || body.user_id || "").trim();
  const userPassword = (body.userPassword || body.user_password || "").trim();
  if (hotelId && !userId) {
    const users = await dbFetchAll("SELECT id,name,role_id,active FROM partner_users WHERE hotel_id=$1 AND active=1", [hotelId]);
    return { step: 2, users };
  }
  if (!userId || !userPassword) return reply.code(400).send({ error: "userId and userPassword required" });
  const user = await dbFetch("SELECT * FROM partner_users WHERE id=$1 AND hotel_id=$2", [userId, hotelId]);
  if (!user) return reply.code(401).send({ error: "User not found" });
  if (hashPassword(userPassword) !== user.password_hash) return reply.code(401).send({ error: "Invalid password" });
  if (!user.active) return reply.code(403).send({ error: "Account disabled" });
  await dbExecute("UPDATE partner_users SET last_login=$1 WHERE id=$2", [nowIso(), userId]);
  const token = createToken(userId, "partner", user.role_id || "manager");
  return { token, user: { id: user.id, name: user.name, role_id: user.role_id, hotel_id: user.hotel_id } };
}

async function handleAuthMe(request, reply) {
  const info = authFromRequest(request);
  if (!info) return reply.code(401).send({ error: "Auth required" });
  const { user_id: uid, user_type: utype } = info;
  let row;
  if (utype === "admin") row = await dbFetch("SELECT id,name,email,role,role_name FROM admin_users WHERE id=$1", [uid]);
  else if (utype === "customer") row = await dbFetch("SELECT id,name,email,phone,city FROM customers WHERE id=$1", [uid]);
  else if (utype === "partner") row = await dbFetch("SELECT id,name,hotel_id,role_id FROM partner_users WHERE id=$1", [uid]);
  else return reply.code(400).send({ error: "Unknown user type" });
  return row || { error: "User not found" };
}

async function handleAuthProfile(request, reply) {
  const info = authFromRequest(request);
  if (!info) return reply.code(401).send({ error: "Auth required" });
  if (info.user_type !== "customer") return reply.code(403).send({ error: "Customers only" });
  const body = request.body || {};
  const fields = [], vals = [];
  for (const f of ["name", "email", "phone", "city", "gender", "emergency_name", "emergency_phone", "emergency_relation"]) {
    if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); }
  }
  if (!fields.length) return reply.code(400).send({ error: "No fields to update" });
  vals.push(info.user_id);
  await dbExecute(`UPDATE customers SET ${fields.join(",")} WHERE id=$${vals.length}`, vals);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// ADMIN ROUTES
// ---------------------------------------------------------------------------
function num(v) { return Number(v) || 0; }

async function handleAdminDashboard(request, reply) {
  const stats = {};
  stats.total_properties = num((await dbFetch("SELECT COUNT(*) as c FROM properties")).c);
  stats.total_bookings = num((await dbFetch("SELECT COUNT(*) as c FROM bookings")).c);
  stats.total_customers = num((await dbFetch("SELECT COUNT(*) as c FROM customers")).c);
  stats.total_partners = num((await dbFetch("SELECT COUNT(*) as c FROM partners")).c);
  stats.total_revenue = num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings")).s);
  stats.pending_bookings = num((await dbFetch("SELECT COUNT(*) as c FROM bookings WHERE status='Pending'")).c);
  stats.active_properties = num((await dbFetch("SELECT COUNT(*) as c FROM properties WHERE status='Active'")).c);
  stats.pending_refunds = num((await dbFetch("SELECT COUNT(*) as c FROM refunds WHERE status='Requested'")).c);
  stats.open_tickets = num((await dbFetch("SELECT COUNT(*) as c FROM tickets WHERE status='Open'")).c);
  stats.open_fraud = num((await dbFetch("SELECT COUNT(*) as c FROM fraud_alerts WHERE status='Open'")).c);
  return stats;
}

async function handleAdminBookings(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "bookings");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {};
    const act = body.action || "";
    const allowed = ["approve", "cancel", "checkin", "checkout", "confirm", "pending"];
    if (!allowed.includes(act)) return reply.code(400).send({ error: `Invalid action: ${act}` });
    const now = nowIso();
    await dbExecute("UPDATE bookings SET status=$1 WHERE id=$2", [act.charAt(0).toUpperCase() + act.slice(1), itemId]);
    const b = await dbFetch("SELECT * FROM bookings WHERE id=$1", [itemId]);
    if (b) { let tl = []; try { tl = JSON.parse(b.timeline || "[]"); } catch {} tl.push({ action: act, at: now, by: "admin" }); await dbExecute("UPDATE bookings SET timeline=$1 WHERE id=$2", [JSON.stringify(tl), itemId]); }
    await writeAuditLog(request, "admin", `Booking ${act}`, "Booking", itemId);
    return { ok: true, status: act.charAt(0).toUpperCase() + act.slice(1) };
  }
  if (itemId && itemId !== "mutate") { const b = await dbFetch("SELECT * FROM bookings WHERE id=$1", [itemId]); return b || { error: "Not found" }; }
  let items = await dbFetchAll("SELECT * FROM bookings ORDER BY created_at DESC");
  items = filterItems(items, request.query, { status: "status", city: "city", customer: "customer_name", property: "property_name" });
  return paginate(items, request.query);
}

async function handleAdminProperties(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "properties");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["name", "city", "state", "address", "type", "status", "rooms", "rating"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE properties SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Property Updated", "Property", itemId);
    return { ok: true };
  }
  if (itemId && itemId !== "mutate") { const p = await dbFetch("SELECT * FROM properties WHERE id=$1", [itemId]); return p || { error: "Not found" }; }
  let items = await dbFetchAll("SELECT * FROM properties ORDER BY onboarded_at DESC");
  items = filterItems(items, request.query, { city: "city", status: "status", type: "type", partner: "partner_name" });
  return paginate(items, request.query);
}

async function handleAdminRooms(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "rooms");
  if (request.method === "POST" && segments.includes("mutate") && itemId) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["name", "type", "capacity", "base_rate", "status", "floor"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE rooms SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Room Updated", "Room", itemId);
    return { ok: true };
  }
  if (request.method === "POST" && !itemId) {
    const body = request.body || {}; const rid = genId();
    await dbExecute("INSERT INTO rooms (id,code,property_id,property_name,name,type,capacity,base_rate,status,floor) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [rid, body.code || `R-${rid.slice(0, 6).toUpperCase()}`, body.property_id || "", body.property_name || "", body.name || "", body.type || "Standard", body.capacity || 2, body.base_rate || 0, body.status || "Available", body.floor || 1]);
    await writeAuditLog(request, "admin", "Room Created", "Room", rid);
    return { ok: true, id: rid };
  }
  let items = await dbFetchAll("SELECT * FROM rooms ORDER BY property_name,name");
  items = filterItems(items, request.query, { property: "property_name", status: "status", type: "type" });
  return paginate(items, request.query);
}

async function handleAdminPartners(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "partners");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["name", "company", "email", "phone", "city", "status", "commission_rate"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE partners SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Partner Updated", "Partner", itemId);
    return { ok: true };
  }
  if (itemId && itemId !== "mutate") { const p = await dbFetch("SELECT * FROM partners WHERE id=$1", [itemId]); return p || { error: "Not found" }; }
  let items = await dbFetchAll("SELECT * FROM partners ORDER BY joined_at DESC");
  items = filterItems(items, request.query, { city: "city", status: "status" });
  return paginate(items, request.query);
}

async function handleAdminCustomers(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "customers");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["name", "email", "phone", "city", "status"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE customers SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Customer Updated", "Customer", itemId);
    return { ok: true };
  }
  if (itemId && itemId !== "mutate") { const c = await dbFetch("SELECT * FROM customers WHERE id=$1", [itemId]); return c || { error: "Not found" }; }
  let items = await dbFetchAll("SELECT * FROM customers ORDER BY joined_at DESC");
  items = filterItems(items, request.query, { city: "city", status: "status", name: "name" });
  return paginate(items, request.query);
}

async function handleAdminPayouts(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "payouts");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["status", "utr", "note", "stage"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE payouts SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Payout Updated", "Finance", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM payouts ORDER BY requested_at DESC");
  items = filterItems(items, request.query, { status: "status", partner: "partner_name" });
  return paginate(items, request.query);
}

async function handleAdminRefunds(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "refunds");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {}; const act = body.action || body.status || "";
    if (act) await dbExecute("UPDATE refunds SET status=$1 WHERE id=$2", [act.charAt(0).toUpperCase() + act.slice(1), itemId]);
    await writeAuditLog(request, "admin", `Refund ${act}`, "Finance", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM refunds ORDER BY requested_at DESC");
  items = filterItems(items, request.query, { status: "status", customer: "customer_name" });
  return paginate(items, request.query);
}

async function handleAdminReviews(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "reviews");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["status", "response"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { if ("response" in body) { fields.push(`replied_on=$${fields.length + 1}`); vals.push(nowIso()); } vals.push(itemId); await dbExecute(`UPDATE reviews SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Review Updated", "Content", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM reviews ORDER BY created_at DESC");
  items = filterItems(items, request.query, { status: "status", property: "property_name" });
  return paginate(items, request.query);
}

async function handleAdminTickets(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "tickets");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["status", "priority", "agent"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE tickets SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Ticket Updated", "Support", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM tickets ORDER BY created_at DESC");
  items = filterItems(items, request.query, { status: "status", priority: "priority", category: "category" });
  return paginate(items, request.query);
}

async function handleAdminCoupons(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "coupons");
  if (request.method === "POST" && !itemId) {
    const body = request.body || {}; const cid = genId();
    await dbExecute("INSERT INTO coupons (id,code,description,type,value,min_booking,max_discount,coupon_limit,valid_from,valid_to,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
      [cid, body.code || "", body.description || "", body.type || "flat", body.value || 0, body.min_booking || 0, body.max_discount || null, body.coupon_limit || 0, body.valid_from || nowIso(), body.valid_to || nowIso(), body.status || "Active"]);
    await writeAuditLog(request, "admin", "Coupon Created", "Marketing", cid);
    return { ok: true, id: cid };
  }
  if (request.method === "PUT" && itemId) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["code", "description", "type", "value", "min_booking", "max_discount", "coupon_limit", "valid_from", "valid_to", "status"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE coupons SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Coupon Updated", "Marketing", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM coupons ORDER BY valid_from DESC");
  items = filterItems(items, request.query, { status: "status", type: "type" });
  return paginate(items, request.query);
}

async function handleAdminCampaigns(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "campaigns");
  if (request.method === "POST" && !itemId) {
    const body = request.body || {}; const id = genId();
    await dbExecute("INSERT INTO campaigns (id,title,channel,audience,sent,delivered,opened,status,scheduled_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [id, body.title || "", body.channel || "Email", body.audience || "All Users", 0, 0, 0, body.status || "Draft", body.scheduled_at || null]);
    await writeAuditLog(request, "admin", "Campaign Created", "Marketing", id);
    return { ok: true, id };
  }
  if (itemId && request.method === "DELETE") {
    await dbExecute("DELETE FROM campaigns WHERE id=$1", [itemId]);
    await writeAuditLog(request, "admin", "Campaign Deleted", "Marketing", itemId);
    return { ok: true };
  }
  if (itemId && (request.method === "POST" || request.method === "PUT")) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["title", "channel", "audience", "status", "scheduled_at"]) {
      if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); }
    }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE campaigns SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Campaign Updated", "Marketing", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM campaigns ORDER BY scheduled_at DESC");
  items = filterItems(items, request.query, { status: "status", channel: "channel" });
  return paginate(items, request.query);
}

async function handleAdminAuditLogs(request, reply) {
  let items = await dbFetchAll("SELECT * FROM audit_logs ORDER BY at DESC");
  items = filterItems(items, request.query, { actor: "actor", action: "action", role: "role" });
  return paginate(items, request.query);
}

async function handleAdminFraud(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "fraud");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {}; const act = body.action || body.status || "";
    if (act) await dbExecute("UPDATE fraud_alerts SET status=$1 WHERE id=$2", [act.charAt(0).toUpperCase() + act.slice(1), itemId]);
    await writeAuditLog(request, "admin", `Fraud Alert ${act}`, "Security", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM fraud_alerts ORDER BY detected_at DESC");
  items = filterItems(items, request.query, { status: "status", type: "type" });
  return paginate(items, request.query);
}

async function handleAdminAdminUsers(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "admin-users");
  if (request.method === "POST" && !itemId) {
    const body = request.body || {}; const id = genId();
    const name = (body.name || "").trim(); const email = (body.email || "").trim();
    const role = body.role || "support"; const roleName = body.role_name || body.roleName || "Support Admin";
    const password = body.password || "ChangeMe@123";
    if (!name || !email) return reply.code(400).send({ error: "Name and email required" });
    const existing = await dbFetch("SELECT id FROM admin_users WHERE email=$1", [email]);
    if (existing) return reply.code(409).send({ error: "Email already exists" });
    await dbExecute("INSERT INTO admin_users (id,name,email,password_hash,role,role_name,status,two_factor,last_active,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [id, name, email, hashPassword(password), role, roleName, body.status || "Active", 0, null, nowIso()]);
    await writeAuditLog(request, "admin", "Admin User Created", "Admin", id);
    return { ok: true, id };
  }
  if (itemId && request.method === "DELETE") {
    await dbExecute("DELETE FROM admin_users WHERE id=$1", [itemId]);
    await writeAuditLog(request, "admin", "Admin User Deleted", "Admin", itemId);
    return { ok: true };
  }
  if (itemId && (request.method === "POST" || request.method === "PUT")) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["name", "email", "role", "role_name", "status", "two_factor"]) {
      if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); }
    }
    if ("password" in body && body.password) { fields.push(`password_hash=$${fields.length + 1}`); vals.push(hashPassword(body.password)); }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE admin_users SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Admin User Updated", "Admin", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT id,name,email,role,role_name,status,two_factor,last_active,created_at FROM admin_users ORDER BY created_at DESC");
  items = filterItems(items, request.query, { status: "status", role: "role", name: "name" });
  return paginate(items, request.query);
}

async function handleAdminPricingRules(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "pricing-rules");
  if (request.method === "POST" && !itemId) {
    const body = request.body || {}; const id = genId();
    await dbExecute("INSERT INTO pricing_rules (id,name,scope,trigger,adjustment,channel,status,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [id, body.name || "", body.scope || "All", body.trigger || "", body.adjustment || "0%", body.channel || "All", body.status || "Active", nowIso()]);
    await writeAuditLog(request, "admin", "Pricing Rule Created", "Pricing", id);
    return { ok: true, id };
  }
  if (itemId && request.method === "DELETE") {
    await dbExecute("DELETE FROM pricing_rules WHERE id=$1", [itemId]);
    await writeAuditLog(request, "admin", "Pricing Rule Deleted", "Pricing", itemId);
    return { ok: true };
  }
  if (itemId && (request.method === "POST" || request.method === "PUT")) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["name", "scope", "trigger", "adjustment", "channel", "status"]) {
      if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); }
    }
    fields.push(`updated_at=$${fields.length + 1}`); vals.push(nowIso());
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE pricing_rules SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Pricing Rule Updated", "Pricing", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM pricing_rules ORDER BY updated_at DESC");
  items = filterItems(items, request.query, { status: "status", scope: "scope" });
  return paginate(items, request.query);
}

async function handleAdminReports(request, reply) {
  const qp = request.query;
  const from = qp.from || "2025-01-01";
  const to = qp.to || "2025-12-31";
  return {
    revenue: {
      total: num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings")).s),
      this_month: num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings WHERE created_at >= date_trunc('month', NOW())::text")).s),
      in_range: num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings WHERE created_at >= $1 AND created_at <= $2", [from, to])).s),
    },
    bookings: {
      total: num((await dbFetch("SELECT COUNT(*) as c FROM bookings")).c),
      confirmed: num((await dbFetch("SELECT COUNT(*) as c FROM bookings WHERE status='Confirmed'")).c),
      cancelled: num((await dbFetch("SELECT COUNT(*) as c FROM bookings WHERE status='Cancelled'")).c),
      in_range: num((await dbFetch("SELECT COUNT(*) as c FROM bookings WHERE created_at >= $1 AND created_at <= $2", [from, to])).c),
    },
    occupancy_rate: num((await dbFetch("SELECT COALESCE(AVG(occupancy),0) as a FROM properties")).a),
    avg_rating: num((await dbFetch("SELECT COALESCE(AVG(rating),0) as a FROM properties WHERE rating > 0")).a),
    top_properties: await dbFetchAll("SELECT name, city, revenue, rating FROM properties ORDER BY revenue DESC LIMIT 5"),
    top_partners: await dbFetchAll("SELECT name, city, revenue FROM partners ORDER BY revenue DESC LIMIT 5"),
    bookings_by_status: await dbFetchAll("SELECT status, COUNT(*) as count FROM bookings GROUP BY status"),
    revenue_by_city: await dbFetchAll("SELECT city, SUM(amount) as revenue FROM bookings GROUP BY city ORDER BY revenue DESC"),
  };
}

async function handleAdminSettings(request, reply) {
  if (request.method === "POST") {
    const body = request.body || {};
    for (const [key, value] of Object.entries(body)) {
      const val = typeof value === "object" ? JSON.stringify(value) : String(value);
      const existing = await dbFetch("SELECT key FROM settings WHERE key=$1", [key]);
      if (existing) await dbExecute("UPDATE settings SET value=$1, updated_at=$2 WHERE key=$3", [val, nowIso(), key]);
      else await dbExecute("INSERT INTO settings (key,value,updated_at) VALUES ($1,$2,$3)", [key, val, nowIso()]);
    }
    await writeAuditLog(request, "admin", "Settings Updated", "Settings", Object.keys(body).join(","));
    return { ok: true, message: "Settings saved" };
  }
  const rows = await dbFetchAll("SELECT key,value FROM settings");
  const defaults = { site_name: "CheckDin", currency: "INR", tax_rate: "18", commission_rate: "15", min_booking_amount: "100", support_email: "support@checkdin.com", maintenance_mode: "false" };
  for (const r of rows) { try { defaults[r.key] = JSON.parse(r.value); } catch { defaults[r.key] = r.value; } }
  return defaults;
}

// ---------------------------------------------------------------------------
// AUDIT LOG HELPER
// ---------------------------------------------------------------------------
async function writeAuditLog(request, actor, action, category, target) {
  const ip = request.ip || request.socket?.remoteAddress || "unknown";
  const info = authFromRequest(request);
  const role = info?.role || "admin";
  const id = genId();
  await dbExecute("INSERT INTO audit_logs (id,actor,role,action,category,target,ip,at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
    [id, actor, role, action, category, target, ip, nowIso()]);
}

// ---------------------------------------------------------------------------
// CMS ROUTES
// ---------------------------------------------------------------------------
async function handleAdminCms(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "cms");
  if (itemId && request.method === "DELETE") {
    await dbExecute("DELETE FROM cms_content WHERE id=$1", [itemId]);
    return { ok: true };
  }
  if (itemId && (request.method === "POST" || request.method === "PUT")) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["title", "data", "status", "sort_order", "type"]) {
      if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(typeof body[f] === "object" ? JSON.stringify(body[f]) : body[f]); }
    }
    fields.push(`updated_at=$${fields.length + 1}`); vals.push(nowIso());
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE cms_content SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    return { ok: true };
  }
  if (request.method === "POST") {
    const body = request.body || {}; const id = genId();
    await dbExecute("INSERT INTO cms_content (id,type,title,data,status,sort_order,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [id, body.type || "banner", body.title || "", typeof body.data === "object" ? JSON.stringify(body.data || {}) : (body.data || "{}"), body.status || "Active", body.sort_order || 0, nowIso(), nowIso()]);
    return { ok: true, id };
  }
  const typeFilter = request.query.type;
  let items;
  if (typeFilter) items = await dbFetchAll("SELECT * FROM cms_content WHERE type=$1 ORDER BY sort_order, created_at DESC", [typeFilter]);
  else items = await dbFetchAll("SELECT * FROM cms_content ORDER BY type, sort_order, created_at DESC");
  items = filterItems(items, request.query, { status: "status", title: "title" });
  return paginate(items, request.query);
}

// ---------------------------------------------------------------------------
// CUSTOMER ROUTES
// ---------------------------------------------------------------------------
async function handleCustomerHotels(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "hotels");
  if (itemId) {
    const h = await dbFetch("SELECT * FROM hotels WHERE id=$1", [itemId]);
    if (!h) return reply.code(404).send({ error: "Hotel not found" });
    const rooms = await dbFetchAll("SELECT * FROM rooms WHERE property_id=$1", [itemId]);
    const pricing = await dbFetch("SELECT * FROM slot_pricing WHERE property_id=$1", [itemId]);
    return { ...h, rooms, pricing: pricing || {} };
  }
  const qp = request.query;
  let items = await dbFetchAll("SELECT * FROM hotels ORDER BY rating DESC");
  if (qp.search) { const s = qp.search.toLowerCase(); items = items.filter(h => (h.name || "").toLowerCase().includes(s) || (h.area || "").toLowerCase().includes(s)); }
  if (qp.city) items = items.filter(h => (h.city || "").toLowerCase() === qp.city.toLowerCase());
  return paginate(items, qp);
}

async function handleCustomerBookings(request, reply) {
  const info = authFromRequest(request);
  if (!info) return reply.code(401).send({ error: "Login required" });
  const cid = info.user_id;
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "bookings");

  if (itemId) {
    if (segments.includes("cancel") && request.method === "POST") {
      const b = await dbFetch("SELECT * FROM customer_bookings WHERE id=$1 AND customer_id=$2", [itemId, cid]);
      if (!b) return reply.code(404).send({ error: "Booking not found" });
      await dbExecute("UPDATE customer_bookings SET status=$1 WHERE id=$2", ["cancelled", itemId]);
      return { ok: true };
    }
    if (segments.includes("rate") && request.method === "POST") {
      const body = request.body || {};
      const b = await dbFetch("SELECT * FROM customer_bookings WHERE id=$1 AND customer_id=$2", [itemId, cid]);
      if (!b) return reply.code(404).send({ error: "Booking not found" });
      await dbExecute("UPDATE customer_bookings SET rated=1 WHERE id=$1", [itemId]);
      const rid = genId();
      await dbExecute("INSERT INTO reviews (id,property_id,property_name,customer_name,rating,title,body,created_at,room,duration,stayed_on) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
        [rid, b.hotel_id || "", "Hotel", info.name || "Guest", body.rating || 5, body.title || "", body.body || "", nowIso(), "", b.duration || 0, b.date || ""]);
      return { ok: true, review_id: rid };
    }
    const b = await dbFetch("SELECT * FROM customer_bookings WHERE id=$1 AND customer_id=$2", [itemId, cid]);
    return b || { error: "Not found" };
  }

  if (request.method === "POST") {
    const body = request.body || {};
    const bid = genId(); const ref = makeRef("CBK");
    const hotel = await dbFetch("SELECT * FROM hotels WHERE id=$1", [body.hotel_id || ""]);
    let amount = body.amount || 0;
    if (!amount && hotel) { const dur = body.duration || 3; amount = dur <= 3 ? hotel.rate_3h : dur <= 6 ? hotel.rate_6h : hotel.rate_12h; }
    const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
    await dbExecute("INSERT INTO customer_bookings (id,reference,hotel_id,date,check_in,duration,guests,amount,status,otp,customer_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
      [bid, ref, body.hotel_id || "", body.date || nowIso().slice(0, 10), body.check_in || "14:00", body.duration || 3, body.guests || 1, amount, "ongoing", otp, cid]);
    return { ok: true, id: bid, reference: ref, otp };
  }

  const items = await dbFetchAll("SELECT * FROM customer_bookings WHERE customer_id=$1 ORDER BY date DESC", [cid]);
  return paginate(items, request.query);
}

async function handleCustomerLeads(request, reply) {
  const body = request.body || {}; const lid = genId();
  await dbExecute("INSERT INTO property_leads (id,property_name,contact_name,mobile,whatsapp,email,city,property_type,total_rooms,short_stay_interest,couple_friendly,source,comments,consent) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
    [lid, body.property_name || "", body.contact_name || "", body.mobile || "", body.whatsapp || "", body.email || "", body.city || "", body.property_type || "", body.total_rooms || 0, body.short_stay_interest || 0, body.couple_friendly || 0, body.source || "website", body.comments || "", body.consent || 0]);
  return { ok: true, id: lid };
}

// ---------------------------------------------------------------------------
// PARTNER ROUTES
// ---------------------------------------------------------------------------
async function getPartnerHotelId(info) {
  if (!info || info.user_type !== "partner") return null;
  const u = await dbFetch("SELECT hotel_id FROM partner_users WHERE id=$1", [info.user_id]);
  return u ? u.hotel_id : null;
}

async function requirePartner(request, reply) {
  const info = authFromRequest(request);
  if (!info || info.user_type !== "partner") { reply.code(403).send({ error: "Partner access required" }); return null; }
  const hid = await getPartnerHotelId(info);
  if (!hid) { reply.code(403).send({ error: "Partner access required" }); return null; }
  return hid;
}

async function handlePartnerDashboard(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  const s = {};
  s.total_bookings = num((await dbFetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=$1", [hid])).c);
  s.active_bookings = num((await dbFetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=$1 AND status='ongoing'", [hid])).c);
  s.total_revenue = num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM customer_bookings WHERE hotel_id=$1", [hid])).s);
  s.today_bookings = num((await dbFetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=$1 AND date=$2", [hid, nowIso().slice(0, 10)])).c);
  s.rooms_available = num((await dbFetch("SELECT COUNT(*) as c FROM rooms WHERE property_id=$1 AND status='Available'", [hid])).c);
  s.avg_rating = num((await dbFetch("SELECT COALESCE(AVG(rating),0) as a FROM reviews WHERE property_id=$1", [hid])).a);
  s.pending_reviews = num((await dbFetch("SELECT COUNT(*) as c FROM reviews WHERE property_id=$1 AND status='Pending'", [hid])).c);
  s.open_tickets = num((await dbFetch("SELECT COUNT(*) as c FROM support_tickets WHERE property_id=$1 AND status='Open'", [hid])).c);
  return s;
}

async function handlePartnerBookings(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "bookings");
  if (itemId && request.method === "POST") {
    let action = "";
    for (const a of ["approve", "reject", "checkin", "checkout", "cancel"]) { if (segments.includes(a)) { action = a; break; } }
    if (!action) return reply.code(400).send({ error: "Action required" });
    const statusMap = { approve: "confirmed", reject: "rejected", checkin: "checked_in", checkout: "checked_out", cancel: "cancelled" };
    await dbExecute("UPDATE customer_bookings SET status=$1 WHERE id=$2 AND hotel_id=$3", [statusMap[action], itemId, hid]);
    if (action === "checkin") await dbExecute("UPDATE customer_bookings SET check_in_time=$1 WHERE id=$2", [nowIso(), itemId]);
    else if (action === "checkout") await dbExecute("UPDATE customer_bookings SET check_out_time=$1 WHERE id=$2", [nowIso(), itemId]);
    return { ok: true, status: statusMap[action] };
  }
  let items = await dbFetchAll("SELECT * FROM customer_bookings WHERE hotel_id=$1 ORDER BY date DESC", [hid]);
  items = filterItems(items, request.query, { status: "status" });
  return paginate(items, request.query);
}

async function handlePartnerRooms(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  if (request.method === "PUT") {
    const body = request.body || {}; const rid = body.id;
    if (rid) { const fields = [], vals = []; for (const f of ["name", "type", "capacity", "base_rate", "status"]) { if (body[f] !== undefined) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } } if (fields.length) { vals.push(rid, hid); await dbExecute(`UPDATE rooms SET ${fields.join(",")} WHERE id=$${vals.length - 1} AND property_id=$${vals.length}`, vals); } }
    return { ok: true };
  }
  const items = await dbFetchAll("SELECT * FROM rooms WHERE property_id=$1 ORDER BY name", [hid]);
  return { data: items, total: items.length };
}

async function handlePartnerPricing(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  if (request.method === "PUT") {
    const body = request.body || {};
    const existing = await dbFetch("SELECT * FROM slot_pricing WHERE property_id=$1", [hid]);
    if (existing) { const fields = [], vals = []; for (const f of ["price_3h", "price_6h", "price_12h", "extra_hour", "weekend_surcharge", "active_3h", "active_6h", "active_12h"]) { if (body[f] !== undefined) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } } if (fields.length) { vals.push(hid); await dbExecute(`UPDATE slot_pricing SET ${fields.join(",")} WHERE property_id=$${vals.length}`, vals); } }
    else await dbExecute("INSERT INTO slot_pricing (id,property_id,price_3h,price_6h,price_12h,extra_hour,weekend_surcharge) VALUES ($1,$2,$3,$4,$5,$6,$7)", [genId(), hid, body.price_3h || 0, body.price_6h || 0, body.price_12h || 0, body.extra_hour || 0, body.weekend_surcharge || 0]);
    return { ok: true };
  }
  const p = await dbFetch("SELECT * FROM slot_pricing WHERE property_id=$1", [hid]);
  return p || {};
}

async function handlePartnerAvailability(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  const segments = request.url.split("/").filter(Boolean);
  const dateParam = getIdFromSegments(segments, "availability");
  if (dateParam && request.method === "PUT") {
    const body = request.body || {};
    const existing = await dbFetch("SELECT * FROM day_availability WHERE property_id=$1 AND date=$2", [hid, dateParam]);
    if (existing) { const fields = [], vals = []; for (const f of ["allocated", "booked", "blocked"]) { if (body[f] !== undefined) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } } if (fields.length) { vals.push(hid, dateParam); await dbExecute(`UPDATE day_availability SET ${fields.join(",")} WHERE property_id=$${vals.length - 1} AND date=$${vals.length}`, vals); } }
    else await dbExecute("INSERT INTO day_availability (id,property_id,date,day,allocated,booked,blocked) VALUES ($1,$2,$3,$4,$5,$6,$7)", [genId(), hid, dateParam, body.day || "", body.allocated || 0, body.booked || 0, body.blocked || 0]);
    return { ok: true };
  }
  const items = await dbFetchAll("SELECT * FROM day_availability WHERE property_id=$1 ORDER BY date", [hid]);
  return { data: items, total: items.length };
}

async function handlePartnerReviews(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "reviews");
  if (itemId && segments.includes("reply") && request.method === "POST") {
    const body = request.body || {};
    await dbExecute("UPDATE reviews SET response=$1, replied_on=$2 WHERE id=$3 AND property_id=$4", [body.response || "", nowIso(), itemId, hid]);
    return { ok: true };
  }
  const items = await dbFetchAll("SELECT * FROM reviews WHERE property_id=$1 ORDER BY created_at DESC", [hid]);
  return { data: items, total: items.length };
}

async function handlePartnerRevenue(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  const items = await dbFetchAll("SELECT * FROM earnings WHERE property_id=$1 ORDER BY date DESC", [hid]);
  return { data: items, total_gross: items.reduce((s, i) => s + (i.gross || 0), 0), total_commission: items.reduce((s, i) => s + (i.commission || 0), 0), total_net: items.reduce((s, i) => s + (i.net || 0), 0) };
}

async function handlePartnerPayouts(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  const items = await dbFetchAll("SELECT * FROM payouts WHERE partner_id=$1 ORDER BY requested_at DESC", [hid]);
  return { data: items, total: items.length };
}

async function handlePartnerReports(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  return {
    total_bookings: num((await dbFetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=$1", [hid])).c),
    total_revenue: num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM customer_bookings WHERE hotel_id=$1", [hid])).s),
    avg_rating: num((await dbFetch("SELECT COALESCE(AVG(rating),0) as a FROM reviews WHERE property_id=$1", [hid])).a),
    rooms: num((await dbFetch("SELECT COUNT(*) as c FROM rooms WHERE property_id=$1", [hid])).c),
  };
}

async function handlePartnerAuditLog(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  const items = await dbFetchAll("SELECT * FROM partner_audit_logs WHERE property_id=$1 ORDER BY time DESC", [hid]);
  return { data: items, total: items.length };
}

async function handlePartnerSupport(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  const items = await dbFetchAll("SELECT * FROM support_tickets WHERE property_id=$1 ORDER BY created_on DESC", [hid]);
  return { data: items, total: items.length };
}

async function handlePartnerSettings(request, reply) {
  const hid = await requirePartner(request, reply); if (!hid) return reply.sent;
  const h = await dbFetch("SELECT * FROM hotels WHERE id=$1", [hid]);
  return h || { error: "Hotel not found" };
}

// ---------------------------------------------------------------------------
// Route Registration
// ---------------------------------------------------------------------------
fastify.post("/api/auth/login/admin", handleAuthLoginAdmin);
fastify.post("/api/auth/login/customer", handleAuthLoginCustomer);
fastify.post("/api/auth/login/partner", handleAuthLoginPartner);
fastify.get("/api/auth/me", handleAuthMe);
fastify.put("/api/auth/profile", handleAuthProfile);

const adminAuth = async (request, reply) => {
  const info = authFromRequest(request);
  if (!info || info.user_type !== "admin") return reply.code(403).send({ error: "Admin access required" });
  request.user_info = info;
};

fastify.get("/api/admin/dashboard", { preHandler: adminAuth }, handleAdminDashboard);
fastify.get("/api/admin/bookings", { preHandler: adminAuth }, handleAdminBookings);
fastify.get("/api/admin/bookings/:id", { preHandler: adminAuth }, handleAdminBookings);
fastify.post("/api/admin/bookings/:id/mutate", { preHandler: adminAuth }, handleAdminBookings);
fastify.get("/api/admin/properties", { preHandler: adminAuth }, handleAdminProperties);
fastify.get("/api/admin/properties/:id", { preHandler: adminAuth }, handleAdminProperties);
fastify.post("/api/admin/properties/:id/mutate", { preHandler: adminAuth }, handleAdminProperties);
fastify.get("/api/admin/rooms", { preHandler: adminAuth }, handleAdminRooms);
fastify.get("/api/admin/rooms/:id", { preHandler: adminAuth }, handleAdminRooms);
fastify.post("/api/admin/rooms/:id/mutate", { preHandler: adminAuth }, handleAdminRooms);
fastify.post("/api/admin/rooms", { preHandler: adminAuth }, handleAdminRooms);
fastify.get("/api/admin/partners", { preHandler: adminAuth }, handleAdminPartners);
fastify.get("/api/admin/partners/:id", { preHandler: adminAuth }, handleAdminPartners);
fastify.post("/api/admin/partners/:id/mutate", { preHandler: adminAuth }, handleAdminPartners);
fastify.get("/api/admin/customers", { preHandler: adminAuth }, handleAdminCustomers);
fastify.get("/api/admin/customers/:id", { preHandler: adminAuth }, handleAdminCustomers);
fastify.post("/api/admin/customers/:id/mutate", { preHandler: adminAuth }, handleAdminCustomers);
fastify.get("/api/admin/payouts", { preHandler: adminAuth }, handleAdminPayouts);
fastify.get("/api/admin/payouts/:id", { preHandler: adminAuth }, handleAdminPayouts);
fastify.post("/api/admin/payouts/:id/mutate", { preHandler: adminAuth }, handleAdminPayouts);
fastify.get("/api/admin/refunds", { preHandler: adminAuth }, handleAdminRefunds);
fastify.get("/api/admin/refunds/:id", { preHandler: adminAuth }, handleAdminRefunds);
fastify.post("/api/admin/refunds/:id/mutate", { preHandler: adminAuth }, handleAdminRefunds);
fastify.get("/api/admin/reviews", { preHandler: adminAuth }, handleAdminReviews);
fastify.get("/api/admin/reviews/:id", { preHandler: adminAuth }, handleAdminReviews);
fastify.post("/api/admin/reviews/:id/mutate", { preHandler: adminAuth }, handleAdminReviews);
fastify.get("/api/admin/tickets", { preHandler: adminAuth }, handleAdminTickets);
fastify.get("/api/admin/tickets/:id", { preHandler: adminAuth }, handleAdminTickets);
fastify.post("/api/admin/tickets/:id/mutate", { preHandler: adminAuth }, handleAdminTickets);
fastify.get("/api/admin/coupons", { preHandler: adminAuth }, handleAdminCoupons);
fastify.get("/api/admin/coupons/:id", { preHandler: adminAuth }, handleAdminCoupons);
fastify.post("/api/admin/coupons", { preHandler: adminAuth }, handleAdminCoupons);
fastify.put("/api/admin/coupons/:id", { preHandler: adminAuth }, handleAdminCoupons);
fastify.get("/api/admin/audit-logs", { preHandler: adminAuth }, handleAdminAuditLogs);
fastify.get("/api/admin/fraud", { preHandler: adminAuth }, handleAdminFraud);
fastify.get("/api/admin/fraud/:id", { preHandler: adminAuth }, handleAdminFraud);
fastify.post("/api/admin/fraud/:id/mutate", { preHandler: adminAuth }, handleAdminFraud);
fastify.get("/api/admin/admin-users", { preHandler: adminAuth }, handleAdminAdminUsers);
fastify.get("/api/admin/admin-users/:id", { preHandler: adminAuth }, handleAdminAdminUsers);
fastify.post("/api/admin/admin-users", { preHandler: adminAuth }, handleAdminAdminUsers);
fastify.put("/api/admin/admin-users/:id", { preHandler: adminAuth }, handleAdminAdminUsers);
fastify.post("/api/admin/admin-users/:id", { preHandler: adminAuth }, handleAdminAdminUsers);
fastify.delete("/api/admin/admin-users/:id", { preHandler: adminAuth }, handleAdminAdminUsers);

fastify.get("/api/admin/pricing-rules", { preHandler: adminAuth }, handleAdminPricingRules);
fastify.get("/api/admin/pricing-rules/:id", { preHandler: adminAuth }, handleAdminPricingRules);
fastify.post("/api/admin/pricing-rules", { preHandler: adminAuth }, handleAdminPricingRules);
fastify.put("/api/admin/pricing-rules/:id", { preHandler: adminAuth }, handleAdminPricingRules);
fastify.post("/api/admin/pricing-rules/:id", { preHandler: adminAuth }, handleAdminPricingRules);
fastify.delete("/api/admin/pricing-rules/:id", { preHandler: adminAuth }, handleAdminPricingRules);

fastify.get("/api/admin/campaigns", { preHandler: adminAuth }, handleAdminCampaigns);
fastify.get("/api/admin/campaigns/:id", { preHandler: adminAuth }, handleAdminCampaigns);
fastify.post("/api/admin/campaigns", { preHandler: adminAuth }, handleAdminCampaigns);
fastify.put("/api/admin/campaigns/:id", { preHandler: adminAuth }, handleAdminCampaigns);
fastify.post("/api/admin/campaigns/:id", { preHandler: adminAuth }, handleAdminCampaigns);
fastify.delete("/api/admin/campaigns/:id", { preHandler: adminAuth }, handleAdminCampaigns);

fastify.get("/api/admin/cms", { preHandler: adminAuth }, handleAdminCms);
fastify.get("/api/admin/cms/:id", { preHandler: adminAuth }, handleAdminCms);
fastify.post("/api/admin/cms", { preHandler: adminAuth }, handleAdminCms);
fastify.put("/api/admin/cms/:id", { preHandler: adminAuth }, handleAdminCms);
fastify.delete("/api/admin/cms/:id", { preHandler: adminAuth }, handleAdminCms);

fastify.get("/api/admin/reports", { preHandler: adminAuth }, handleAdminReports);
fastify.get("/api/admin/settings", { preHandler: adminAuth }, handleAdminSettings);
fastify.post("/api/admin/settings", { preHandler: adminAuth }, handleAdminSettings);

fastify.get("/api/customer/hotels", handleCustomerHotels);
fastify.get("/api/customer/hotels/:id", handleCustomerHotels);
fastify.get("/api/customer/bookings", handleCustomerBookings);
fastify.get("/api/customer/bookings/:id", handleCustomerBookings);
fastify.post("/api/customer/bookings", handleCustomerBookings);
fastify.post("/api/customer/bookings/:id/cancel", handleCustomerBookings);
fastify.post("/api/customer/bookings/:id/rate", handleCustomerBookings);
fastify.post("/api/customer/leads", handleCustomerLeads);

fastify.get("/api/partner/dashboard", handlePartnerDashboard);
fastify.get("/api/partner/bookings", handlePartnerBookings);
fastify.get("/api/partner/bookings/:id", handlePartnerBookings);
fastify.post("/api/partner/bookings/:id/:action", handlePartnerBookings);
fastify.get("/api/partner/rooms", handlePartnerRooms);
fastify.put("/api/partner/rooms", handlePartnerRooms);
fastify.get("/api/partner/pricing", handlePartnerPricing);
fastify.put("/api/partner/pricing", handlePartnerPricing);
fastify.get("/api/partner/availability", handlePartnerAvailability);
fastify.get("/api/partner/availability/:date", handlePartnerAvailability);
fastify.put("/api/partner/availability/:date", handlePartnerAvailability);
fastify.get("/api/partner/reviews", handlePartnerReviews);
fastify.post("/api/partner/reviews/:id/reply", handlePartnerReviews);
fastify.get("/api/partner/revenue", handlePartnerRevenue);
fastify.get("/api/partner/payouts", handlePartnerPayouts);
fastify.get("/api/partner/reports", handlePartnerReports);
fastify.get("/api/partner/audit-log", handlePartnerAuditLog);
fastify.get("/api/partner/support", handlePartnerSupport);
fastify.get("/api/partner/settings", handlePartnerSettings);

fastify.get("/", async () => ({ status: "ok", server: "CheckDin Backend", version: "1.0" }));

fastify.setNotFoundHandler(async (request, reply) => reply.code(404).send({ error: "Not found" }));
fastify.setErrorHandler(async (error, request, reply) => { console.error(error); return reply.code(500).send({ error: error.message }); });

fastify.listen({ port: PORT, host: HOST }, (err) => {
  if (err) { console.error(err); process.exit(1); }
  console.log(`CheckDin Backend running on http://${HOST}:${PORT}`);
});
