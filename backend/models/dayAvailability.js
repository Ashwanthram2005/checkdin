const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { genId } = require("../lib/utils");

async function findByProperty(propertyId) {
  return dbFetchAll("SELECT * FROM day_availability WHERE property_id=$1 ORDER BY date", [propertyId]);
}

async function findByPropertyAndDate(propertyId, date) {
  return dbFetch("SELECT * FROM day_availability WHERE property_id=$1 AND date=$2", [propertyId, date]);
}

async function upsert(propertyId, date, data) {
  const existing = await findByPropertyAndDate(propertyId, date);
  if (existing) {
    const setClauses = [];
    const vals = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        setClauses.push(`${key}=$${vals.length + 1}`);
        vals.push(value);
      }
    }
    if (setClauses.length) {
      vals.push(propertyId, date);
      await dbExecute(`UPDATE day_availability SET ${setClauses.join(",")} WHERE property_id=$${vals.length - 1} AND date=$${vals.length}`, vals);
    }
  } else {
    await dbExecute(
      "INSERT INTO day_availability (id,property_id,date,day,allocated,booked,blocked) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [genId(), propertyId, date, data.day || "", data.allocated || 0, data.booked || 0, data.blocked || 0]
    );
  }
}

module.exports = { findByProperty, findByPropertyAndDate, upsert };
