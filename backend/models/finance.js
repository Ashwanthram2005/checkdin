const { dbFetchAll, dbExecute } = require("../lib/db");

async function findAllPayouts(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM payouts ORDER BY requested_at DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.partner) items = items.filter(i => String(i.partner_name).toLowerCase().includes(filters.partner.toLowerCase()));
  return items;
}

async function findPayoutsByPartner(partnerId) {
  return dbFetchAll("SELECT * FROM payouts WHERE partner_id=$1 ORDER BY requested_at DESC", [partnerId]);
}

async function updatePayout(id, fields) {
  const setClauses = [];
  const vals = [];
  for (const [key, value] of Object.entries(fields)) {
    setClauses.push(`${key}=$${vals.length + 1}`);
    vals.push(value);
  }
  if (setClauses.length) {
    vals.push(id);
    await dbExecute(`UPDATE payouts SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

async function findAllRefunds(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM refunds ORDER BY requested_at DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.customer) items = items.filter(i => String(i.customer_name).toLowerCase().includes(filters.customer.toLowerCase()));
  return items;
}

async function updateRefundStatus(id, status) {
  await dbExecute("UPDATE refunds SET status=$1 WHERE id=$2", [status, id]);
}

async function findEarningsByProperty(propertyId) {
  return dbFetchAll("SELECT * FROM earnings WHERE property_id=$1 ORDER BY date DESC", [propertyId]);
}

module.exports = { findAllPayouts, findPayoutsByPartner, updatePayout, findAllRefunds, updateRefundStatus, findEarningsByProperty };
