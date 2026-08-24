const { paginate, getIdFromSegments } = require("../lib/utils");
const cmsService = require("../services/cms");

async function getCmsContent(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "cms");
    if (itemId && request.method === "DELETE") {
      await cmsService.deleteCmsContent(itemId);
      return { ok: true };
    }
    if (itemId && (request.method === "POST" || request.method === "PUT")) {
      await cmsService.updateCmsContent(itemId, request.body || {});
      return { ok: true };
    }
    if (request.method === "POST") {
      const id = await cmsService.createCmsContent(request.body || {});
      return { ok: true, id };
    }
    const items = await cmsService.getCmsContent(request.query.type, request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getCmsContent };
