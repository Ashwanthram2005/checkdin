const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { nowIso } = require("../lib/utils");

async function findAll() {
  return dbFetchAll("SELECT key,value FROM settings");
}

async function findByKey(key) {
  return dbFetch("SELECT key,value FROM settings WHERE key=$1", [key]);
}

async function upsert(key, value) {
  const val = typeof value === "object" ? JSON.stringify(value) : String(value);
  const existing = await dbFetch("SELECT key FROM settings WHERE key=$1", [key]);
  if (existing) {
    await dbExecute("UPDATE settings SET value=$1, updated_at=$2 WHERE key=$3", [val, nowIso(), key]);
  } else {
    await dbExecute("INSERT INTO settings (key,value,updated_at) VALUES ($1,$2,$3)", [key, val, nowIso()]);
  }
}

async function getDefaults() {
  const defaults = { site_name: "CheckDin", currency: "INR", tax_rate: "18", commission_rate: "15", min_booking_amount: "100", support_email: "support@checkdin.com", maintenance_mode: "false" };
  const rows = await findAll();
  for (const r of rows) { try { defaults[r.key] = JSON.parse(r.value); } catch { defaults[r.key] = r.value; } }
  return defaults;
}

module.exports = { findAll, findByKey, upsert, getDefaults };
