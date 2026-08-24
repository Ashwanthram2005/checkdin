const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const pricingRuleService = require("../services/pricingRule");

async function getPricingRules(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "pricing-rules");
    if (request.method === "POST" && !itemId) {
      const id = await pricingRuleService.createPricingRule(request.body || {});
      await writeAuditLog(request, "admin", "Pricing Rule Created", "Pricing", id);
      return { ok: true, id };
    }
    if (itemId && request.method === "DELETE") {
      await pricingRuleService.deletePricingRule(itemId);
      await writeAuditLog(request, "admin", "Pricing Rule Deleted", "Pricing", itemId);
      return { ok: true };
    }
    if (itemId && (request.method === "POST" || request.method === "PUT")) {
      await pricingRuleService.updatePricingRule(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Pricing Rule Updated", "Pricing", itemId);
      return { ok: true };
    }
    const items = await pricingRuleService.getPricingRules(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getPricingRules };
