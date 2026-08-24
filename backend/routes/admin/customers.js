const { dbFetch, dbFetchAll, dbExecute } = require("../../lib/db");
const { filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

async function handleAdminCustomers(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "customers");
  if (itemId && segments.includes("mutate") && request.method === "POST") {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["name", "email", "phone", "city", "status"]) { if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); } }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE customers SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Customer Updated", "Customer", itemId);
    return { ok: true };
  }
  if (itemId && itemId !== "mutate") { const c = await dbFetch("SELECT * FROM customers WHERE id=$1", [itemId]); return c || { error: "Not found" }; }
  let items = await dbFetchAll("SELECT * FROM customers ORDER BY joined_at DESC");
  items = filterItems(items, request.query, { city: "city", status: "status", name: "name" });
  return paginate(items, request.query);
}

async function customersRoutes(fastify) {
  fastify.get("/api/admin/customers", handleAdminCustomers);
  fastify.get("/api/admin/customers/:id", handleAdminCustomers);
  fastify.post("/api/admin/customers/:id/mutate", handleAdminCustomers);
}

module.exports = customersRoutes;
