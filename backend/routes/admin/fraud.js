const fraudController = require("../../controllers/fraud");

async function fraudRoutes(fastify) {
  fastify.get("/api/admin/fraud", fraudController.getFraudAlerts);
  fastify.get("/api/admin/fraud/:id", fraudController.getFraudAlerts);
  fastify.post("/api/admin/fraud/:id/mutate", fraudController.getFraudAlerts);
}

module.exports = fraudRoutes;
