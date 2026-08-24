const pricingRuleController = require("../../controllers/pricingRule");

async function pricingRulesRoutes(fastify) {
  fastify.get("/api/admin/pricing-rules", pricingRuleController.getPricingRules);
  fastify.get("/api/admin/pricing-rules/:id", pricingRuleController.getPricingRules);
  fastify.post("/api/admin/pricing-rules", pricingRuleController.getPricingRules);
  fastify.put("/api/admin/pricing-rules/:id", pricingRuleController.getPricingRules);
  fastify.post("/api/admin/pricing-rules/:id", pricingRuleController.getPricingRules);
  fastify.delete("/api/admin/pricing-rules/:id", pricingRuleController.getPricingRules);
}

module.exports = pricingRulesRoutes;
