const express = require('express');
const Employee = require('../models/Employees');

const router = express.Router();

router.get('/',async(req,res)=>{
    try{
        const employees = await Employee.find();
        res.status(200).json(employees);
    }
    catch (error){
        res.status(500).json({message: error.message});
    }
});

router.get('/:id', async (req,res) => {
    try{
        const employee = await Employee.findById(req.params.id);   
        if(!employee){
            return res.status(404).json({message: "Employee Not Found!!!"});
        } 
        res.status(200).json(employee);
    } catch (error){
        res.status(500).json({message: error.message});
    }
});

router.post('/', async (req,res) => {
    try {
        const employee = await Employee.create(req.body);    
        res.status(201).json({message: "Employee Created Successfully!!!",employee});
    } catch (error){
        res.status(500).json({message: error.message});
    }
});

router.put('/:id', async (req,res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body);
        if(!employee){
            return res.status(404).json({message: "Employee Not Found!!!"});
        } 
        res.status(200).json({message:"Employee Updated Successfully!!!", employee});
    } catch (error){
        res.status(500).json({message: error.message});
    }
});

router.delete('/:id', async (req,res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if(!employee){
            return res.status(404).json({message: "Employee Not Found!!!"});
        } 
        res.status(200).json({message:"Employee Deleted Successfully!!!", employee});
    } catch (error){
        res.status(500).json({message: error.message});
    }
});


module.exports = router;