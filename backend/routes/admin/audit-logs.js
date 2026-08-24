const auditLogController = require("../../controllers/auditLog");

async function auditLogsRoutes(fastify) {
  fastify.get("/api/admin/audit-logs", auditLogController.getAuditLogs);
}

module.exports = auditLogsRoutes;
