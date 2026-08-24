const customerController = require("../controllers/booking");
const hotelController = require("../controllers/hotel");
const leadController = require("../controllers/lead");

async function customerRoutes(fastify) {
  fastify.get("/api/customer/hotels", hotelController.getHotels);
  fastify.get("/api/customer/hotels/:id", hotelController.getHotelById);
  fastify.get("/api/customer/bookings", customerController.getCustomerBookings);
  fastify.get("/api/customer/bookings/:id", customerController.getCustomerBookings);
  fastify.post("/api/customer/bookings", customerController.getCustomerBookings);
  fastify.post("/api/customer/bookings/:id/cancel", customerController.getCustomerBookings);
  fastify.post("/api/customer/bookings/:id/rate", customerController.getCustomerBookings);
  fastify.post("/api/customer/leads", leadController.createLead);
}

module.exports = customerRoutes;
