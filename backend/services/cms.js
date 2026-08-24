const cmsModel = require("../models/cms");

async function getCmsContent(typeFilter, filters) {
  return cmsModel.findAll(typeFilter, filters);
}

async function createCmsContent(data) {
  return cmsModel.create(data);
}

async function updateCmsContent(id, fields) {
  const allowed = ["title", "data", "status", "sort_order", "type"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await cmsModel.update(id, updateFields);
  }
}

async function deleteCmsContent(id) {
  await cmsModel.remove(id);
}

module.exports = { getCmsContent, createCmsContent, updateCmsContent, deleteCmsContent };
