const { authFromRequest } = require("../lib/auth");
const { dbFetch } = require("../lib/db");

async function getPartnerHotelId(info) {
  if (!info || info.user_type !== "partner") return null;
  const u = await dbFetch("SELECT hotel_id FROM partner_users WHERE id=$1", [info.user_id]);
  return u ? u.hotel_id : null;
}

async function requirePartner(request, reply) {
  const info = authFromRequest(request);
  if (!info || info.user_type !== "partner") { reply.code(403).send({ error: "Partner access required" }); return null; }
  const hid = await getPartnerHotelId(info);
  if (!hid) { reply.code(403).send({ error: "Partner access required" }); return null; }
  return hid;
}

module.exports = { requirePartner };
