const financeModel = require("../models/finance");

async function getPayouts(filters) {
  return financeModel.findAllPayouts(filters);
}

async function updatePayout(id, fields) {
  const allowed = ["status", "utr", "note", "stage"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await financeModel.updatePayout(id, updateFields);
  }
}

async function getPartnerPayouts(partnerId) {
  return financeModel.findPayoutsByPartner(partnerId);
}

async function getRefunds(filters) {
  return financeModel.findAllRefunds(filters);
}

async function mutateRefund(id, action) {
  if (action) {
    await financeModel.updateRefundStatus(id, action.charAt(0).toUpperCase() + action.slice(1));
  }
}

async function getPartnerRevenue(propertyId) {
  return financeModel.findEarningsByProperty(propertyId);
}

module.exports = { getPayouts, updatePayout, getPartnerPayouts, getRefunds, mutateRefund, getPartnerRevenue };
