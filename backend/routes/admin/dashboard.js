const { dbFetch, dbFetchAll, dbExecute } = require("../../lib/db");
const { num, nowIso, genId, filterItems, paginate } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

async function handleAdminDashboard(request, reply) {
  const stats = {};
  stats.total_properties = num((await dbFetch("SELECT COUNT(*) as c FROM properties")).c);
  stats.total_bookings = num((await dbFetch("SELECT COUNT(*) as c FROM bookings")).c);
  stats.total_customers = num((await dbFetch("SELECT COUNT(*) as c FROM customers")).c);
  stats.total_partners = num((await dbFetch("SELECT COUNT(*) as c FROM partners")).c);
  stats.total_revenue = num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings")).s);
  stats.pending_bookings = num((await dbFetch("SELECT COUNT(*) as c FROM bookings WHERE status='Pending'")).c);
  stats.active_properties = num((await dbFetch("SELECT COUNT(*) as c FROM properties WHERE status='Active'")).c);
  stats.pending_refunds = num((await dbFetch("SELECT COUNT(*) as c FROM refunds WHERE status='Requested'")).c);
  stats.open_tickets = num((await dbFetch("SELECT COUNT(*) as c FROM tickets WHERE status='Open'")).c);
  stats.open_fraud = num((await dbFetch("SELECT COUNT(*) as c FROM fraud_alerts WHERE status='Open'")).c);
  return stats;
}

async function dashboardRoutes(fastify) {
  fastify.get("/api/admin/dashboard", handleAdminDashboard);
}

module.exports = dashboardRoutes;
