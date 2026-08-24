const reviewModel = require("../models/review");

async function getReviews(filters) {
  return reviewModel.findAll(filters);
}

async function getPartnerReviews(propertyId) {
  return reviewModel.findByProperty(propertyId);
}

async function updateReview(id, fields) {
  const allowed = ["status", "response"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await reviewModel.update(id, updateFields);
  }
}

async function replyToReview(id, propertyId, response) {
  await reviewModel.update(id, { response });
}

module.exports = { getReviews, getPartnerReviews, updateReview, replyToReview };
