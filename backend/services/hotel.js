const hotelModel = require("../models/hotel");

async function getHotels(search, city) {
  let items = await hotelModel.findAll();
  if (search) {
    const s = search.toLowerCase();
    items = items.filter(h => (h.name || "").toLowerCase().includes(s) || (h.area || "").toLowerCase().includes(s));
  }
  if (city) items = items.filter(h => (h.city || "").toLowerCase() === city.toLowerCase());
  return items;
}

async function getHotelById(id) {
  const h = await hotelModel.findById(id);
  if (!h) throw { status: 404, message: "Hotel not found" };
  const roomModel = require("../models/room");
  const slotPricingModel = require("../models/slotPricing");
  const rooms = await roomModel.findByPropertyId(id);
  const pricing = await slotPricingModel.findByProperty(id);
  return { ...h, rooms, pricing: pricing || {} };
}

module.exports = { getHotels, getHotelById };
