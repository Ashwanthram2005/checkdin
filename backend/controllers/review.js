const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const reviewService = require("../services/review");

async function getReviews(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "reviews");
    if (itemId && segments.includes("mutate") && request.method === "POST") {
      await reviewService.updateReview(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Review Updated", "Content", itemId);
      return { ok: true };
    }
    const items = await reviewService.getReviews(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function getPartnerReviews(request, reply) {
  try {
    const { requirePartner } = require("../middleware/partnerAuth");
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    const segments = request.url.split("/").filter(Boolean);
    const itemId = segments.find(s => s !== "reviews" && !["partner", "api", "reply"].includes(s) && s.length > 6);
    if (itemId && segments.includes("reply") && request.method === "POST") {
      const body = request.body || {};
      await reviewService.replyToReview(itemId, hid, body.response || "");
      return { ok: true };
    }
    const items = await reviewService.getPartnerReviews(hid);
    return { data: items, total: items.length };
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getReviews, getPartnerReviews };
