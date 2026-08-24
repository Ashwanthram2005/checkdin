const { dbFetchAll } = require("../../lib/db");
const { filterItems, paginate } = require("../../lib/utils");

async function handleAdminAuditLogs(request, reply) {
  let items = await dbFetchAll("SELECT * FROM audit_logs ORDER BY at DESC");
  items = filterItems(items, request.query, { actor: "actor", action: "action", role: "role" });
  return paginate(items, request.query);
}

async function auditLogsRoutes(fastify) {
  fastify.get("/api/admin/audit-logs", handleAdminAuditLogs);
}

module.exports = auditLogsRoutes;
