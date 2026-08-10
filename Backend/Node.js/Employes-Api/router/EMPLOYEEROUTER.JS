const express = require('express');
const Employee = require('../Models/Employee');
const router = express.Router();



router.get("/", async (request, response) => {
    try {
        const employees = await Employee.find({});
        response.status(200).json(employees);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.get("/:id", async (request, response) => {
    try {
        const employee = await Employee.findById(request.params.id);
        response.status(200).json(employee);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.post("/", async (request, response) => {
    try {
        const { name, email, department, role, salary } = request.body;

        if (!name || !email || !department || !role || !salary) {
            return response.status(400).json({ message: "All fields are required" });
        }

        const employee = new Employee({
            name,
            email,
            department,
            role,
            salary
        });

        await employee.save();

        response.status(201).json({
            message: "Employee created successfully",
            employee
        });

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.put("/:id", async (request, response) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true }
        );

        response.status(200).json({
            message: "Employee updated successfully",
            employee
        });

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



router.delete("/:id", async (request, response) => {
    try {
        const employee = await Employee.findByIdAndDelete(request.params.id);

        response.status(200).json({
            message: "Employee deleted successfully",
            employee
        });

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});



module.exports = router;