const { dbFetchAll } = require("../lib/db");

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM audit_logs ORDER BY at DESC");
  if (filters.actor) items = items.filter(i => String(i.actor).toLowerCase().includes(filters.actor.toLowerCase()));
  if (filters.action) items = items.filter(i => String(i.action).toLowerCase().includes(filters.action.toLowerCase()));
  if (filters.role) items = items.filter(i => String(i.role).toLowerCase().includes(filters.role.toLowerCase()));
  return items;
}

async function findByProperty(propertyId) {
  return dbFetchAll("SELECT * FROM partner_audit_logs WHERE property_id=$1 ORDER BY time DESC", [propertyId]);
}

module.exports = { findAll, findByProperty };
