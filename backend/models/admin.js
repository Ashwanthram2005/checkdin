const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { genId, nowIso, hashPassword } = require("../lib/utils");

async function findById(id) {
  return dbFetch("SELECT id,name,email,role,role_name,status,two_factor,last_active,created_at FROM admin_users WHERE id=$1", [id]);
}

async function findByEmail(email) {
  return dbFetch("SELECT * FROM admin_users WHERE email=$1", [email]);
}

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT id,name,email,role,role_name,status,two_factor,last_active,created_at FROM admin_users ORDER BY created_at DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.role) items = items.filter(i => String(i.role).toLowerCase().includes(filters.role.toLowerCase()));
  if (filters.name) items = items.filter(i => String(i.name).toLowerCase().includes(filters.name.toLowerCase()));
  return items;
}

async function create({ name, email, password, role, role_name, status }) {
  const id = genId();
  await dbExecute(
    "INSERT INTO admin_users (id,name,email,password_hash,role,role_name,status,two_factor,last_active,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
    [id, name, email, hashPassword(password), role || "support", role_name || "Support Admin", status || "Active", 0, null, nowIso()]
  );
  return id;
}

async function update(id, fields) {
  const setClauses = [];
  const vals = [];
  for (const [key, value] of Object.entries(fields)) {
    if (key === "password") {
      setClauses.push(`password_hash=$${vals.length + 1}`);
      vals.push(hashPassword(value));
    } else {
      setClauses.push(`${key}=$${vals.length + 1}`);
      vals.push(value);
    }
  }
  if (setClauses.length) {
    vals.push(id);
    await dbExecute(`UPDATE admin_users SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

async function remove(id) {
  await dbExecute("DELETE FROM admin_users WHERE id=$1", [id]);
}

module.exports = { findById, findByEmail, findAll, create, update, remove };
