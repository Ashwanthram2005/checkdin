const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const financeService = require("../services/finance");

async function getPayouts(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "payouts");
    if (itemId && segments.includes("mutate") && request.method === "POST") {
      await financeService.updatePayout(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Payout Updated", "Finance", itemId);
      return { ok: true };
    }
    const items = await financeService.getPayouts(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function getRefunds(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "refunds");
    if (itemId && segments.includes("mutate") && request.method === "POST") {
      const body = request.body || {};
      const act = body.action || body.status || "";
      await financeService.mutateRefund(itemId, act);
      await writeAuditLog(request, "admin", `Refund ${act}`, "Finance", itemId);
      return { ok: true };
    }
    const items = await financeService.getRefunds(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function getPartnerRevenue(request, reply) {
  try {
    const { requirePartner } = require("../middleware/partnerAuth");
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    const items = await financeService.getPartnerRevenue(hid);
    return {
      data: items,
      total_gross: items.reduce((s, i) => s + (i.gross || 0), 0),
      total_commission: items.reduce((s, i) => s + (i.commission || 0), 0),
      total_net: items.reduce((s, i) => s + (i.net || 0), 0),
    };
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function getPartnerPayouts(request, reply) {
  try {
    const { requirePartner } = require("../middleware/partnerAuth");
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    const items = await financeService.getPartnerPayouts(hid);
    return { data: items, total: items.length };
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getPayouts, getRefunds, getPartnerRevenue, getPartnerPayouts };
