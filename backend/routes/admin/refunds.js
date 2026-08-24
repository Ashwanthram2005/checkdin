const { dbFetchAll, dbExecute } = require("../../lib/db");
const { filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

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

async function refundsRoutes(fastify) {
  fastify.get("/api/admin/refunds", handleAdminRefunds);
  fastify.get("/api/admin/refunds/:id", handleAdminRefunds);
  fastify.post("/api/admin/refunds/:id/mutate", handleAdminRefunds);
}

module.exports = refundsRoutes;
