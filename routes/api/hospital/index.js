const express = require("express");
const router = express.Router();
const hospitalController = require("../../../app/controllers/hospital/hospitalController");

router.get(
  "/doctor/:doctorId/hospitals",
  hospitalController.getDoctorHospitals
);

router.get("/hospitals", hospitalController.getHospitals);

module.exports = router;
