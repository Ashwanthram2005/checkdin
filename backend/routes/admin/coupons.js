const { dbFetchAll, dbExecute } = require("../../lib/db");
const { genId, nowIso, filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

async function handleAdminCoupons(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "coupons");
  if (request.method === "POST" && !itemId) {
    const body = request.body || {}; const cid = genId();
    await dbExecute("INSERT INTO coupons (id,code,description,type,value,min_booking,max_discount,coupon_limit,valid_from,valid_to,status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
      [cid, body.code || "", body.description || "", body.type || "flat", body.value || 0, body.min_booking || 0, body.max_discount || null, body.coupon_limit || 0, body.valid_from || nowIso(), body.valid_to || nowIso(), body.status || "Active"]);
    await writeAuditLog(request, "admin", "Coupon Created", "Marketing", cid);
    return { ok: true, id: cid };
  }
  if (request.method === "PUT" && itemId) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["code", "description", "type", "value", "min_booking", "max_discount", "coupon_limit", "valid_from", "valid_to", "status"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE coupons SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Coupon Updated", "Marketing", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM coupons ORDER BY valid_from DESC");
  items = filterItems(items, request.query, { status: "status", type: "type" });
  return paginate(items, request.query);
}

async function couponsRoutes(fastify) {
  fastify.get("/api/admin/coupons", handleAdminCoupons);
  fastify.get("/api/admin/coupons/:id", handleAdminCoupons);
  fastify.post("/api/admin/coupons", handleAdminCoupons);
  fastify.put("/api/admin/coupons/:id", handleAdminCoupons);
}

module.exports = couponsRoutes;
