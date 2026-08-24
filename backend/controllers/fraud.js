const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const fraudService = require("../services/fraud");

async function getFraudAlerts(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "fraud");
    if (itemId && segments.includes("mutate") && request.method === "POST") {
      const body = request.body || {};
      const act = body.action || body.status || "";
      await fraudService.mutateFraudAlert(itemId, act);
      await writeAuditLog(request, "admin", `Fraud Alert ${act}`, "Security", itemId);
      return { ok: true };
    }
    const items = await fraudService.getFraudAlerts(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getFraudAlerts };
