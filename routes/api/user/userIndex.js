const express = require("express");
const router = express.Router();
const userController = require("../../../app/controllers/user/user.controller");
const surveyController = require("../../../app/controllers/survey/survey.controller");
const authenticate = require("../../../app/controllers/auth/auth.controller");
const handleError = require("../../../app/controllers/helper/handleError");
const multer = require("multer");
const { check, body } = require("express-validator/check");
const countryCodes = require("country-data").callingCodes;
const countries = require("country-data").countries;
import Authenticate from "../middleware/auth";

var storage = multer.memoryStorage();
var upload = multer({ dest: "../app/public/", storage: storage });

const PASSWORD_LENGTH = 6;
const STRING = "string";
const BOOLEAN = "boolean";

function checkType(value, type) {
  if (typeof value == type || value == null) return true;
  else throw new Error("Invalid Value");
}

router.post(
  "/sign-up/",
  [
    check("password")
      .isLength({ min: PASSWORD_LENGTH })
      .withMessage(`must be at least ${PASSWORD_LENGTH} characters long`),
    body("password").custom((value, { req }) => {
      if (req.body.confirmPassword != value) {
        throw new Error("Passwords do not match");
      } else {
        return true;
      }
    }),
    check("confirmPassword")
      .not()
      .isEmpty(),
    check("link").isUUID()
  ],
  userController.signUp
);

router.post(
  "/sign-in",
  [
    check("email")
      .isEmail()
      .withMessage("email is not valid"),
    check("password").isLength({ min: PASSWORD_LENGTH })
  ],
  userController.signIn
);

router.post("/sign-out", authenticate, userController.signOut);

router.get(
  "/accept-invite/:link",
  [check("link").isUUID()],
  userController.acceptInvite
);

