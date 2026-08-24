const { dbFetch, dbFetchAll, dbExecute } = require("../../lib/db");
const { genId, nowIso, num, filterItems, paginate } = require("../../lib/utils");
const { requirePartner } = require("../../middleware/partnerAuth");

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
  const itemId = segments.find(s => s !== "bookings" && !["partner", "api"].includes(s) && s.length > 6 && s !== "action");
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
  const dateParam = segments.find(s => /^\d{4}-\d{2}-\d{2}$/.test(s));
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
  const itemId = segments.find(s => s !== "reviews" && !["partner", "api", "reply"].includes(s) && s.length > 6);
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

async function partnerRoutes(fastify) {
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
}

module.exports = partnerRoutes;
