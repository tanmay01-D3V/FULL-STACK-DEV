const express = require("express");
const router = express.Router();
const {
    getAllHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    deleteHospital,
} = require("../Controllers/hospitalscontroller");

router.get("/", getAllHospitals);
router.get("/:id", getHospitalById);
router.post("/", createHospital);
router.put("/:id", updateHospital);
router.delete("/:id", deleteHospital);

module.exports = router;
