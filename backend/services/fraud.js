const fraudModel = require("../models/fraudAlert");

async function getFraudAlerts(filters) {
  return fraudModel.findAll(filters);
}

async function mutateFraudAlert(id, action) {
  if (action) {
    await fraudModel.updateStatus(id, action.charAt(0).toUpperCase() + action.slice(1));
  }
}

module.exports = { getFraudAlerts, mutateFraudAlert };
