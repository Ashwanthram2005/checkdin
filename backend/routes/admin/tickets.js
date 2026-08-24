const { dbFetchAll, dbExecute } = require("../../lib/db");
const { filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

async function handleAdminTickets(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "tickets");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["status", "priority", "agent"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE tickets SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Ticket Updated", "Support", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM tickets ORDER BY created_at DESC");
  items = filterItems(items, request.query, { status: "status", priority: "priority", category: "category" });
  return paginate(items, request.query);
}

async function ticketsRoutes(fastify) {
  fastify.get("/api/admin/tickets", handleAdminTickets);
  fastify.get("/api/admin/tickets/:id", handleAdminTickets);
  fastify.post("/api/admin/tickets/:id/mutate", handleAdminTickets);
}

module.exports = ticketsRoutes;
