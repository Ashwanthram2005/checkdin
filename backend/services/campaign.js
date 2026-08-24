const campaignModel = require("../models/campaign");

async function getCampaigns(filters) {
  return campaignModel.findAll(filters);
}

async function createCampaign(data) {
  return campaignModel.create(data);
}

async function updateCampaign(id, fields) {
  const allowed = ["title", "channel", "audience", "status", "scheduled_at"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await campaignModel.update(id, updateFields);
  }
}

async function deleteCampaign(id) {
  await campaignModel.remove(id);
}

module.exports = { getCampaigns, createCampaign, updateCampaign, deleteCampaign };
