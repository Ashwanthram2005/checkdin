const dashboardController = require("../../controllers/dashboard");

async function dashboardRoutes(fastify) {
  fastify.get("/api/admin/dashboard", dashboardController.getDashboard);
}

module.exports = dashboardRoutes;
