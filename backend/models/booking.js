const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { genId, nowIso, makeRef } = require("../lib/utils");

async function findById(id) {
  return dbFetch("SELECT * FROM bookings WHERE id=$1", [id]);
}

async function findAll(filters = {}) {
  let items = await dbFetchAll("SELECT * FROM bookings ORDER BY created_at DESC");
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  if (filters.city) items = items.filter(i => String(i.city).toLowerCase().includes(filters.city.toLowerCase()));
  if (filters.customer) items = items.filter(i => String(i.customer_name).toLowerCase().includes(filters.customer.toLowerCase()));
  if (filters.property) items = items.filter(i => String(i.property_name).toLowerCase().includes(filters.property.toLowerCase()));
  return items;
}

async function updateStatus(id, status) {
  await dbExecute("UPDATE bookings SET status=$1 WHERE id=$2", [status, id]);
}

async function updateTimeline(id, timeline) {
  await dbExecute("UPDATE bookings SET timeline=$1 WHERE id=$2", [JSON.stringify(timeline), id]);
}

async function getCustomerBooking(id, customerId) {
  return dbFetch("SELECT * FROM customer_bookings WHERE id=$1 AND customer_id=$2", [id, customerId]);
}

async function findCustomerBookings(customerId) {
  return dbFetchAll("SELECT * FROM customer_bookings WHERE customer_id=$1 ORDER BY date DESC", [customerId]);
}

async function findHotelBookings(hotelId, filters = {}) {
  let items = await dbFetchAll("SELECT * FROM customer_bookings WHERE hotel_id=$1 ORDER BY date DESC", [hotelId]);
  if (filters.status) items = items.filter(i => String(i.status).toLowerCase().includes(filters.status.toLowerCase()));
  return items;
}

async function createCustomerBooking(data) {
  const id = genId();
  const ref = makeRef("CBK");
  await dbExecute(
    "INSERT INTO customer_bookings (id,reference,hotel_id,date,check_in,duration,guests,amount,status,otp,customer_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
    [id, ref, data.hotel_id, data.date || nowIso().slice(0, 10), data.check_in || "14:00", data.duration || 3, data.guests || 1, data.amount, "ongoing", data.otp, data.customer_id]
  );
  return { id, reference: ref };
}

async function updateCustomerBookingStatus(id, status) {
  await dbExecute("UPDATE customer_bookings SET status=$1 WHERE id=$2", [status, id]);
}

async function updateCustomerBookingCheckIn(id) {
  await dbExecute("UPDATE customer_bookings SET check_in_time=$1 WHERE id=$2", [nowIso(), id]);
}

async function updateCustomerBookingCheckOut(id) {
  await dbExecute("UPDATE customer_bookings SET check_out_time=$1 WHERE id=$2", [nowIso(), id]);
}

async function updateHotelBookingStatus(id, hotelId, status) {
  await dbExecute("UPDATE customer_bookings SET status=$1 WHERE id=$2 AND hotel_id=$3", [status, id, hotelId]);
}

async function markRated(id) {
  await dbExecute("UPDATE customer_bookings SET rated=1 WHERE id=$1", [id]);
}

module.exports = {
  findById, findAll, updateStatus, updateTimeline,
  getCustomerBooking, findCustomerBookings, findHotelBookings,
  createCustomerBooking, updateCustomerBookingStatus, updateCustomerBookingCheckIn,
  updateCustomerBookingCheckOut, updateHotelBookingStatus, markRated
};
