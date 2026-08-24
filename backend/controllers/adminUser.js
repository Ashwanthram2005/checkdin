const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const adminUserService = require("../services/adminUser");

async function getAdminUsers(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "admin-users");
    if (request.method === "POST" && !itemId) {
      const id = await adminUserService.createAdminUser(request.body || {});
      await writeAuditLog(request, "admin", "Admin User Created", "Admin", id);
      return { ok: true, id };
    }
    if (itemId && request.method === "DELETE") {
      await adminUserService.deleteAdminUser(itemId);
      await writeAuditLog(request, "admin", "Admin User Deleted", "Admin", itemId);
      return { ok: true };
    }
    if (itemId && (request.method === "POST" || request.method === "PUT")) {
      await adminUserService.updateAdminUser(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Admin User Updated", "Admin", itemId);
      return { ok: true };
    }
    const items = await adminUserService.getAdminUsers(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getAdminUsers };
