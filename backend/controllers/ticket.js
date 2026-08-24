const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const ticketService = require("../services/ticket");

async function getTickets(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "tickets");
    if (itemId && segments.includes("mutate") && request.method === "POST") {
      await ticketService.updateTicket(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Ticket Updated", "Support", itemId);
      return { ok: true };
    }
    const items = await ticketService.getTickets(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getTickets };
