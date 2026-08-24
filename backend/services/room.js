const roomModel = require("../models/room");

async function getRooms(filters) {
  return roomModel.findAll(filters);
}

async function createRoom(data) {
  return roomModel.create(data);
}

async function updateRoom(id, fields) {
  const allowed = ["name", "type", "capacity", "base_rate", "status", "floor"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await roomModel.update(id, updateFields);
  }
}

async function getPartnerRooms(hotelId) {
  return roomModel.findByPropertyId(hotelId);
}

async function updatePartnerRoom(id, hotelId, fields) {
  await roomModel.updateByProperty(id, hotelId, fields);
}

module.exports = { getRooms, createRoom, updateRoom, getPartnerRooms, updatePartnerRoom };
