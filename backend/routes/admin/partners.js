const partnerController = require("../../controllers/partner");

async function partnersRoutes(fastify) {
  fastify.get("/api/admin/partners", partnerController.getPartners);
  fastify.get("/api/admin/partners/:id", partnerController.getPartners);
  fastify.post("/api/admin/partners/:id/mutate", partnerController.getPartners);
}

module.exports = partnersRoutes;
