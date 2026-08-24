const { dbFetchAll, dbExecute } = require("../../lib/db");
const { nowIso, filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

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

async function reviewsRoutes(fastify) {
  fastify.get("/api/admin/reviews", handleAdminReviews);
  fastify.get("/api/admin/reviews/:id", handleAdminReviews);
  fastify.post("/api/admin/reviews/:id/mutate", handleAdminReviews);
}

module.exports = reviewsRoutes;
