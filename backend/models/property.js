const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");

async function findById(id) {
  return dbFetch("SELECT * FROM properties WHERE id=$1", [id]);
}

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM properties ORDER BY onboarded_at DESC");
  if (filters.city) items = items.filter(i => String(i.city).toLowerCase().includes(filters.city.toLowerCase()));
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.type) items = items.filter(i => String(i.type).toLowerCase().includes(filters.type.toLowerCase()));
  if (filters.partner) items = items.filter(i => String(i.partner_name).toLowerCase().includes(filters.partner.toLowerCase()));
  return items;
}

async function update(id, fields) {
  const setClauses = [];
  const vals = [];
  for (const [key, value] of Object.entries(fields)) {
    setClauses.push(`${key}=$${vals.length + 1}`);
    vals.push(value);
  }
  if (setClauses.length) {
    vals.push(id);
    await dbExecute(`UPDATE properties SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

module.exports = { findById, findAll, update };
