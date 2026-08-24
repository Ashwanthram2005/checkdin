const { paginate } = require("../lib/utils");
const { authFromRequest } = require("../lib/auth");
const authService = require("../services/auth");

async function loginAdmin(request, reply) {
  try {
    const { email, password } = request.body || {};
    return await authService.loginAdmin(email, password);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function loginCustomer(request, reply) {
  try {
    return await authService.loginCustomer(request.body || {});
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function loginPartner(request, reply) {
  try {
    return await authService.loginPartner(request.body || {});
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function getMe(request, reply) {
  try {
    const info = authFromRequest(request);
    if (!info) return reply.code(401).send({ error: "Auth required" });
    return await authService.getMe(info.user_id, info.user_type);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

async function updateProfile(request, reply) {
  try {
    const info = authFromRequest(request);
    if (!info) return reply.code(401).send({ error: "Auth required" });
    if (info.user_type !== "customer") return reply.code(403).send({ error: "Customers only" });
    await authService.updateProfile(info.user_id, request.body || {});
    return { ok: true };
  } catch (e) {
    return reply.code(e.status || 500).send({ error: e.message });
  }
}

module.exports = { loginAdmin, loginCustomer, loginPartner, getMe, updateProfile };
