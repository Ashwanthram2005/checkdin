const partnerDashboardService = require("../services/partnerDashboard");

async function getPartnerDashboard(request, reply) {
  try {
    const { requirePartner } = require("../middleware/partnerAuth");
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    return await partnerDashboardService.getPartnerDashboard(hid);
  } catch (e) {
    return reply.code(500).send({ error: e.message });
  }
}

async function getPartnerReports(request, reply) {
  try {
    const { requirePartner } = require("../middleware/partnerAuth");
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    return await partnerDashboardService.getPartnerReports(hid);
  } catch (e) {
    return reply.code(500).send({ error: e.message });
  }
}

async function getPartnerSettings(request, reply) {
  try {
    const { requirePartner } = require("../middleware/partnerAuth");
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    const h = await partnerDashboardService.getPartnerSettings(hid);
    return h || { error: "Hotel not found" };
  } catch (e) {
    return reply.code(500).send({ error: e.message });
  }
}

async function getPartnerSupport(request, reply) {
  try {
    const { requirePartner } = require("../middleware/partnerAuth");
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    const ticketService = require("../services/ticket");
    const items = await ticketService.getPartnerSupport(hid);
    return { data: items, total: items.length };
  } catch (e) {
    return reply.code(500).send({ error: e.message });
  }
}

module.exports = { getPartnerDashboard, getPartnerReports, getPartnerSettings, getPartnerSupport };
