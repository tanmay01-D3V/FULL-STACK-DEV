const supabase = require("../config/db");
const bcrypt = require("bcryptjs");

const TABLE = "users";

async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function createUser({ name, email, password, role = "customer" }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    const err = new Error("Email already registered");
    err.status = 409;
    throw err;
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ name, email, password_hash, role })
    .select("id, name, email, role, created_at")
    .single();

  if (error) throw error;
  return data;
}

async function verifyCredentials(email, password) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

module.exports = { findUserByEmail, createUser, verifyCredentials };
