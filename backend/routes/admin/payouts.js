const { dbFetchAll, dbExecute } = require("../../lib/db");
const { filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

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

async function payoutsRoutes(fastify) {
  fastify.get("/api/admin/payouts", handleAdminPayouts);
  fastify.get("/api/admin/payouts/:id", handleAdminPayouts);
  fastify.post("/api/admin/payouts/:id/mutate", handleAdminPayouts);
}

module.exports = payoutsRoutes;
