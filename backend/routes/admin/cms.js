const cmsController = require("../../controllers/cms");

async function cmsRoutes(fastify) {
  fastify.get("/api/admin/cms", cmsController.getCmsContent);
  fastify.get("/api/admin/cms/:id", cmsController.getCmsContent);
  fastify.post("/api/admin/cms", cmsController.getCmsContent);
  fastify.put("/api/admin/cms/:id", cmsController.getCmsContent);
  fastify.delete("/api/admin/cms/:id", cmsController.getCmsContent);
}

module.exports = cmsRoutes;
