const bookingRequestController = require("./bookingRequest.controller");
const bookingSlotController = require("./bookingSlot.controller");
const cityController = require("./city.controller");
const countryController = require("./country.controller");
const languageController = require("./language.controller");
const memberController = require("./member.controller");
const managerController = require("./manager.controller");
const providerController = require("./provider.controller");
const specialityController = require("./speciality.controller");
const twilioController = require("./twilio/twilio.controller");
const consultationController = require("./consultation.controller");

module.exports = {
  bookingRequestController,
  bookingSlotController,
  cityController,
  countryController,
  languageController,
  memberController,
  managerController,
  providerController,
  specialityController,
  twilioController,
  consultationController
};
