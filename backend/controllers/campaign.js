const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const campaignService = require("../services/campaign");

async function getCampaigns(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "campaigns");
    if (request.method === "POST" && !itemId) {
      const id = await campaignService.createCampaign(request.body || {});
      await writeAuditLog(request, "admin", "Campaign Created", "Marketing", id);
      return { ok: true, id };
    }
    if (itemId && request.method === "DELETE") {
      await campaignService.deleteCampaign(itemId);
      await writeAuditLog(request, "admin", "Campaign Deleted", "Marketing", itemId);
      return { ok: true };
    }
    if (itemId && (request.method === "POST" || request.method === "PUT")) {
      await campaignService.updateCampaign(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Campaign Updated", "Marketing", itemId);
      return { ok: true };
    }
    const items = await campaignService.getCampaigns(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getCampaigns };
