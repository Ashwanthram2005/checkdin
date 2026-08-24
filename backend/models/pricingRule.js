const { dbFetchAll, dbExecute } = require("../lib/db");
const { genId, nowIso } = require("../lib/utils");

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM pricing_rules ORDER BY updated_at DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.scope) items = items.filter(i => String(i.scope).toLowerCase().includes(filters.scope.toLowerCase()));
  return items;
}

async function findById(id) {
  const { dbFetch } = require("../lib/db");
  return dbFetch("SELECT * FROM pricing_rules WHERE id=$1", [id]);
}

async function create(data) {
  const id = genId();
  await dbExecute(
    "INSERT INTO pricing_rules (id,name,scope,trigger,adjustment,channel,status,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
    [id, data.name || "", data.scope || "All", data.trigger || "", data.adjustment || "0%", data.channel || "All", data.status || "Active", nowIso()]
  );
  return id;
}

async function update(id, fields) {
  const setClauses = [];
  const vals = [];
  for (const [key, value] of Object.entries(fields)) {
    setClauses.push(`${key}=$${vals.length + 1}`);
    vals.push(value);
  }
  setClauses.push(`updated_at=$${vals.length + 1}`);
  vals.push(nowIso());
  if (setClauses.length) {
    vals.push(id);
    await dbExecute(`UPDATE pricing_rules SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

async function remove(id) {
  await dbExecute("DELETE FROM pricing_rules WHERE id=$1", [id]);
}

module.exports = { findAll, findById, create, update, remove };
