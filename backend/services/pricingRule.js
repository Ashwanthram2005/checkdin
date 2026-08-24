const pricingRuleModel = require("../models/pricingRule");

async function getPricingRules(filters) {
  return pricingRuleModel.findAll(filters);
}

async function createPricingRule(data) {
  return pricingRuleModel.create(data);
}

async function updatePricingRule(id, fields) {
  const allowed = ["name", "scope", "trigger", "adjustment", "channel", "status"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await pricingRuleModel.update(id, updateFields);
  }
}

async function deletePricingRule(id) {
  await pricingRuleModel.remove(id);
}

module.exports = { getPricingRules, createPricingRule, updatePricingRule, deletePricingRule };
