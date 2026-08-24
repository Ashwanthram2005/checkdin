const { dbFetchAll, dbExecute } = require("../lib/db");
const { genId } = require("../lib/utils");

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM campaigns ORDER BY scheduled_at DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.channel) items = items.filter(i => String(i.channel).toLowerCase().includes(filters.channel.toLowerCase()));
  return items;
}

async function findById(id) {
  const { dbFetch } = require("../lib/db");
  return dbFetch("SELECT * FROM campaigns WHERE id=$1", [id]);
}

async function create(data) {
  const id = genId();
  await dbExecute(
    "INSERT INTO campaigns (id,title,channel,audience,sent,delivered,opened,status,scheduled_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
    [id, data.title || "", data.channel || "Email", data.audience || "All Users", 0, 0, 0, data.status || "Draft", data.scheduled_at || null]
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
    await dbExecute(`UPDATE campaigns SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

async function remove(id) {
  await dbExecute("DELETE FROM campaigns WHERE id=$1", [id]);
}

module.exports = { findAll, findById, create, update, remove };
