const { dbFetch, dbFetchAll } = require("../lib/db");

async function findById(id) {
  return dbFetch("SELECT * FROM hotels WHERE id=$1", [id]);
}

async function findAll() {
  return dbFetchAll("SELECT * FROM hotels ORDER BY rating DESC");
}

module.exports = { findById, findAll };
