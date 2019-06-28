const express = require("express");
const router = express.Router();
const insuranceController = require("../../../app/controllers/insurance/insuranceController");

// router.post(
//   "/add-insurance",
//   [
//     check("name")
//       .not()
//       .isEmpty()
//       .isString(),
//     check("isActive").isBool()
//   ],
//   insuranceController.addInsuranceProvider
// );

router.get(
  "/insurance-providers",
  insuranceController.getAllInsuranceProviders
);

module.exports = router;
