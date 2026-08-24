const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { genId, nowIso } = require("../lib/utils");

async function findById(id) {
  return dbFetch("SELECT * FROM customers WHERE id=$1", [id]);
}

async function findByEmailOrPhone(email, phone) {
  return dbFetch("SELECT * FROM customers WHERE email=$1 OR phone=$2", [email, phone]);
}

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM customers ORDER BY joined_at DESC");
  if (filters.city) items = items.filter(i => String(i.city).toLowerCase().includes(filters.city.toLowerCase()));
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.name) items = items.filter(i => String(i.name).toLowerCase().includes(filters.name.toLowerCase()));
  return items;
}

async function create({ name, email, phone, city }) {
  const id = genId();
  await dbExecute(
    "INSERT INTO customers (id,name,email,phone,city,joined_at,status) VALUES ($1,$2,$3,$4,$5,$6,$7)",
    [id, name, email, phone, city || "", nowIso(), "Active"]
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
    await dbExecute(`UPDATE customers SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

module.exports = { findById, findByEmailOrPhone, findAll, create, update };
