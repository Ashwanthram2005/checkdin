const partnerModel = require("../models/partner");

async function getPartners(filters) {
  return partnerModel.findAll(filters);
}

async function getPartnerById(id) {
  return partnerModel.findById(id);
}

async function updatePartner(id, fields) {
  const allowed = ["name", "company", "email", "phone", "city", "status", "commission_rate"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await partnerModel.update(id, updateFields);
  }
}

module.exports = { getPartners, getPartnerById, updatePartner };
