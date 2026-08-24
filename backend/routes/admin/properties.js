const propertyController = require("../../controllers/property");

async function propertiesRoutes(fastify) {
  fastify.get("/api/admin/properties", propertyController.getProperties);
  fastify.get("/api/admin/properties/:id", propertyController.getProperties);
  fastify.post("/api/admin/properties/:id/mutate", propertyController.getProperties);
}

module.exports = propertiesRoutes;
