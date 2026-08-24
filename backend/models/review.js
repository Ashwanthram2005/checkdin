const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { genId, nowIso } = require("../lib/utils");

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM reviews ORDER BY created_at DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.property) items = items.filter(i => String(i.property_name).toLowerCase().includes(filters.property.toLowerCase()));
  return items;
}

async function findByProperty(propertyId) {
  return dbFetchAll("SELECT * FROM reviews WHERE property_id=$1 ORDER BY created_at DESC", [propertyId]);
}

async function findById(id) {
  return dbFetch("SELECT * FROM reviews WHERE id=$1", [id]);
}

async function update(id, fields) {
  const setClauses = [];
  const vals = [];
  for (const [key, value] of Object.entries(fields)) {
    setClauses.push(`${key}=$${vals.length + 1}`);
    vals.push(value);
  }
  if (fields.response !== undefined) {
    setClauses.push(`replied_on=$${vals.length + 1}`);
    vals.push(nowIso());
  }
  if (setClauses.length) {
    vals.push(id);
    await dbExecute(`UPDATE reviews SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

async function create(data) {
  const id = genId();
  await dbExecute(
    "INSERT INTO reviews (id,property_id,property_name,customer_name,rating,title,body,created_at,room,duration,stayed_on) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
    [id, data.property_id, data.property_name, data.customer_name, data.rating || 5, data.title || "", data.body || "", nowIso(), data.room || "", data.duration || 0, data.stayed_on || ""]
  );
  return id;
}

module.exports = { findAll, findByProperty, findById, update, create };
