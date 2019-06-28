import Authenticate from "../middleware/auth";
import Validator from "../middleware/validator";
const express = require("express");
const router = express.Router();
const programController = require("../../../app/controllers/program/program.controller");
const { check, body } = require("express-validator/check");
const rbac = require("../../../app/helper/rbac");
const { PERMISSIONS, RESOURCE } = require("../../../constant");

router.post(
  "/add-program",
  Authenticate,
  [
    check("name")
      .not()
      .isEmpty()
      .isString(),
    check("pharmaCo")
      .not()
      .isEmpty()
      .isString(),
    check("targetLocation.city")
      .not()
      .isEmpty()
      .isMongoId(),
    check("targetLocation.country")
      .not()
      .isEmpty()
      .isMongoId(),
    check("description")
      .optional()
      .isString(),
    check("activeFrom").isAfter(),
    body("activeFrom").custom((value, { req }) => {
      if (new Date(value) >= new Date(req.body.expiresOn)) {
        throw new Error("Program can't expire before it started");
      } else {
        return true;
      }
    }),
    check("expiresOn").isAfter(),
    check("products").isArray(),
    body("products.*").isMongoId(),
    check("doctors").isArray(),
    body("doctors.*").isMongoId(),
    check("careCoaches").isArray(),
    body("careCoaches.*").isMongoId(),
    check("accessLevel").isString()
  ],
  programController.addProgram
);

router.post(
  "/add-to-program",
  Authenticate,
  [
    check("programId").isMongoId(),
    check("additionType").isString(),
    check("objectsToAdd").isArray(),
    body("objectsToAdd.*").isMongoId()
  ],
  programController.addToProgram
);

router.get(
  "/programs",
  Authenticate,
  function(req, res, next) {
    Validator(req, res, next, PERMISSIONS.VIEW, RESOURCE.PROGRAMS);
  },
  programController.getPrograms
);
router.get(
  "/program/:programId",
  Authenticate,
  programController.getProgramsById
);

//DONT REMOVE THIS, it updates users in user store rather than updating the program store.
//It's requiredd to show the list of doctors in add patient modal.
router.get("/program/:programId/doctor", programController.getProgramDoctors);

// router.get(
//   "/program/:programId/patients",
//   Authenticate,
//   programController.getProgramPatients
// );

router.get(
  "/program/:programId/:entity",
  Authenticate,
  programController.getProgramEntities
);
module.exports = router;
