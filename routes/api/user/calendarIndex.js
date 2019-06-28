const express = require("express");
const router = express.Router();
const authenticate = require("../../../app/controllers/auth/auth.controller");
const stateAuthenticate = require("../../../app/controllers/auth/state.auth.controller");
const calendarController = require("../../../app/controllers/user/user.calendar.controller");

/** routes for calendar **/

router.get("/calendars", calendarController.listCalendar); // not needed for now

// router.post("/calendars", authenticate, calendarController.createCalendar);

router.post(
  "/calendar/add/events",
  authenticate,
  calendarController.createEvent
);

// router.get("/events", authenticate, calendarController.readEvent);

// router.delete("/events", authenticate, calendarController.deleteEvent);

// router.get("/freebusy", calendarController.freebusy); // not needed for now

/** routes for authorization **/

router.get(
  "/sync-calendar",
  authenticate,
  calendarController.getAuthorizationForCalendar
);

router.get(
  "/auth-token",
  authenticate,
  stateAuthenticate,
  calendarController.getAccessTokenForCalendar
);

router.get(
  "/auth-refresh",
  authenticate,
  calendarController.getRefreshedAccessToken
);

router.get("/calendar/:userId/details", calendarController.getCalendarDetails);

module.exports = router;
