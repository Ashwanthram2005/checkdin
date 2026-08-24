const { dbFetchAll, dbExecute } = require("../../lib/db");
const { genId, filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

async function handleAdminCampaigns(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "campaigns");
  if (request.method === "POST" && !itemId) {
    const body = request.body || {}; const id = genId();
    await dbExecute("INSERT INTO campaigns (id,title,channel,audience,sent,delivered,opened,status,scheduled_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [id, body.title || "", body.channel || "Email", body.audience || "All Users", 0, 0, 0, body.status || "Draft", body.scheduled_at || null]);
    await writeAuditLog(request, "admin", "Campaign Created", "Marketing", id);
    return { ok: true, id };
  }
  if (itemId && request.method === "DELETE") {
    await dbExecute("DELETE FROM campaigns WHERE id=$1", [itemId]);
    await writeAuditLog(request, "admin", "Campaign Deleted", "Marketing", itemId);
    return { ok: true };
  }
  if (itemId && (request.method === "POST" || request.method === "PUT")) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["title", "channel", "audience", "status", "scheduled_at"]) {
      if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); }
    }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE campaigns SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Campaign Updated", "Marketing", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM campaigns ORDER BY scheduled_at DESC");
  items = filterItems(items, request.query, { status: "status", channel: "channel" });
  return paginate(items, request.query);
}

async function campaignsRoutes(fastify) {
  fastify.get("/api/admin/campaigns", handleAdminCampaigns);
  fastify.get("/api/admin/campaigns/:id", handleAdminCampaigns);
  fastify.post("/api/admin/campaigns", handleAdminCampaigns);
  fastify.put("/api/admin/campaigns/:id", handleAdminCampaigns);
  fastify.post("/api/admin/campaigns/:id", handleAdminCampaigns);
  fastify.delete("/api/admin/campaigns/:id", handleAdminCampaigns);
}

module.exports = campaignsRoutes;
