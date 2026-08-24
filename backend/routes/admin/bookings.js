const { dbFetch, dbFetchAll, dbExecute } = require("../../lib/db");
const { nowIso, filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

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

async function bookingsRoutes(fastify) {
  fastify.get("/api/admin/bookings", handleAdminBookings);
  fastify.get("/api/admin/bookings/:id", handleAdminBookings);
  fastify.post("/api/admin/bookings/:id/mutate", handleAdminBookings);
}

module.exports = bookingsRoutes;
