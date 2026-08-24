const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { genId, nowIso, makeRef, paginate, getIdFromSegments } = require("../lib/utils");
const { authFromRequest } = require("../lib/auth");

async function handleCustomerHotels(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "hotels");
  if (itemId) {
    const h = await dbFetch("SELECT * FROM hotels WHERE id=$1", [itemId]);
    if (!h) return reply.code(404).send({ error: "Hotel not found" });
    const rooms = await dbFetchAll("SELECT * FROM rooms WHERE property_id=$1", [itemId]);
    const pricing = await dbFetch("SELECT * FROM slot_pricing WHERE property_id=$1", [itemId]);
    return { ...h, rooms, pricing: pricing || {} };
  }
  const qp = request.query;
  let items = await dbFetchAll("SELECT * FROM hotels ORDER BY rating DESC");
  if (qp.search) { const s = qp.search.toLowerCase(); items = items.filter(h => (h.name || "").toLowerCase().includes(s) || (h.area || "").toLowerCase().includes(s)); }
  if (qp.city) items = items.filter(h => (h.city || "").toLowerCase() === qp.city.toLowerCase());
  return paginate(items, qp);
}

async function handleCustomerBookings(request, reply) {
  const info = authFromRequest(request);
  if (!info) return reply.code(401).send({ error: "Login required" });
  const cid = info.user_id;
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "bookings");

  if (itemId) {
    if (segments.includes("cancel") && request.method === "POST") {
      const b = await dbFetch("SELECT * FROM customer_bookings WHERE id=$1 AND customer_id=$2", [itemId, cid]);
      if (!b) return reply.code(404).send({ error: "Booking not found" });
      await dbExecute("UPDATE customer_bookings SET status=$1 WHERE id=$2", ["cancelled", itemId]);
      return { ok: true };
    }
    if (segments.includes("rate") && request.method === "POST") {
      const body = request.body || {};
      const b = await dbFetch("SELECT * FROM customer_bookings WHERE id=$1 AND customer_id=$2", [itemId, cid]);
      if (!b) return reply.code(404).send({ error: "Booking not found" });
      await dbExecute("UPDATE customer_bookings SET rated=1 WHERE id=$1", [itemId]);
      const rid = genId();
      await dbExecute("INSERT INTO reviews (id,property_id,property_name,customer_name,rating,title,body,created_at,room,duration,stayed_on) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
        [rid, b.hotel_id || "", "Hotel", info.name || "Guest", body.rating || 5, body.title || "", body.body || "", nowIso(), "", b.duration || 0, b.date || ""]);
      return { ok: true, review_id: rid };
    }
    const b = await dbFetch("SELECT * FROM customer_bookings WHERE id=$1 AND customer_id=$2", [itemId, cid]);
    return b || { error: "Not found" };
  }

  if (request.method === "POST") {
    const body = request.body || {};
    const bid = genId(); const ref = makeRef("CBK");
    const hotel = await dbFetch("SELECT * FROM hotels WHERE id=$1", [body.hotel_id || ""]);
    let amount = body.amount || 0;
    if (!amount && hotel) { const dur = body.duration || 3; amount = dur <= 3 ? hotel.rate_3h : dur <= 6 ? hotel.rate_6h : hotel.rate_12h; }
    const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
    await dbExecute("INSERT INTO customer_bookings (id,reference,hotel_id,date,check_in,duration,guests,amount,status,otp,customer_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
      [bid, ref, body.hotel_id || "", body.date || nowIso().slice(0, 10), body.check_in || "14:00", body.duration || 3, body.guests || 1, amount, "ongoing", otp, cid]);
    return { ok: true, id: bid, reference: ref, otp };
  }

  const items = await dbFetchAll("SELECT * FROM customer_bookings WHERE customer_id=$1 ORDER BY date DESC", [cid]);
  return paginate(items, request.query);
}

async function handleCustomerLeads(request, reply) {
  const body = request.body || {}; const lid = genId();
  await dbExecute("INSERT INTO property_leads (id,property_name,contact_name,mobile,whatsapp,email,city,property_type,total_rooms,short_stay_interest,couple_friendly,source,comments,consent) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
    [lid, body.property_name || "", body.contact_name || "", body.mobile || "", body.whatsapp || "", body.email || "", body.city || "", body.property_type || "", body.total_rooms || 0, body.short_stay_interest || 0, body.couple_friendly || 0, body.source || "website", body.comments || "", body.consent || 0]);
  return { ok: true, id: lid };
}

async function customerRoutes(fastify) {
  fastify.get("/api/customer/hotels", handleCustomerHotels);
  fastify.get("/api/customer/hotels/:id", handleCustomerHotels);
  fastify.get("/api/customer/bookings", handleCustomerBookings);
  fastify.get("/api/customer/bookings/:id", handleCustomerBookings);
  fastify.post("/api/customer/bookings", handleCustomerBookings);
  fastify.post("/api/customer/bookings/:id/cancel", handleCustomerBookings);
  fastify.post("/api/customer/bookings/:id/rate", handleCustomerBookings);
  fastify.post("/api/customer/leads", handleCustomerLeads);
}

module.exports = customerRoutes;
