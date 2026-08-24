const bookingController = require("../../controllers/booking");
const roomController = require("../../controllers/room");
const reviewController = require("../../controllers/review");
const financeController = require("../../controllers/finance");
const auditLogController = require("../../controllers/auditLog");
const partnerDashboardController = require("../../controllers/partnerDashboard");
const pricingController = require("../../controllers/pricing");
const availabilityController = require("../../controllers/availability");

async function partnerRoutes(fastify) {
  fastify.get("/api/partner/dashboard", partnerDashboardController.getPartnerDashboard);
  fastify.get("/api/partner/bookings", bookingController.getPartnerBookings);
  fastify.get("/api/partner/bookings/:id", bookingController.getPartnerBookings);
  fastify.post("/api/partner/bookings/:id/:action", bookingController.getPartnerBookings);
  fastify.get("/api/partner/rooms", roomController.getPartnerRooms);
  fastify.put("/api/partner/rooms", roomController.getPartnerRooms);
  fastify.get("/api/partner/pricing", pricingController.getPartnerPricing);
  fastify.put("/api/partner/pricing", pricingController.getPartnerPricing);
  fastify.get("/api/partner/availability", availabilityController.getPartnerAvailability);
  fastify.get("/api/partner/availability/:date", availabilityController.getPartnerAvailability);
  fastify.put("/api/partner/availability/:date", availabilityController.getPartnerAvailability);
  fastify.get("/api/partner/reviews", reviewController.getPartnerReviews);
  fastify.post("/api/partner/reviews/:id/reply", reviewController.getPartnerReviews);
  fastify.get("/api/partner/revenue", financeController.getPartnerRevenue);
  fastify.get("/api/partner/payouts", financeController.getPartnerPayouts);
  fastify.get("/api/partner/reports", partnerDashboardController.getPartnerReports);
  fastify.get("/api/partner/audit-log", auditLogController.getPartnerAuditLogs);
  fastify.get("/api/partner/support", partnerDashboardController.getPartnerSupport);
  fastify.get("/api/partner/settings", partnerDashboardController.getPartnerSettings);
}

module.exports = partnerRoutes;
