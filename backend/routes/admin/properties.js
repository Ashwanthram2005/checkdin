const { dbFetch, dbFetchAll, dbExecute } = require("../../lib/db");
const { filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

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

async function propertiesRoutes(fastify) {
  fastify.get("/api/admin/properties", handleAdminProperties);
  fastify.get("/api/admin/properties/:id", handleAdminProperties);
  fastify.post("/api/admin/properties/:id/mutate", handleAdminProperties);
}

module.exports = propertiesRoutes;
