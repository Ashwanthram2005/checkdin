const crypto = require("crypto");

function genId() { return crypto.randomBytes(6).toString("hex"); }
function nowIso() { return new Date().toISOString().replace(/\.\d{3}Z$/, ""); }
function hashPassword(pw) { return crypto.createHash("sha256").update(pw).digest("hex"); }
function makeRef(prefix = "REF") { return `${prefix}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`; }
function num(v) { return Number(v) || 0; }

function paginate(items, query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  let limit = parseInt(query.limit, 10) || 20;
  if (limit <= 0) limit = 20;
  const offset = (page - 1) * limit;
  const total = items.length;
  return { data: items.slice(offset, offset + limit), total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}

function filterItems(items, query, fieldMap) {
  let result = items;
  for (const [qpKey, col] of Object.entries(fieldMap)) {
    const val = query[qpKey];
    if (val) {
      const valLower = val.toLowerCase();
      result = result.filter(r => String(r[col] ?? "").toLowerCase().includes(valLower));
    }
  }
  return result;
}

function getIdFromSegments(segments, after) {
  const idx = segments.indexOf(after);
  return (idx !== -1 && idx + 1 < segments.length) ? segments[idx + 1] : null;
}

module.exports = { genId, nowIso, hashPassword, makeRef, num, paginate, filterItems, getIdFromSegments };
