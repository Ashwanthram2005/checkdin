const { requirePartner } = require("../middleware/partnerAuth");
const availabilityService = require("../services/availability");

async function getPartnerAvailability(request, reply) {
  try {
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    const segments = request.url.split("/").filter(Boolean);
    const dateParam = segments.find(s => /^\d{4}-\d{2}-\d{2}$/.test(s));
    if (dateParam && request.method === "PUT") {
      await availabilityService.updatePartnerAvailability(hid, dateParam, request.body || {});
      return { ok: true };
    }
    const items = await availabilityService.getPartnerAvailability(hid);
    return { data: items, total: items.length };
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getPartnerAvailability };
