const roomController = require("../../controllers/room");

async function roomsRoutes(fastify) {
  fastify.get("/api/admin/rooms", roomController.getRooms);
  fastify.get("/api/admin/rooms/:id", roomController.getRooms);
  fastify.post("/api/admin/rooms", roomController.getRooms);
  fastify.post("/api/admin/rooms/:id/mutate", roomController.getRooms);
}

module.exports = roomsRoutes;
