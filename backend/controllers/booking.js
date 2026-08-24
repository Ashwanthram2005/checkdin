const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const bookingService = require("../services/booking");

async function getAdminBookings(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "bookings");
    if (itemId && segments.includes("mutate") && request.method === "POST") {
      const body = request.body || {};
      const act = body.action || "";
      await writeAuditLog(request, "admin", `Booking ${act}`, "Booking", itemId);
      return await bookingService.mutateBooking(itemId, act, request);
    }
    if (itemId && itemId !== "mutate") {
      return await bookingService.getAdminBookingById(itemId) || { error: "Not found" };
    }
    const items = await bookingService.getAdminBookings(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function getCustomerBookings(request, reply) {
  try {
    const { authFromRequest } = require("../lib/auth");
    const info = authFromRequest(request);
    if (!info) return reply.code(401).send({ error: "Login required" });
    const cid = info.user_id;
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "bookings");

    if (itemId) {
      if (segments.includes("cancel") && request.method === "POST") {
        await bookingService.cancelCustomerBooking(itemId, cid);
        return { ok: true };
      }
      if (segments.includes("rate") && request.method === "POST") {
        const body = request.body || {};
        return await bookingService.rateCustomerBooking(itemId, cid, {
          rating: body.rating,
          title: body.title,
          body: body.body,
          customerName: info.name,
        });
      }
      return await bookingService.getCustomerBookingById(itemId, cid) || { error: "Not found" };
    }

    if (request.method === "POST") {
      const body = request.body || {};
      const hotelModel = require("../models/hotel");
      const hotel = await hotelModel.findById(body.hotel_id || "");
      return await bookingService.createCustomerBooking(cid, body, hotel);
    }

    const items = await bookingService.getCustomerBookings(cid);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function getPartnerBookings(request, reply) {
  try {
    const { requirePartner } = require("../middleware/partnerAuth");
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    const segments = request.url.split("/").filter(Boolean);
    const itemId = segments.find(s => s !== "bookings" && !["partner", "api"].includes(s) && s.length > 6 && s !== "action");
    if (itemId && request.method === "POST") {
      let action = "";
      for (const a of ["approve", "reject", "checkin", "checkout", "cancel"]) { if (segments.includes(a)) { action = a; break; } }
      if (!action) return reply.code(400).send({ error: "Action required" });
      return await bookingService.mutatePartnerBooking(itemId, hid, action);
    }
    const items = await bookingService.getPartnerBookings(hid, request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getAdminBookings, getCustomerBookings, getPartnerBookings };
