const { dbFetch, dbFetchAll, dbExecute } = require("../lib/db");
const { createToken, authFromRequest } = require("../lib/auth");
const { genId, nowIso, hashPassword } = require("../lib/utils");

async function handleAuthLoginAdmin(request, reply) {
  const { email = "", password = "" } = request.body || {};
  const trimmedEmail = email.trim();
  if (!trimmedEmail || !password) return reply.code(400).send({ error: "Email and password required" });
  const user = await dbFetch("SELECT * FROM admin_users WHERE email=$1", [trimmedEmail]);
  if (!user || hashPassword(password) !== user.password_hash) return reply.code(401).send({ error: "Invalid credentials" });
  if (user.status !== "Active") return reply.code(403).send({ error: "Account disabled" });
  const token = createToken(user.id, "admin", user.role || "admin");
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, role_name: user.role_name } };
}

async function handleAuthLoginCustomer(request, reply) {
  const body = request.body || {};
  let email = (body.email || body.phone || "").trim();
  const phone = (body.phone || "").trim();
  const name = (body.name || "Guest").trim();
  if (!email) return reply.code(400).send({ error: "Email or phone required" });
  const phoneVal = phone || email;
  let user = await dbFetch("SELECT * FROM customers WHERE email=$1 OR phone=$2", [email, phoneVal]);
  if (!user) {
    const cid = genId();
    await dbExecute("INSERT INTO customers (id,name,email,phone,city,joined_at,status) VALUES ($1,$2,$3,$4,$5,$6,$7)",
      [cid, name, email, phoneVal, body.city || "", nowIso(), "Active"]);
    user = await dbFetch("SELECT * FROM customers WHERE id=$1", [cid]);
  }
  const token = createToken(user.id, "customer");
  return { token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } };
}

async function handleAuthLoginPartner(request, reply) {
  const body = request.body || {};
  const hotelId = (body.hotelId || body.hotel_id || "").trim();
  const userId = (body.userId || body.user_id || "").trim();
  const userPassword = (body.userPassword || body.user_password || "").trim();
  if (hotelId && !userId) {
    const users = await dbFetchAll("SELECT id,name,role_id,active FROM partner_users WHERE hotel_id=$1 AND active=1", [hotelId]);
    return { step: 2, users };
  }
  if (!userId || !userPassword) return reply.code(400).send({ error: "userId and userPassword required" });
  const user = await dbFetch("SELECT * FROM partner_users WHERE id=$1 AND hotel_id=$2", [userId, hotelId]);
  if (!user) return reply.code(401).send({ error: "User not found" });
  if (hashPassword(userPassword) !== user.password_hash) return reply.code(401).send({ error: "Invalid password" });
  if (!user.active) return reply.code(403).send({ error: "Account disabled" });
  await dbExecute("UPDATE partner_users SET last_login=$1 WHERE id=$2", [nowIso(), userId]);
  const token = createToken(userId, "partner", user.role_id || "manager");
  return { token, user: { id: user.id, name: user.name, role_id: user.role_id, hotel_id: user.hotel_id } };
}

async function handleAuthMe(request, reply) {
  const info = authFromRequest(request);
  if (!info) return reply.code(401).send({ error: "Auth required" });
  const { user_id: uid, user_type: utype } = info;
  let row;
  if (utype === "admin") row = await dbFetch("SELECT id,name,email,role,role_name FROM admin_users WHERE id=$1", [uid]);
  else if (utype === "customer") row = await dbFetch("SELECT id,name,email,phone,city FROM customers WHERE id=$1", [uid]);
  else if (utype === "partner") row = await dbFetch("SELECT id,name,hotel_id,role_id FROM partner_users WHERE id=$1", [uid]);
  else return reply.code(400).send({ error: "Unknown user type" });
  return row || { error: "User not found" };
}

async function handleAuthProfile(request, reply) {
  const info = authFromRequest(request);
  if (!info) return reply.code(401).send({ error: "Auth required" });
  if (info.user_type !== "customer") return reply.code(403).send({ error: "Customers only" });
  const body = request.body || {};
  const fields = [], vals = [];
  for (const f of ["name", "email", "phone", "city", "gender", "emergency_name", "emergency_phone", "emergency_relation"]) {
    if (f in body) { fields.push(`${f}=$${fields.length + 1}`); vals.push(body[f]); }
  }
  if (!fields.length) return reply.code(400).send({ error: "No fields to update" });
  vals.push(info.user_id);
  await dbExecute(`UPDATE customers SET ${fields.join(",")} WHERE id=$${vals.length}`, vals);
  return { ok: true };
}

async function authRoutes(fastify) {
  fastify.post("/api/auth/login/admin", handleAuthLoginAdmin);
  fastify.post("/api/auth/login/customer", handleAuthLoginCustomer);
  fastify.post("/api/auth/login/partner", handleAuthLoginPartner);
  fastify.get("/api/auth/me", handleAuthMe);
  fastify.put("/api/auth/profile", handleAuthProfile);
}

module.exports = authRoutes;
