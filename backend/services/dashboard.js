const { num, nowIso, genId } = require("../lib/utils");
const { dbFetch, dbFetchAll } = require("../lib/db");

async function getDashboardStats() {
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

async function getReports(from, to) {
  return {
    revenue: {
      total: num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings")).s),
      this_month: num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings WHERE created_at >= date_trunc('month', NOW())::text")).s),
      in_range: num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM bookings WHERE created_at >= $1 AND created_at <= $2", [from, to])).s),
    },
    bookings: {
      total: num((await dbFetch("SELECT COUNT(*) as c FROM bookings")).c),
      confirmed: num((await dbFetch("SELECT COUNT(*) as c FROM bookings WHERE status='Confirmed'")).c),
      cancelled: num((await dbFetch("SELECT COUNT(*) as c FROM bookings WHERE status='Cancelled'")).c),
      in_range: num((await dbFetch("SELECT COUNT(*) as c FROM bookings WHERE created_at >= $1 AND created_at <= $2", [from, to])).c),
    },
    occupancy_rate: num((await dbFetch("SELECT COALESCE(AVG(occupancy),0) as a FROM properties")).a),
    avg_rating: num((await dbFetch("SELECT COALESCE(AVG(rating),0) as a FROM properties WHERE rating > 0")).a),
    top_properties: await dbFetchAll("SELECT name, city, revenue, rating FROM properties ORDER BY revenue DESC LIMIT 5"),
    top_partners: await dbFetchAll("SELECT name, city, revenue FROM partners ORDER BY revenue DESC LIMIT 5"),
    bookings_by_status: await dbFetchAll("SELECT status, COUNT(*) as count FROM bookings GROUP BY status"),
    revenue_by_city: await dbFetchAll("SELECT city, SUM(amount) as revenue FROM bookings GROUP BY city ORDER BY revenue DESC"),
  };
}

module.exports = { getDashboardStats, getReports };
