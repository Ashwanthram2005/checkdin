const campaignController = require("../../controllers/campaign");

async function campaignsRoutes(fastify) {
  fastify.get("/api/admin/campaigns", campaignController.getCampaigns);
  fastify.get("/api/admin/campaigns/:id", campaignController.getCampaigns);
  fastify.post("/api/admin/campaigns", campaignController.getCampaigns);
  fastify.put("/api/admin/campaigns/:id", campaignController.getCampaigns);
  fastify.post("/api/admin/campaigns/:id", campaignController.getCampaigns);
  fastify.delete("/api/admin/campaigns/:id", campaignController.getCampaigns);
}

module.exports = campaignsRoutes;
