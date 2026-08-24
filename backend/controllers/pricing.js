const { requirePartner } = require("../middleware/partnerAuth");
const pricingService = require("../services/pricing");

async function getPartnerPricing(request, reply) {
  try {
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    if (request.method === "PUT") {
      await pricingService.updatePartnerPricing(hid, request.body || {});
      return { ok: true };
    }
    return await pricingService.getPartnerPricing(hid) || {};
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getPartnerPricing };
