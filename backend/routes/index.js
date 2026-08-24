const authRoutes = require("./auth");
const adminRoutes = require("./admin");
const customerRoutes = require("./customer");
const partnerRoutes = require("./partner");

async function routes(fastify) {
  fastify.register(authRoutes);
  fastify.register(adminRoutes);
  fastify.register(customerRoutes);
  fastify.register(partnerRoutes);
}

module.exports = routes;
