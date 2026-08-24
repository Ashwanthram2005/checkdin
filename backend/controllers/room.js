const { paginate, getIdFromSegments } = require("../lib/utils");
const { writeAuditLog } = require("../lib/audit");
const roomService = require("../services/room");

async function getRooms(request, reply) {
  try {
    const segments = request.url.split("/").filter(Boolean);
    const itemId = getIdFromSegments(segments, "rooms");
    if (request.method === "POST" && segments.includes("mutate") && itemId) {
      await roomService.updateRoom(itemId, request.body || {});
      await writeAuditLog(request, "admin", "Room Updated", "Room", itemId);
      return { ok: true };
    }
    if (request.method === "POST" && !itemId) {
      const id = await roomService.createRoom(request.body || {});
      await writeAuditLog(request, "admin", "Room Created", "Room", id);
      return { ok: true, id };
    }
    const items = await roomService.getRooms(request.query);
    return paginate(items, request.query);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function getPartnerRooms(request, reply) {
  try {
    const { requirePartner } = require("../middleware/partnerAuth");
    const hid = await requirePartner(request, reply);
    if (!hid) return reply.sent;
    if (request.method === "PUT") {
      const body = request.body || {};
      if (body.id) await roomService.updatePartnerRoom(body.id, hid, body);
      return { ok: true };
    }
    const items = await roomService.getPartnerRooms(hid);
    return { data: items, total: items.length };
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { getRooms, getPartnerRooms };
