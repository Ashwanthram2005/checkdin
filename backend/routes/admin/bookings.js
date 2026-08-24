const bookingController = require("../../controllers/booking");

async function bookingsRoutes(fastify) {
  fastify.get("/api/admin/bookings", bookingController.getAdminBookings);
  fastify.get("/api/admin/bookings/:id", bookingController.getAdminBookings);
  fastify.post("/api/admin/bookings/:id/mutate", bookingController.getAdminBookings);
}

module.exports = bookingsRoutes;
