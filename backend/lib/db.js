const pool = require("../config/database");

async function dbFetch(query, params = []) {
  const { rows } = await pool.query(query, params);
  return rows[0] || null;
}

async function dbFetchAll(query, params = []) {
  const { rows } = await pool.query(query, params);
  return rows;
}

async function dbExecute(query, params = []) {
  await pool.query(query, params);
}

module.exports = { dbFetch, dbFetchAll, dbExecute };