//attach rbac middleware here
router.post(
  "/edit-profile",
  Authenticate,
  [
    (body("name")
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        return checkType(value, STRING);
      }),
    body("contactNo.countryCode")
      .optional()
      .custom((value, { req }) => {
        if (value == null) return true;
        if (countryCodes.all.indexOf(value) == -1) {
          throw new Error("Invalid Country code");
        } else {
          return true;
        }
      }),
    body("contactNo.phoneNumber")
      .optional()
      .custom((value, { req }) => {
        if (checkType(value, STRING)) {
          if (
            req.body.contactNo.countryCode == null ||
            req.body.contactNo.countryCode == undefined ||
            req.body.contactNo.countryCode == ""
          ) {
            throw new Error("Enter Full Phone Number");
          } else {
            return true;
          }
        }
      }),
    check("dob")
      .optional()
      .isBefore(),
    check("gender")
      .optional()
      .isAlpha(),
    body("contacts.relatives.name")
      .optional()
      .custom((value, { req }) => {
        if (checkType(value, STRING)) {
          if (
            (value == null || value == "" || value == undefined) &&
            !(
              req.body.contacts.relatives.contactNo == null ||
              req.body.contacts.relatives.contactNo == "" ||
              req.body.contacts.relatives.contactNo == undefined
            )
          ) {
            throw new Error("Needed name of the contact");
          } else {
            return true;
          }
        }
      }),
    body("contacts.relatives.contactNo.countryCode")
      .optional()
      .custom((value, { req }) => {
        if (checkType(value, STRING)) {
          if (countryCodes.all.indexOf(value) == -1) {
            throw new Error("Invalid Country code");
          } else {
            return true;
          }
        }
      }),
    body("contacts.relatives.contactNo.phoneNumber")
      .optional()
      .custom((value, { req }) => {
        if (checkType(value, STRING)) {
          if (
            (value == null || value == "" || value == undefined) &&
            !(
              req.body.contacts.relatives.name == null ||
              req.body.contacts.relatives.name == "" ||
              req.body.contacts.relatives.name == undefined
            )
          ) {
            throw new Error("Needed contact");
          } else {
            return true;
          }
        }
      }),
    check("contacts.emergencyContact.isEmergencyContactSet")
      .optional()
      .isBoolean(),
    body("contacts.emergencyContact.name")
      .optional()
      .custom((value, { req }) => {
        if (checkType(value, STRING)) {
          if (
            (value == null || value == "" || value == undefined) &&
            !(
              req.body.contacts.emergencyContact.contactNo == null ||
              req.body.contacts.emergencyContact.contactNo == "" ||
              req.body.contacts.emergencyContact.contactNo == undefined
            )
          ) {
            throw new Error("Needed name of the contact");
          } else {
            return true;
          }
        }
      }),
    body("contacts.emergencyContact.contactNo.countryCode")
      .optional()
      .custom((value, { req }) => {
        if (checkType(value, STRING)) {
          if (countryCodes.all.indexOf(value) == -1) {
            throw new Error("Invalid Country code");
          } else {
            return true;
          }
        }
      }),
    body("contacts.emergencyContact.contactNo.phoneNumber")
      .optional()
      .custom((value, { req }) => {
        if (checkType(value, STRING)) {
          if (
            (value == null || value == "" || value == undefined) &&
            !(
              req.body.contacts.emergencyContact.name == null ||
              req.body.contacts.emergencyContact.name == "" ||
              req.body.contacts.emergencyContact.name == undefined
            )
          ) {
            throw new Error("Needed contact");
          } else {
            return true;
          }
        }
      }),
    body("medicalCondition.basicCondition.chiefComplaint")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, STRING);
      }),
    body("medicalCondition.basicCondition.allergies")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, STRING);
      }),
    body("medicalCondition.basicCondition.surgeriesOrFracture")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, STRING);
      }),
    body("medicalCondition.basicCondition.others")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, STRING);
      }),
    body("medicalCondition.vitals.temperatureUnit")
      .optional()
      .isAlpha(),
    body("medicalCondition.vitals.temperature")
      .optional()
      .custom((value, { req }) => {
        if (value === null || value === undefined || value.length === 0)
          return true;
        else if (value == parseInt(value, 10)) return true;
        else {
          throw new Error("Invalid Value");
        }
      }),
    body("medicalCondition.vitals.respirationRate")
      .optional()
      .custom((value, { req }) => {
        if (value === null || value === undefined || value.length === 0)
          return true;
        else if (value == parseInt(value, 10)) return true;
        else throw new Error("Invalid Value");
      }),
    body("medicalCondition.vitals.pulse")
      .optional()
      .custom((value, { req }) => {
        if (value === null || value === undefined || value.length === 0)
          return true;
        else if (value == parseInt(value, 10)) return true;
        else throw new Error("Invalid Value");
      }),
    body("homeAddress.addressLine1")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, STRING);
      }),
    body("homeAddress.addressLine2")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, STRING);
      }),
    body("homeAddress.zipCode")
      .optional()
      .custom((value, { req }) => {
        if (value === null || value === undefined || value.length >= 0)
          return true;
        // else if (value == parseInt(value, 10)) {
        //
        //   return true;
        // }
        else throw new Error("Invalid1 Value");
      }),
    body("homeAddress.city").isMongoId(),
    body("homeAddress.country").isMongoId(),
    body("work.officeAddress.addressLine1")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, STRING);
      }),
    body("work.officeAddress.addressLine2")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, STRING);
      }),
    body("work.officeAddress.zipCode")
      .optional()
      .custom((value, { req }) => {
        if (value === null || value === undefined || value.length >= 0)
          return true;
        // else if (value == parseInt(value, 10)) return true;
        else throw new Error("Invalid Value");
      }),
    body("work.officeAddress.city")
      .optional()
      .isMongoId(),
    body("work.officeAddress.country")
      .optional()
      .isMongoId(),
    body("work.licenseNumber")
      .optional()
      .custom((value, { req }) => {
        if (value == null) return true;
        if (value.match(/^[0-9a-zA-Z]+$/)) {
          return true;
        } else {
          throw new Error("Invalid Value");
        }
      }),
    body("work.services")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, STRING);
      }),
    body("services.medicalServices")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("services.homeHealthCare.nursing")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("services.homeHealthCare.physicalTherapy")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("services.homeHealthCare.speechPathology")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("services.homeHealthCare.medicalCounselling")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("services.homeHealthCare.healthAide")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("services.specialCare.cardiacCare")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("services.specialCare.diabetesCare")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("services.specialCare.smokingCessation")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("services.nonMedicalCare.respiteCare")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("services.nonMedicalCare.homemaking")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("settings.isCalendarSynced")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("settings.preferences.emailAlerts")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("settings.preferences.pushAlerts")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("settings.preferences.reminderAlerts")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }),
    body("settings.preferences.smsAlerts")
      .optional()
      .custom((value, { req }) => {
        return checkType(value, BOOLEAN);
      }))
  ],
  userController.editProfile
);

router.get("/myprofile", userController.getProfile);

