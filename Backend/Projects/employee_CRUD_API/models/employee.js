const supabase = require("../config/db");

function usernameFromEmail(email) {
  if (!email) return null;
  return email.split("@")[0].toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

function withUsername(employee) {
  return {
    ...employee,
    username: employee.username || usernameFromEmail(employee.email),
  };
}

class Employee {
  static async findAll() {
    const { data, error } = await supabase.from("employee").select("*");
    if (error) {
      throw new Error("Something went wrong while fetching employees");
    }
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from("employee")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw new Error("Something went wrong while fetching employee");
    }
    return data;
  }

  static async create(employee) {
    const { data, error } = await supabase
      .from("employee")
      .insert(withUsername(employee))
      .select("*")
      .single();
    if (error) {
      throw new Error("Something went wrong while creating employee");
    }
    return data;
  }

  static async findByIdAndUpdate(id, employee) {
    const { data, error } = await supabase
      .from("employee")
      .update(withUsername(employee))
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      throw new Error("Something went wrong while updating employee");
    }
    return data;
  }

  static async findByIdAndDelete(id) {
    const { data, error } = await supabase
      .from("employee")
      .delete()
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      throw new Error("Something went wrong while deleting employee");
    }
    return data;
  }
}

module.exports = Employee;
