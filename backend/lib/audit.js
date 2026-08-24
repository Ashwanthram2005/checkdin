const { dbExecute } = require("./db");
const { genId, nowIso } = require("./utils");
const { authFromRequest } = require("./auth");

async function writeAuditLog(request, actor, action, category, target) {
  const ip = request.ip || request.socket?.remoteAddress || "unknown";
  const info = authFromRequest(request);
  const role = info?.role || "admin";
  const id = genId();
  await dbExecute("INSERT INTO audit_logs (id,actor,role,action,category,target,ip,at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
    [id, actor, role, action, category, target, ip, nowIso()]);
}

module.exports = { writeAuditLog };
