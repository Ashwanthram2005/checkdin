const { dbFetchAll, dbExecute } = require("../lib/db");

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM tickets ORDER BY created_at DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.priority) items = items.filter(i => String(i.priority).toLowerCase().includes(filters.priority.toLowerCase()));
  if (filters.category) items = items.filter(i => String(i.category).toLowerCase().includes(filters.category.toLowerCase()));
  return items;
}

async function findByProperty(propertyId) {
  return dbFetchAll("SELECT * FROM support_tickets WHERE property_id=$1 ORDER BY created_on DESC", [propertyId]);
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
    await dbExecute(`UPDATE tickets SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

module.exports = { findAll, findByProperty, update };
