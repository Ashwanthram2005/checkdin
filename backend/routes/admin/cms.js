const { dbFetchAll, dbExecute } = require("../../lib/db");
const { genId, nowIso, filterItems, paginate, getIdFromSegments } = require("../../lib/utils");

async function handleAdminCms(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "cms");
  if (itemId && request.method === "DELETE") {
    await dbExecute("DELETE FROM cms_content WHERE id=$1", [itemId]);
    return { ok: true };
  }
  if (itemId && (request.method === "POST" || request.method === "PUT")) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["title", "data", "status", "sort_order", "type"]) {
      if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(typeof body[f] === "object" ? JSON.stringify(body[f]) : body[f]); }
    }
    fields.push(`updated_at=$${fields.length + 1}`); vals.push(nowIso());
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE cms_content SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    return { ok: true };
  }
  if (request.method === "POST") {
    const body = request.body || {}; const id = genId();
    await dbExecute("INSERT INTO cms_content (id,type,title,data,status,sort_order,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [id, body.type || "banner", body.title || "", typeof body.data === "object" ? JSON.stringify(body.data || {}) : (body.data || "{}"), body.status || "Active", body.sort_order || 0, nowIso(), nowIso()]);
    return { ok: true, id };
  }
  const typeFilter = request.query.type;
  let items;
  if (typeFilter) items = await dbFetchAll("SELECT * FROM cms_content WHERE type=$1 ORDER BY sort_order, created_at DESC", [typeFilter]);
  else items = await dbFetchAll("SELECT * FROM cms_content ORDER BY type, sort_order, created_at DESC");
  items = filterItems(items, request.query, { status: "status", title: "title" });
  return paginate(items, request.query);
}

async function cmsRoutes(fastify) {
  fastify.get("/api/admin/cms", handleAdminCms);
  fastify.get("/api/admin/cms/:id", handleAdminCms);
  fastify.post("/api/admin/cms", handleAdminCms);
  fastify.put("/api/admin/cms/:id", handleAdminCms);
  fastify.delete("/api/admin/cms/:id", handleAdminCms);
}

module.exports = cmsRoutes;
