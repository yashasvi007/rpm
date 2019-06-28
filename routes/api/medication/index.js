const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
const medicationController = require("../../../app/controllers/medication/medication.controller");
import * as validator from "./validator";

router.post(
  "/medication",
  Authenticate,
  validator.validateMedicationFormData,
  medicationController.addMedication
);
router.delete("/medication", Authenticate, medicationController.removeMedicine);

module.exports = router;
