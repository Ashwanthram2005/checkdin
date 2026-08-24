const ticketController = require("../../controllers/ticket");

async function ticketsRoutes(fastify) {
  fastify.get("/api/admin/tickets", ticketController.getTickets);
  fastify.get("/api/admin/tickets/:id", ticketController.getTickets);
  fastify.post("/api/admin/tickets/:id/mutate", ticketController.getTickets);
}

module.exports = ticketsRoutes;
