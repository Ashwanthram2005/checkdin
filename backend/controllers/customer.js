const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const customerService = require("../services/customer");

async function getCustomers(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "customers");
    if (itemId && segments.includes("mutate") && request.method === "POST") {
      await customerService.updateCustomer(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Customer Updated", "Customer", itemId);
      return { ok: true };
    }
    if (itemId && itemId !== "mutate") {
      return await customerService.getCustomerById(itemId) || { error: "Not found" };
    }
    const items = await customerService.getCustomers(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getCustomers };
