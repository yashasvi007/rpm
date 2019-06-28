const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
const medicalConditionController = require("../../../app/controllers/medicalCondition/medicalCondition.Controller");
import * as validator from "./validator";

router.post(
  "/medicalCondition/:id/basicCondition",
  Authenticate,
  validator.validateBasicConditionFormData,
  medicalConditionController.editBasicCondition
);

router.post(
  "/medicalCondition/:id/vital",
  Authenticate,
  validator.validateVitalFormData,
  medicalConditionController.addVital
);

router.post(
  "/medicalCondition/:id/clinicalReading",
  Authenticate,
  medicalConditionController.updateClinicalReading
);

module.exports = router;
