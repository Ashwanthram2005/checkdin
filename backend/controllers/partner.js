const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const partnerService = require("../services/partner");

async function getPartners(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "partners");
    if (itemId && segments.includes("mutate") && request.method === "POST") {
      await partnerService.updatePartner(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Partner Updated", "Partner", itemId);
      return { ok: true };
    }
    if (itemId && itemId !== "mutate") {
      return await partnerService.getPartnerById(itemId) || { error: "Not found" };
    }
    const items = await partnerService.getPartners(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getPartners };
