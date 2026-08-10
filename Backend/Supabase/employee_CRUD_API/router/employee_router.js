const express = require("express");
const router = express.Router();
const Employee = require("../models/employee");

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found, please check the id" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password, department, role, salary } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name field is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email field is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password field is required" });
    }
    if (!department) {
      return res.status(400).json({ message: "Department field is required" });
    }
    if (!role) {
      return res.status(400).json({ message: "Role field is required" });
    }
    if (!salary) {
      return res.status(400).json({ message: "Salary field is required" });
    }
    const employee = await Employee.create(req.body);
    res
      .status(201)
      .json({ message: "Employee created successfully", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, password, department, role, salary } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name field is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email field is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password field is required" });
    }
    if (!department) {
      return res.status(400).json({ message: "Department field is required" });
    }
    if (!role) {
      return res.status(400).json({ message: "Role field is required" });
    }
    if (!salary) {
      return res.status(400).json({ message: "Salary field is required" });
    }
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body);
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found, please check the id" });
    }
    res
      .status(200)
      .json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Employee not found, please check the id" });
    }
    res
      .status(200)
      .json({ message: "Employee deleted successfully", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
