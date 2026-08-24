const couponController = require("../../controllers/coupon");

async function couponsRoutes(fastify) {
  fastify.get("/api/admin/coupons", couponController.getCoupons);
  fastify.get("/api/admin/coupons/:id", couponController.getCoupons);
  fastify.post("/api/admin/coupons", couponController.getCoupons);
  fastify.put("/api/admin/coupons/:id", couponController.getCoupons);
}

module.exports = couponsRoutes;
