const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { genId } = require("../lib/utils");

async function findById(id) {
  return dbFetch("SELECT * FROM rooms WHERE id=$1", [id]);
}

async function findByPropertyId(propertyId) {
  return dbFetchAll("SELECT * FROM rooms WHERE property_id=$1 ORDER BY name", [propertyId]);
}

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM rooms ORDER BY property_name,name");
  if (filters.property) items = items.filter(i => String(i.property_name).toLowerCase().includes(filters.property.toLowerCase()));
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.type) items = items.filter(i => String(i.type).toLowerCase().includes(filters.type.toLowerCase()));
  return items;
}

async function create(data) {
  const id = genId();
  await dbExecute(
    "INSERT INTO rooms (id,code,property_id,property_name,name,type,capacity,base_rate,status,floor) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
    [id, data.code || `R-${id.slice(0, 6).toUpperCase()}`, data.property_id || "", data.property_name || "", data.name || "", data.type || "Standard", data.capacity || 2, data.base_rate || 0, data.status || "Available", data.floor || 1]
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
    await dbExecute(`UPDATE rooms SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

async function updateByProperty(id, propertyId, fields) {
  const setClauses = [];
  const vals = [];
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      setClauses.push(`${key}=$${vals.length + 1}`);
      vals.push(value);
    }
  }
  if (setClauses.length) {
    vals.push(id, propertyId);
    await dbExecute(`UPDATE rooms SET ${setClauses.join(",")} WHERE id=$${vals.length - 1} AND property_id=$${vals.length}`, vals);
  }
}

module.exports = { findById, findByPropertyId, findAll, create, update, updateByProperty };
