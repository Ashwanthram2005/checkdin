const { authFromRequest } = require("../lib/auth");

async function adminAuth(request, reply) {
  const info = authFromRequest(request);
  if (!info || info.user_type !== "admin") return reply.code(403).send({ error: "Admin access required" });
  request.user_info = info;
}

module.exports = adminAuth;
