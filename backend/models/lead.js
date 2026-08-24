const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { genId } = require("../lib/utils");

async function create(data) {
  const id = genId();
  await dbExecute(
    "INSERT INTO property_leads (id,property_name,contact_name,mobile,whatsapp,email,city,property_type,total_rooms,short_stay_interest,couple_friendly,source,comments,consent) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
    [id, data.property_name || "", data.contact_name || "", data.mobile || "", data.whatsapp || "", data.email || "", data.city || "", data.property_type || "", data.total_rooms || 0, data.short_stay_interest || 0, data.couple_friendly || 0, data.source || "website", data.comments || "", data.consent || 0]
  );
  return id;
}

module.exports = { create };
