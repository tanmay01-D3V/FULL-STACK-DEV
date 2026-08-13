const Hospital = require("../Models/hospitals");
const mongodb = require("../Config/db");

const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.findAll();
        res.status(200).json({ hospitals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        res.status(200).json({ hospital });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createHospital = async (req, res) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.status(201).json({ hospital });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ hospital });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);
        res.status(200).json({ hospital });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getAllHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    deleteHospital,
};
