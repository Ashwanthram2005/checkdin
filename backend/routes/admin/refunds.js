const financeController = require("../../controllers/finance");

async function refundsRoutes(fastify) {
  fastify.get("/api/admin/refunds", financeController.getRefunds);
  fastify.get("/api/admin/refunds/:id", financeController.getRefunds);
  fastify.post("/api/admin/refunds/:id/mutate", financeController.getRefunds);
}

module.exports = refundsRoutes;
