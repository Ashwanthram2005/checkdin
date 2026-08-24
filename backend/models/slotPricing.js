const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { genId } = require("../lib/utils");

async function findByProperty(propertyId) {
  return dbFetch("SELECT * FROM slot_pricing WHERE property_id=$1", [propertyId]);
}

async function upsert(propertyId, data) {
  const existing = await findByProperty(propertyId);
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
      vals.push(propertyId);
      await dbExecute(`UPDATE slot_pricing SET ${setClauses.join(",")} WHERE property_id=$${vals.length}`, vals);
    }
  } else {
    await dbExecute(
      "INSERT INTO slot_pricing (id,property_id,price_3h,price_6h,price_12h,extra_hour,weekend_surcharge) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [genId(), propertyId, data.price_3h || 0, data.price_6h || 0, data.price_12h || 0, data.extra_hour || 0, data.weekend_surcharge || 0]
    );
  }
}

module.exports = { findByProperty, upsert };
