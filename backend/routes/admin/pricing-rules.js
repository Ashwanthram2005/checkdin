const { dbFetchAll, dbExecute } = require("../../lib/db");
const { genId, nowIso, filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

async function handleAdminPricingRules(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "pricing-rules");
  if (request.method === "POST" && !itemId) {
    const body = request.body || {}; const id = genId();
    await dbExecute("INSERT INTO pricing_rules (id,name,scope,trigger,adjustment,channel,status,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [id, body.name || "", body.scope || "All", body.trigger || "", body.adjustment || "0%", body.channel || "All", body.status || "Active", nowIso()]);
    await writeAuditLog(request, "admin", "Pricing Rule Created", "Pricing", id);
    return { ok: true, id };
  }
  if (itemId && request.method === "DELETE") {
    await dbExecute("DELETE FROM pricing_rules WHERE id=$1", [itemId]);
    await writeAuditLog(request, "admin", "Pricing Rule Deleted", "Pricing", itemId);
    return { ok: true };
  }
  if (itemId && (request.method === "POST" || request.method === "PUT")) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["name", "scope", "trigger", "adjustment", "channel", "status"]) {
      if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); }
    }
    fields.push(`updated_at=$${fields.length + 1}`); vals.push(nowIso());
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE pricing_rules SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Pricing Rule Updated", "Pricing", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT * FROM pricing_rules ORDER BY updated_at DESC");
  items = filterItems(items, request.query, { status: "status", scope: "scope" });
  return paginate(items, request.query);
}

async function pricingRulesRoutes(fastify) {
  fastify.get("/api/admin/pricing-rules", handleAdminPricingRules);
  fastify.get("/api/admin/pricing-rules/:id", handleAdminPricingRules);
  fastify.post("/api/admin/pricing-rules", handleAdminPricingRules);
  fastify.put("/api/admin/pricing-rules/:id", handleAdminPricingRules);
  fastify.post("/api/admin/pricing-rules/:id", handleAdminPricingRules);
  fastify.delete("/api/admin/pricing-rules/:id", handleAdminPricingRules);
}

module.exports = pricingRulesRoutes;
