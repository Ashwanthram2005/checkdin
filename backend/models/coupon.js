const { dbFetchAll, dbExecute } = require("../lib/db");
const { genId, nowIso } = require("../lib/utils");

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM coupons ORDER BY valid_from DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.type) items = items.filter(i => String(i.type).toLowerCase().includes(filters.type.toLowerCase()));
  return items;
}

async function findById(id) {
  const { dbFetch } = require("../lib/db");
  return dbFetch("SELECT * FROM coupons WHERE id=$1", [id]);
}

async function create(data) {
  const id = genId();
  await dbExecute(
    "INSERT INTO coupons (id,code,description,type,value,min_booking,max_discount,coupon_limit,valid_from,valid_to,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
    [id, data.code || "", data.description || "", data.type || "flat", data.value || 0, data.min_booking || 0, data.max_discount || null, data.coupon_limit || 0, data.valid_from || nowIso(), data.valid_to || nowIso(), data.status || "Active"]
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
  if (setClauses.length) {
    vals.push(id);
    await dbExecute(`UPDATE coupons SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

module.exports = { findAll, findById, create, update };
