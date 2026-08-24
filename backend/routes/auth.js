const authController = require("../controllers/auth");

async function authRoutes(fastify) {
  fastify.post("/api/auth/login/admin", authController.loginAdmin);
  fastify.post("/api/auth/login/customer", authController.loginCustomer);
  fastify.post("/api/auth/login/partner", authController.loginPartner);
  fastify.get("/api/auth/me", authController.getMe);
  fastify.put("/api/auth/profile", authController.updateProfile);
}

module.exports = authRoutes;
