const { dbFetch, dbFetchAll, dbExecute } = require("../../lib/db");
const { genId, filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

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

async function roomsRoutes(fastify) {
  fastify.get("/api/admin/rooms", handleAdminRooms);
  fastify.get("/api/admin/rooms/:id", handleAdminRooms);
  fastify.post("/api/admin/rooms", handleAdminRooms);
  fastify.post("/api/admin/rooms/:id/mutate", handleAdminRooms);
}

module.exports = roomsRoutes;
