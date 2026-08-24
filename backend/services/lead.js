const leadModel = require("../models/lead");

async function createLead(data) {
  return leadModel.create(data);
}

module.exports = { createLead };
