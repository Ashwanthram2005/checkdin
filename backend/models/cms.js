const { dbFetchAll, dbExecute } = require("../lib/db");
const { genId, nowIso } = require("../lib/utils");

async function findAll(typeFilter, filters = {}) {
  let items;
  if (typeFilter) items = await dbFetchAll("SELECT * FROM cms_content WHERE type=$1 ORDER BY sort_order, created_at DESC", [typeFilter]);
  else items = await dbFetchAll("SELECT * FROM cms_content ORDER BY type, sort_order, created_at DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.title) items = items.filter(i => String(i.title).toLowerCase().includes(filters.title.toLowerCase()));
  return items;
}

async function findById(id) {
  const { dbFetch } = require("../lib/db");
  return dbFetch("SELECT * FROM cms_content WHERE id=$1", [id]);
}

async function create(data) {
  const id = genId();
  const dataVal = typeof data.data === "object" ? JSON.stringify(data.data) : (data.data || "{}");
  await dbExecute(
    "INSERT INTO cms_content (id,type,title,data,status,sort_order,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
    [id, data.type || "banner", data.title || "", dataVal, data.status || "Active", data.sort_order || 0, nowIso(), nowIso()]
  );
  return id;
}

async function update(id, fields) {
  const setClauses = [];
  const vals = [];
  for (const [key, value] of Object.entries(fields)) {
    setClauses.push(`${key}=$${vals.length + 1}`);
    vals.push(typeof value === "object" ? JSON.stringify(value) : value);
  }
  setClauses.push(`updated_at=$${vals.length + 1}`);
  vals.push(nowIso());
  if (setClauses.length) {
    vals.push(id);
    await dbExecute(`UPDATE cms_content SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

async function remove(id) {
  await dbExecute("DELETE FROM cms_content WHERE id=$1", [id]);
}

module.exports = { findAll, findById, create, update, remove };
