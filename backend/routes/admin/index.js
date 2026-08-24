const adminAuth = require("../../middleware/adminAuth");
const dashboardRoutes = require("./dashboard");
const bookingsRoutes = require("./bookings");
const propertiesRoutes = require("./properties");
const roomsRoutes = require("./rooms");
const partnersRoutes = require("./partners");
const customersRoutes = require("./customers");
const payoutsRoutes = require("./payouts");
const refundsRoutes = require("./refunds");
const reviewsRoutes = require("./reviews");
const ticketsRoutes = require("./tickets");
const couponsRoutes = require("./coupons");
const campaignsRoutes = require("./campaigns");
const auditLogsRoutes = require("./audit-logs");
const fraudRoutes = require("./fraud");
const adminUsersRoutes = require("./admin-users");
const pricingRulesRoutes = require("./pricing-rules");
const cmsRoutes = require("./cms");
const reportsRoutes = require("./reports");
const settingsRoutes = require("./settings");

async function adminRoutes(fastify) {
  fastify.addHook("preHandler", adminAuth);

  fastify.register(dashboardRoutes);
  fastify.register(bookingsRoutes);
  fastify.register(propertiesRoutes);
  fastify.register(roomsRoutes);
  fastify.register(partnersRoutes);
  fastify.register(customersRoutes);
  fastify.register(payoutsRoutes);
  fastify.register(refundsRoutes);
  fastify.register(reviewsRoutes);
  fastify.register(ticketsRoutes);
  fastify.register(couponsRoutes);
  fastify.register(campaignsRoutes);
  fastify.register(auditLogsRoutes);
  fastify.register(fraudRoutes);
  fastify.register(adminUsersRoutes);
  fastify.register(pricingRulesRoutes);
  fastify.register(cmsRoutes);
  fastify.register(reportsRoutes);
  fastify.register(settingsRoutes);
}

module.exports = adminRoutes;
