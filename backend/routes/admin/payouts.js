const financeController = require("../../controllers/finance");

async function payoutsRoutes(fastify) {
  fastify.get("/api/admin/payouts", financeController.getPayouts);
  fastify.get("/api/admin/payouts/:id", financeController.getPayouts);
  fastify.post("/api/admin/payouts/:id/mutate", financeController.getPayouts);
}

module.exports = payoutsRoutes;
