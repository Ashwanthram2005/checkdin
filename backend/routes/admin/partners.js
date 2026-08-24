const { dbFetch, dbFetchAll, dbExecute } = require("../../lib/db");
const { filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

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

async function partnersRoutes(fastify) {
  fastify.get("/api/admin/partners", handleAdminPartners);
  fastify.get("/api/admin/partners/:id", handleAdminPartners);
  fastify.post("/api/admin/partners/:id/mutate", handleAdminPartners);
}

module.exports = partnersRoutes;
