const ticketModel = require("../models/ticket");

async function getTickets(filters) {
  return ticketModel.findAll(filters);
}

async function updateTicket(id, fields) {
  const allowed = ["status", "priority", "agent"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await ticketModel.update(id, updateFields);
  }
}

async function getPartnerSupport(propertyId) {
  return ticketModel.findByProperty(propertyId);
}

module.exports = { getTickets, updateTicket, getPartnerSupport };