router.post(
  "/forgot-password",
  [
    check("email")
      .isEmail()
      .not()
      .isEmpty()
  ],
  userController.forgotPassword
);

router.post(
  "/change-forgotten-password",
  [
    check("password").isLength({ min: PASSWORD_LENGTH }),
    check("confirmPassword").isLength({ min: PASSWORD_LENGTH }),
    body("password").custom((value, { req }) => {
      if (req.body.confirmPassword != value) {
        throw new Error("Passwords do not match");
      } else {
        return true;
      }
    }),
    check("link").isUUID()
  ],
  userController.changeForgottenPassword
);

//attach rbac permissions
router.post(
  "/send-otp",
  Authenticate,
  [
    body("contactNo.countryCode")
      .exists()
      .custom((value, { req }) => {
        if (value == null) return true;
        if (countryCodes.all.indexOf(value) == -1) {
          throw new Error("Invalid Country code");
        } else {
          return true;
        }
      }),
    check("contactNo.phoneNumber").isNumeric()
  ],
  userController.sendOTP
);
//attach rbac permissions
router.post(
  "/verify-otp",
  Authenticate,
  [check("otp").isNumeric()],
  userController.verifyOTP
);

//attach rbac permissions
router.post(
  "/upload-profile-pic",
  Authenticate,
  upload.single("profile-pic"),
  userController.uploadProfilePic
);

router.post(
  "/change-password",
  [
    check("currentPassword")
      .not()
      .isEmpty(),
    check("newPassword")
      .isLength({ min: PASSWORD_LENGTH })
      .withMessage(`must be at least ${PASSWORD_LENGTH} characters long`),
    body("newPassword").custom((value, { req }) => {
      if (req.body.confirmPassword != value) {
        throw new Error("Passwords do not match");
      } else {
        return true;
      }
    }),
    check("confirmPassword")
      .not()
      .isEmpty()
  ],
  userController.changePassword
);

router.get(
  "/get-basic-info",
  Authenticate,
  userController.onAppStart,
  handleError
);

router.post(
  "/assign-to-patient",
  [
    check("careCoach").isMongoId(),
    check("patients").isArray(),
    body("patients.*").isMongoId()
  ],
  userController.assignCareCoachToPatient
);
router.post(
  "/assign-to-carecoach",
  [check("careCoach").isMongoId(), check("patient").isMongoId()],
  userController.assignPatientsToCareCoach
);
router.post(
  "/add-new-user",
  [check("email").isEmail(), check("category").isString()],
  userController.addNewUser
);

router.post(
  "/upload-consent-form",
  Authenticate,
  upload.single("files"),
  userController.saveConsentForm
);

router.post(
  "/upload-id-proof",
  Authenticate,
  upload.single("files"),
  userController.saveIdProof
);

router.get("/members", Authenticate, userController.getRelatedMembers);
router.post("/getUserPrograms", Authenticate, userController.getUserProgram);

router.get("/user/:id", Authenticate, userController.getUserById);

router.post(
  "/patients/discharge",
  Authenticate,
  userController.dischargePatient
);

router.get(
  "/patients/:id/clinical-readings",
  Authenticate,
  userController.getClinicalData
);
router.post(
  "/users/:id/documents-verify",
  [
    check("data")
      .not()
      .isEmpty()
  ],
  Authenticate,
  userController.verifyDocuments
);

router.post(
  "/upload",
  Authenticate,
  upload.single("files"),
  userController.uploadDoc
);

router.post(
  "/users/:id/reupload-idproofs",
  [
    check("data")
      .not()
      .isEmpty()
  ],
  Authenticate,
  userController.reUploadIdProofs
);

router.post(
  "/users/:id/reupload-consentdocs",
  [
    check("data")
      .not()
      .isEmpty()
  ],
  Authenticate,
  userController.reUploadConsentDocs
);

router.get("/patients/:id/vitals", Authenticate, userController.getVitals);

router.get(
  "/patients/:id/medication",
  Authenticate,
  userController.getMedication
);

router.get(
  "/patients/:id/medication/recent",
  Authenticate,
  userController.getRecentMedication
);
router.get("/users/surveys", Authenticate, surveyController.getCareCoachSurvey);

// import test from "../../../app/helper/isAllowedTo";

// // test route
// router.post(
//   "/test/:id",
//   test(req, res, { actor: "careCoach", resource: "program", action: "add" }),
//   userController.test
// );

module.exports = router;
