const dashboardService = require("../services/dashboard");

async function getDashboard(request, reply) {
  try {
    return await dashboardService.getDashboardStats();
  } catch (e) {
    return reply.code(500).send({ error: e.message });
  }
}

async function getReports(request, reply) {
  try {
    const { from = "2025-01-01", to = "2025-12-31" } = request.query;
    return await dashboardService.getReports(from, to);
  } catch (e) {
    return reply.code(500).send({ error: e.message });
  }
}

module.exports = { getDashboard, getReports };
