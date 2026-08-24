const customerModel = require("../models/customer");

async function getCustomers(filters) {
  return customerModel.findAll(filters);
}

async function getCustomerById(id) {
  return customerModel.findById(id);
}

async function updateCustomer(id, fields) {
  const allowed = ["name", "email", "phone", "city", "status"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (Object.keys(updateFields).length) {
    await customerModel.update(id, updateFields);
  }
}

module.exports = { getCustomers, getCustomerById, updateCustomer };
