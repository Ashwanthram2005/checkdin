const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");

async function findById(id) {
  return dbFetch("SELECT * FROM partners WHERE id=$1", [id]);
}

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM partners ORDER BY joined_at DESC");
  if (filters.city) items = items.filter(i => String(i.city).toLowerCase().includes(filters.city.toLowerCase()));
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  return items;
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
    await dbExecute(`UPDATE partners SET ${setClauses.join(",")} WHERE id=$${vals.length}`, vals);
  }
}

async function findUserById(userId) {
  return dbFetch("SELECT * FROM partner_users WHERE id=$1", [userId]);
}

async function findUserByHotelAndId(hotelId, userId) {
  return dbFetch("SELECT * FROM partner_users WHERE id=$1 AND hotel_id=$2", [userId, hotelId]);
}

async function findUsersByHotel(hotelId) {
  return dbFetchAll("SELECT id,name,role_id,active FROM partner_users WHERE hotel_id=$1 AND active=1", [hotelId]);
}

async function updateLastLogin(userId) {
  await dbExecute("UPDATE partner_users SET last_login=$1 WHERE id=$2", [nowIso(), userId]);
}

module.exports = { findById, findAll, update, findUserById, findUserByHotelAndId, findUsersByHotel, updateLastLogin };
