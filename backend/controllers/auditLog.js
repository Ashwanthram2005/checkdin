const { paginate } = require("../lib/utils");
const auditLogService = require("../services/auditLog");

async function getAuditLogs(request, reply) {
  try {
    const items = await auditLogService.getAuditLogs(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(500).send({ error: e.message });
  }
}

async function getPartnerAuditLogs(request, reply) {
  try {
    const { requirePartner } = require("../middleware/partnerAuth");
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    const items = await auditLogService.getPartnerAuditLogs(hid);
    return { data: items, total: items.length };
  } catch (e) {
    return reply.code(500).send({ error: e.message });
  }
}

module.exports = { getAuditLogs, getPartnerAuditLogs };
