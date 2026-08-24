const { dbFetch, dbFetchAll, dbExecute } = require("../../lib/db");
const { genId, nowIso, hashPassword, filterItems, paginate, getIdFromSegments } = require("../../lib/utils");
const { writeAuditLog } = require("../../lib/audit");

async function handleAdminAdminUsers(request, reply) {
  const segments = request.url.split("/").filter(Boolean);
  const itemId = getIdFromSegments(segments, "admin-users");
  if (request.method === "POST" && !itemId) {
    const body = request.body || {}; const id = genId();
    const name = (body.name || "").trim(); const email = (body.email || "").trim();
    const role = body.role || "support"; const roleName = body.role_name || body.roleName || "Support Admin";
    const password = body.password || "ChangeMe@123";
    if (!name || !email) return reply.code(400).send({ error: "Name and email required" });
    const existing = await dbFetch("SELECT id FROM admin_users WHERE email=$1", [email]);
    if (existing) return reply.code(409).send({ error: "Email already exists" });
    await dbExecute("INSERT INTO admin_users (id,name,email,password_hash,role,role_name,status,two_factor,last_active,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
      [id, name, email, hashPassword(password), role, roleName, body.status || "Active", 0, null, nowIso()]);
    await writeAuditLog(request, "admin", "Admin User Created", "Admin", id);
    return { ok: true, id };
  }
  if (itemId && request.method === "DELETE") {
    await dbExecute("DELETE FROM admin_users WHERE id=$1", [itemId]);
    await writeAuditLog(request, "admin", "Admin User Deleted", "Admin", itemId);
    return { ok: true };
  }
  if (itemId && (request.method === "POST" || request.method === "PUT")) {
    const body = request.body || {}; const fields = [], vals = [];
    for (const f of ["name", "email", "role", "role_name", "status", "two_factor"]) {
      if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); }
    }
    if ("password" in body && body.password) { fields.push(`password_hash=$${fields.length + 1}`); vals.push(hashPassword(body.password)); }
    if (fields.length) { vals.push(itemId); await dbExecute(`UPDATE admin_users SET ${fields.join(",")} WHERE id=$${vals.length}`, vals); }
    await writeAuditLog(request, "admin", "Admin User Updated", "Admin", itemId);
    return { ok: true };
  }
  let items = await dbFetchAll("SELECT id,name,email,role,role_name,status,two_factor,last_active,created_at FROM admin_users ORDER BY created_at DESC");
  items = filterItems(items, request.query, { status: "status", role: "role", name: "name" });
  return paginate(items, request.query);
}

async function adminUsersRoutes(fastify) {
  fastify.get("/api/admin/admin-users", handleAdminAdminUsers);
  fastify.get("/api/admin/admin-users/:id", handleAdminAdminUsers);
  fastify.post("/api/admin/admin-users", handleAdminAdminUsers);
  fastify.put("/api/admin/admin-users/:id", handleAdminAdminUsers);
  fastify.post("/api/admin/admin-users/:id", handleAdminAdminUsers);
  fastify.delete("/api/admin/admin-users/:id", handleAdminAdminUsers);
}

module.exports = adminUsersRoutes;
