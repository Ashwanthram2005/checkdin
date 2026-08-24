const adminUserController = require("../../controllers/adminUser");

async function adminUsersRoutes(fastify) {
  fastify.get("/api/admin/admin-users", adminUserController.getAdminUsers);
  fastify.get("/api/admin/admin-users/:id", adminUserController.getAdminUsers);
  fastify.post("/api/admin/admin-users", adminUserController.getAdminUsers);
  fastify.put("/api/admin/admin-users/:id", adminUserController.getAdminUsers);
  fastify.post("/api/admin/admin-users/:id", adminUserController.getAdminUsers);
  fastify.delete("/api/admin/admin-users/:id", adminUserController.getAdminUsers);
}

module.exports = adminUsersRoutes;
