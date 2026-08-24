const { num } = require("../lib/utils");
const { dbFetch, dbFetchAll } = require("../lib/db");

async function getPartnerDashboard(hotelId) {
  const s = {};
  s.total_bookings = num((await dbFetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=$1", [hotelId])).c);
  s.active_bookings = num((await dbFetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=$1 AND status='ongoing'", [hotelId])).c);
  s.total_revenue = num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM customer_bookings WHERE hotel_id=$1", [hotelId])).s);
  s.today_bookings = num((await dbFetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=$1 AND date=$2", [hotelId, new Date().toISOString().slice(0, 10)])).c);
  s.rooms_available = num((await dbFetch("SELECT COUNT(*) as c FROM rooms WHERE property_id=$1 AND status='Available'", [hotelId])).c);
  s.avg_rating = num((await dbFetch("SELECT COALESCE(AVG(rating),0) as a FROM reviews WHERE property_id=$1", [hotelId])).a);
  s.pending_reviews = num((await dbFetch("SELECT COUNT(*) as c FROM reviews WHERE property_id=$1 AND status='Pending'", [hotelId])).c);
  s.open_tickets = num((await dbFetch("SELECT COUNT(*) as c FROM support_tickets WHERE property_id=$1 AND status='Open'", [hotelId])).c);
  return s;
}

async function getPartnerReports(hotelId) {
  return {
    total_bookings: num((await dbFetch("SELECT COUNT(*) as c FROM customer_bookings WHERE hotel_id=$1", [hotelId])).c),
    total_revenue: num((await dbFetch("SELECT COALESCE(SUM(amount),0) as s FROM customer_bookings WHERE hotel_id=$1", [hotelId])).s),
    avg_rating: num((await dbFetch("SELECT COALESCE(AVG(rating),0) as a FROM reviews WHERE property_id=$1", [hotelId])).a),
    rooms: num((await dbFetch("SELECT COUNT(*) as c FROM rooms WHERE property_id=$1", [hotelId])).c),
  };
}

async function getPartnerSettings(hotelId) {
  const hotelModel = require("../models/hotel");
  return hotelModel.findById(hotelId);
}

module.exports = { getPartnerDashboard, getPartnerReports, getPartnerSettings };
