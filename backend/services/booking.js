const bookingModel = require("../models/booking");
const { nowIso, genId } = require("../lib/utils");

async function getAdminBookings(filters) {
  return bookingModel.findAll(filters);
}

async function getAdminBookingById(id) {
  return bookingModel.findById(id);
}

async function mutateBooking(id, action, request) {
  const allowed = ["approve", "cancel", "checkin", "checkout", "confirm", "pending"];
  if (!allowed.includes(action)) throw { status: 400, message: `Invalid action: ${action}` };
  const now = nowIso();
  const status = action.charAt(0).toUpperCase() + action.slice(1);
  await bookingModel.updateStatus(id, status);
  const b = await bookingModel.findById(id);
  if (b) {
    let tl = [];
    try { tl = JSON.parse(b.timeline || "[]"); } catch {}
    tl.push({ action, at: now, by: "admin" });
    await bookingModel.updateTimeline(id, tl);
  }
  return { ok: true, status };
}

async function getCustomerBookings(customerId) {
  return bookingModel.findCustomerBookings(customerId);
}

async function getCustomerBookingById(id, customerId) {
  return bookingModel.getCustomerBooking(id, customerId);
}

async function createCustomerBooking(customerId, body, hotel) {
  let amount = body.amount || 0;
  if (!amount && hotel) {
    const dur = body.duration || 3;
    amount = dur <= 3 ? hotel.rate_3h : dur <= 6 ? hotel.rate_6h : hotel.rate_12h;
  }
  const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  return bookingModel.createCustomerBooking({
    hotel_id: body.hotel_id || "",
    date: body.date,
    check_in: body.check_in,
    duration: body.duration || 3,
    guests: body.guests || 1,
    amount,
    otp,
    customer_id: customerId,
  });
}

async function cancelCustomerBooking(id, customerId) {
  const b = await bookingModel.getCustomerBooking(id, customerId);
  if (!b) throw { status: 404, message: "Booking not found" };
  await bookingModel.updateCustomerBookingStatus(id, "cancelled");
}

async function rateCustomerBooking(id, customerId, data) {
  const b = await bookingModel.getCustomerBooking(id, customerId);
  if (!b) throw { status: 404, message: "Booking not found" };
  await bookingModel.markRated(id);
  const reviewId = genId();
  const reviewModel = require("../models/review");
  await reviewModel.create({
    property_id: b.hotel_id || "",
    property_name: "Hotel",
    customer_name: data.customerName || "Guest",
    rating: data.rating || 5,
    title: data.title || "",
    body: data.body || "",
    room: "",
    duration: b.duration || 0,
    stayed_on: b.date || "",
  });
  return { review_id: reviewId };
}

async function getPartnerBookings(hotelId, filters) {
  return bookingModel.findHotelBookings(hotelId, filters);
}

async function mutatePartnerBooking(id, hotelId, action) {
  const statusMap = { approve: "confirmed", reject: "rejected", checkin: "checked_in", checkout: "checked_out", cancel: "cancelled" };
  if (!statusMap[action]) throw { status: 400, message: "Invalid action" };
  await bookingModel.updateHotelBookingStatus(id, hotelId, statusMap[action]);
  if (action === "checkin") await bookingModel.updateCustomerBookingCheckIn(id);
  else if (action === "checkout") await bookingModel.updateCustomerBookingCheckOut(id);
  return { ok: true, status: statusMap[action] };
}

module.exports = {
  getAdminBookings, getAdminBookingById, mutateBooking,
  getCustomerBookings, getCustomerBookingById, createCustomerBooking,
  cancelCustomerBooking, rateCustomerBooking,
  getPartnerBookings, mutatePartnerBooking
};
