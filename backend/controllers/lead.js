const leadService = require("../services/lead");

async function createLead(request, reply) {
  try {
    const id = await leadService.createLead(request.body || {});
    return { ok: true, id };
  } catch (e) {
    return reply.code(500).send({ error: e.message });
  }
}

module.exports = { createLead };
