const dashboardController = require("../../controllers/dashboard");

async function reportsRoutes(fastify) {
  fastify.get("/api/admin/reports", dashboardController.getReports);
}

module.exports = reportsRoutes;
