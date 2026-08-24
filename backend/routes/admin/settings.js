const settingController = require("../../controllers/setting");

async function settingsRoutes(fastify) {
  fastify.get("/api/admin/settings", settingController.getSettings);
  fastify.post("/api/admin/settings", settingController.getSettings);
}

module.exports = settingsRoutes;
