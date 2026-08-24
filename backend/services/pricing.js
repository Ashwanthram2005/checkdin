const slotPricingModel = require("../models/slotPricing");

async function getPartnerPricing(propertyId) {
  return slotPricingModel.findByProperty(propertyId);
}

async function updatePartnerPricing(propertyId, data) {
  await slotPricingModel.upsert(propertyId, data);
}

module.exports = { getPartnerPricing, updatePartnerPricing };
