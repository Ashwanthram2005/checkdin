const { dbFetch } = require("../lib/db");
const { createToken } = require("../lib/auth");
const { hashPassword } = require("../lib/utils");
const adminModel = require("../models/admin");
const customerModel = require("../models/customer");
const partnerModel = require("../models/partner");

async function loginAdmin(email, password) {
  if (!email || !password) throw { status: 400, message: "Email and password required" };
  const user = await adminModel.findByEmail(email.trim());
  if (!user || hashPassword(password) !== user.password_hash) throw { status: 401, message: "Invalid credentials" };
  if (user.status !== "Active") throw { status: 403, message: "Account disabled" };
  const token = createToken(user.id, "admin", user.role || "admin");
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, role_name: user.role_name } };
}

async function loginCustomer(body) {
  let email = (body.email || body.phone || "").trim();
  const phone = (body.phone || "").trim();
  const name = (body.name || "Guest").trim();
  if (!email) throw { status: 400, message: "Email or phone required" };
  const phoneVal = phone || email;
  let user = await customerModel.findByEmailOrPhone(email, phoneVal);
  if (!user) {
    const id = await customerModel.create({ name, email, phone: phoneVal, city: body.city || "" });
    user = await customerModel.findById(id);
  }
  const token = createToken(user.id, "customer");
  return { token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } };
}

async function loginPartner(body) {
  const hotelId = (body.hotelId || body.hotel_id || "").trim();
  const userId = (body.userId || body.user_id || "").trim();
  const userPassword = (body.userPassword || body.user_password || "").trim();
  if (hotelId && !userId) {
    const users = await partnerModel.findUsersByHotel(hotelId);
    return { step: 2, users };
  }
  if (!userId || !userPassword) throw { status: 400, message: "userId and userPassword required" };
  const user = await partnerModel.findUserByHotelAndId(hotelId, userId);
  if (!user) throw { status: 401, message: "User not found" };
  if (hashPassword(userPassword) !== user.password_hash) throw { status: 401, message: "Invalid password" };
  if (!user.active) throw { status: 403, message: "Account disabled" };
  await partnerModel.updateLastLogin(userId);
  const token = createToken(userId, "partner", user.role_id || "manager");
  return { token, user: { id: user.id, name: user.name, role_id: user.role_id, hotel_id: user.hotel_id } };
}

async function getMe(userId, userType) {
  let row;
  if (userType === "admin") row = await adminModel.findById(userId);
  else if (userType === "customer") row = await customerModel.findById(userId);
  else if (userType === "partner") row = await dbFetch("SELECT id,name,hotel_id,role_id FROM partner_users WHERE id=$1", [userId]);
  if (!row) throw { status: 400, message: "User not found" };
  return row;
}

async function updateProfile(userId, fields) {
  const allowed = ["name", "email", "phone", "city", "gender", "emergency_name", "emergency_phone", "emergency_relation"];
  const updateFields = {};
  for (const f of allowed) {
    if (f in fields) updateFields[f] = fields[f];
  }
  if (!Object.keys(updateFields).length) throw { status: 400, message: "No fields to update" };
  await customerModel.update(userId, updateFields);
}

module.exports = { loginAdmin, loginCustomer, loginPartner, getMe, updateProfile };
