const express = require("express");
const router = express.Router();
const twilioController = require("../../../app/controllers/twilio/twilio.controller");

router.get(
  "/getTwilioVideoAccessToken",
  twilioController.generateTwilioVideoAccessToken
);

router.get(
  "/getTwilioChatAccessToken",
  twilioController.generateTwilioChatAccessToken
);

router.get(
  "/getConnectedParticipants/:roomId",
  twilioController.getConnectedParticipants
);

module.exports = router;
