const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const path = require("path");
const { check, body } = require("express-validator/check");

const cityModel = require("../app/models/city");
const {
  bookingRequestController,
  bookingSlotController,
  cityController,
  countryController,
  languageController,
  managerController,
  memberController,
  providerController,
  specialityController,
  twilioController,
  consultationController
} = require("../app/controllers/controllerIndex");
const dataValidator = require("../libs/validator");
const globalEventEmitter = require("../app/globals/globalEventEmitter");
const globalConstants = require("../app/globals/globalContants");

/********************************* city routes ************************************/

// router.get("/getCities", cityController.getCities);
router.get(
  "/getCitiesByCountry/:id",
  [check("id").isMongoId()],
  cityController.getCitiesByCountry
);
// router.post("/addCity", dataValidator.validateCityData, cityController.addCity);

/******************************** country routes ********************************************/

router.get("/getCountries", countryController.getCountries);
// router.get("/getCountryByCity/:cityId", countryController.getCountryByCity);
// router.post("/addCountry", countryController.addCountry);

/******************************** manager routes ********************************************/

router.post("/addManager", managerController.addManager);
router.post("/authenticateManager", managerController.authenticateManager);
router.post("/getManager", managerController.getManager);
router.post(
  "/getManagersBookingRequests",
  bookingRequestController.getManagersBookingRequests
);
router.post(
  "/confirmRejectBookingRequest",
  bookingRequestController.confirmRejectBookingRequestByManager
);

/************************* Provider Routes *************************************/
router.post("/addProvider", providerController.addProvider);
router.get("/getProviders", providerController.getProviders);
router.get(
  "/getProviderByCityAndSpecs/:cityid/:specid",
  providerController.getProvidersByCityAndSpecs
);
router.post(
  "/getProviderAppointmentHistory",
  providerController.getProviderAppointmentHistory
);
router.get(
  "/fetchLoggedInProvider",
  providerController.fetchProviderByAccessToken
);

/********************************* member routes *********************************************/

//Dummy members creation api below
router.post("/addMember", memberController.addMember);
//router.post("/memberLogin", memberController.authenticateMember);
//router.get("/fetchLoggedInMember", (req, res) => res.send(req.user));
router.get("/fetchLoggedInMember", memberController.fetchMemberByAccessToken);
router.post("/updateMemberConsent", memberController.updateMemberConsent);
router.get(
  "/getMemberAppointments/:memberId",
  memberController.fetchMemberAppointments
);

// router.get("/memberLoginFailed", (req, res) =>
//   res.send({
//     err: 401,
//     message: "Invalid Credential"
//   })
// );

// router.get("/memberLoginSuccessful", (req, res) => {
//   res.send("Successfully authenticated");
// });

/******************************** email routes ************************************************/
router.post("/sendEmail", async (req, res, next) => {
  try {
    let globalEventObj = globalEventEmitter.getInstance();
    globalEventObj.emit(
      globalConstants.BOOKING_REQUEST_SUBMITTED_USER,
      req.body["id"]
    );
    //
    res.send({
      error: 0,
      message: "email sent!!"
    });
  } catch (err) {}
});

/******************************* booking requests ********************************************/
router.post(
  "/createBookingRequest",
  bookingRequestController.createBookingRequest
);
router.get(
  "/getAllBookingRequests",
  bookingRequestController.getAllBookingRequests
);
router.post("/getBookingRequest", bookingRequestController.getBookingRequest);
router.post("/rejectBookingReq", bookingRequestController.rejectBookingRequest);
router.post("/uploadDocuments", bookingRequestController.uploadDocuments);

/****************************** booking slots **********************************************/

router.post("/getBookingSlots", bookingSlotController.getBookingSlots);

/******************************* speciality requests *****************************************/

router.get("/getAllSpecialities", specialityController.getAllSpecialities);
router.post("/getSpeciality", specialityController.getSpeciality);
router.post("/addSpeciality", specialityController.addSpeciality);
router.post("/updateSpeciality", specialityController.updateSpeciality);

/******************************* language requests *******************************************/

router.get("/getAllLanguages", languageController.getAllLanguages);
router.post("/getLanguage", languageController.getLanguage);
router.post("/addLanguage", languageController.addLanguage);
router.post("/updateLanguage", languageController.updateLanguage);

/******************************* twilio programmable chat routes ****************************************/
//router.post("/getTwilioAccessToken", twilioController.getTwilioAccessToken);
// router.get(
//   "/getTwilioVideoAccessToken",
//   twilioController.generateTwilioAccessTokenVideo
// );

/***********************************************************upload Document  routes****************** */

router.post("/sendPrescription", consultationController.sendPrescription);
router.get(
  "/downloadPrescription",
  consultationController.downloadPrescription
);

module.exports = router;
