const customerController = require("../../controllers/customer");

async function customersRoutes(fastify) {
  fastify.get("/api/admin/customers", customerController.getCustomers);
  fastify.get("/api/admin/customers/:id", customerController.getCustomers);
  fastify.post("/api/admin/customers/:id/mutate", customerController.getCustomers);
}

module.exports = customersRoutes;
