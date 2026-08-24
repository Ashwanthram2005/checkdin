const crypto = require("crypto");

const SECRET = process.env.SECRET || "checkdin-secret-key-change-in-production";
const TOKEN_TTL = 86400 * 7;

function createToken(userId, userType, role = "user") {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL;
  const payload = `${userId}|${userType}|${role}|${exp}`;
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(payloadB64).digest("hex");
  return `${payloadB64}.${sig}`;
}

function verifyToken(token) {
  try {
    const [payloadB64, sig] = token.split(".", 2);
    if (!payloadB64 || !sig) return null;
    const expected = crypto.createHmac("sha256", SECRET).update(payloadB64).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
    const payload = Buffer.from(payloadB64, "base64url").toString();
    const [uid, utype, role, exp] = payload.split("|", 4);
    if (parseInt(exp, 10) < Math.floor(Date.now() / 1000)) return null;
    return { user_id: uid, user_type: utype, role };
  } catch { return null; }
}

function authFromRequest(request) {
  const auth = request.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return verifyToken(auth.slice(7));
  return null;
}

module.exports = { createToken, verifyToken, authFromRequest };
