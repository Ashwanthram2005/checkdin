const dayAvailabilityModel = require("../models/dayAvailability");

async function getPartnerAvailability(propertyId) {
  return dayAvailabilityModel.findByProperty(propertyId);
}

async function updatePartnerAvailability(propertyId, date, data) {
  await dayAvailabilityModel.upsert(propertyId, date, data);
}

module.exports = { getPartnerAvailability, updatePartnerAvailability };
