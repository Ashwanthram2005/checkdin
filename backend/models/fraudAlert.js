const { dbFetchAll, dbExecute } = require("../lib/db");

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM fraud_alerts ORDER BY detected_at DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.type) items = items.filter(i => String(i.type).toLowerCase().includes(filters.type.toLowerCase()));
  return items;
}

async function updateStatus(id, status) {
  await dbExecute("UPDATE fraud_alerts SET status=$1 WHERE id=$2", [status, id]);
}

module.exports = { findAll, updateStatus };
