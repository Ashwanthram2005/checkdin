const { dbFetchAll, dbExecute } = require("../../lib/db");
const { filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

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

async function fraudRoutes(fastify) {
  fastify.get("/api/admin/fraud", handleAdminFraud);
  fastify.get("/api/admin/fraud/:id", handleAdminFraud);
  fastify.post("/api/admin/fraud/:id/mutate", handleAdminFraud);
}

module.exports = fraudRoutes;
