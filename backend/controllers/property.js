const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const propertyService = require("../services/property");

async function getProperties(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "properties");
    if (itemId && segments.includes("mutate") && request.method === "POST") {
      await propertyService.updateProperty(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Property Updated", "Property", itemId);
      return { ok: true };
    }
    if (itemId && itemId !== "mutate") {
      return await propertyService.getPropertyById(itemId) || { error: "Not found" };
    }
    const items = await propertyService.getProperties(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getProperties };
