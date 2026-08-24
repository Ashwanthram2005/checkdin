const { dbFetch, dbFetchAll, dbExecute } = require("../../lib/db");
const { nowIso } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

async function handleAdminSettings(request, reply) {
  if (request.method === "POST") {
    const body = request.body || {};
    for (const [key, value] of Object.entries(body)) {
      const val = typeof value === "object" ? JSON.stringify(value) : String(value);
      const existing = await dbFetch("SELECT key FROM settings WHERE key=$1", [key]);
      if (existing) await dbExecute("UPDATE settings SET value=$1, updated_at=$2 WHERE key=$3", [val, nowIso(), key]);
      else await dbExecute("INSERT INTO settings (key,value,updated_at) VALUES ($1,$2,$3)", [key, val, nowIso()]);
    }
    await writeAuditLog(request, "admin", "Settings Updated", "Settings", Object.keys(body).join(","));
    return { ok: true, message: "Settings saved" };
  }
  const rows = await dbFetchAll("SELECT key,value FROM settings");
  const defaults = { site_name: "CheckDin", currency: "INR", tax_rate: "18", commission_rate: "15", min_booking_amount: "100", support_email: "support@checkdin.com", maintenance_mode: "false" };
  for (const r of rows) { try { defaults[r.key] = JSON.parse(r.value); } catch { defaults[r.key] = r.value; } }
  return defaults;
}

async function settingsRoutes(fastify) {
  fastify.get("/api/admin/settings", handleAdminSettings);
  fastify.post("/api/admin/settings", handleAdminSettings);
}

module.exports = settingsRoutes;
