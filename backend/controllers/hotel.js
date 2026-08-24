const { paginate } = require("../lib/utils");
const hotelService = require("../services/hotel");

async function getHotels(request, reply) {
  try {
    const { search, city } = request.query;
    const items = await hotelService.getHotels(search, city);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function getHotelById(request, reply) {
  try {
    const { id } = request.params;
    return await hotelService.getHotelById(id);
  } catch (e) {
    return reply.code(e.status || 404).send({ error: e.message });
  }
}

module.exports = { getHotels, getHotelById };
