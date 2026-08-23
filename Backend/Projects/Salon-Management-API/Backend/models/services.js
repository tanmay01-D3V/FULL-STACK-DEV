const supabase = require("../config/db");

const TABLE = "services";

async function getAllServices() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

async function getServiceById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

async function createService({ name, description, price, duration_minutes }) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ name, description, price, duration_minutes })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateService(id, fields) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

async function deleteService(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
