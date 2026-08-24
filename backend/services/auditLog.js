const auditLogModel = require("../models/auditLog");

async function getAuditLogs(filters) {
  return auditLogModel.findAll(filters);
}

async function getPartnerAuditLogs(propertyId) {
  return auditLogModel.findByProperty(propertyId);
}

module.exports = { getAuditLogs, getPartnerAuditLogs };
