const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const couponService = require("../services/coupon");

async function getCoupons(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "coupons");
    if (request.method === "POST" && !itemId) {
      const id = await couponService.createCoupon(request.body || {});
      await writeAuditLog(request, "admin", "Coupon Created", "Marketing", id);
      return { ok: true, id };
    }
    if (request.method === "PUT" && itemId) {
      await couponService.updateCoupon(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Coupon Updated", "Marketing", itemId);
      return { ok: true };
    }
    const items = await couponService.getCoupons(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getCoupons };
