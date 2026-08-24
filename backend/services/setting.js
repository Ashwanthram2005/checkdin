const settingModel = require("../models/setting");

async function getSettings() {
  return settingModel.getDefaults();
}

async function updateSettings(data) {
  for (const [key, value] of Object.entries(data)) {
    await settingModel.upsert(key, value);
  }
}

module.exports = { getSettings, updateSettings };
