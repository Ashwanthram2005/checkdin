const adminUserModel = require("../models/admin");

async function getAdminUsers(filters) {
  return adminUserModel.findAll(filters);
}

async function createAdminUser(data) {
  if (!data.name || !data.email) throw { status: 400, message: "Name and email required" };
  const existing = await adminUserModel.findByEmail(data.email.trim());
  if (existing) throw { status: 409, message: "Email already exists" };
  return adminUserModel.create({
    name: data.name.trim(),
    email: data.email.trim(),
    password: data.password || "ChangeMe@123",
    role: data.role || "support",
    role_name: data.role_name || data.roleName || "Support Admin",
    status: data.status || "Active",
  });
}

async function updateAdminUser(id, fields) {
  await adminUserModel.update(id, fields);
}

async function deleteAdminUser(id) {
  await adminUserModel.remove(id);
}

module.exports = { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser };
