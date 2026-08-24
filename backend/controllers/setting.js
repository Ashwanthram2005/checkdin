const settingService = require("../services/setting");
const { writeAuditLog } = require("../lib/audit");

async function getSettings(request, reply) {
  try {
    if (request.method === "POST") {
      await settingService.updateSettings(request.body || {});
      await writeAuditLog(request, "admin", "Settings Updated", "Settings", Object.keys(request.body || {}).join(","));
      return { ok: true, message: "Settings saved" };
    }
    return await settingService.getSettings();
  } catch (e) {
    return reply.code(500).send({ error: e.message });
  }
}

module.exports = { getSettings };
