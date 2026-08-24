const propertyModel = require("../models/property");

async function getProperties(filters) {
  return propertyModel.findAll(filters);
}

async function getPropertyById(id) {
  return propertyModel.findById(id);
}

async function updateProperty(id, fields) {
  const allowed = ["name", "city", "state", "address", "type", "status", "rooms", "rating"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await propertyModel.update(id, updateFields);
  }
}

module.exports = { getProperties, getPropertyById, updateProperty };
