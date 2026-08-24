const couponModel = require("../models/coupon");

async function getCoupons(filters) {
  return couponModel.findAll(filters);
}

async function createCoupon(data) {
  return couponModel.create(data);
}

async function updateCoupon(id, fields) {
  const allowed = ["code", "description", "type", "value", "min_booking", "max_discount", "coupon_limit", "valid_from", "valid_to", "status"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await couponModel.update(id, updateFields);
  }
}

module.exports = { getCoupons, createCoupon, updateCoupon };
