const express = require("express");
const router = express.Router();
const eventController = require("../../../app/controllers/event/event.controller");
const { check, body } = require("express-validator/check");
const countryCodes = require("country-data").callingCodes;
import Appointment from "../../../app/controllers/event/appointment.controller";
import Reminder from "../../../app/controllers/event/reminder.controller";
import Authenticate from "../middleware/auth";
import * as validator from "./validator";
import appointmentController from "../../../app/controllers/event/appointment.controller";

router.post(
  "/invite",
  Authenticate,
  [
    check("email")
      .isEmail()
      .not()
      .isEmpty(),
    check("userCategory")
      .isString()
      .not()
      .isEmpty(),
    check("programId")
      .isMongoId()
      .not()
      .isEmpty(),
    check("contactNo.phoneNumber")
      .optional()
      .isString(),
    body("contactNo.countryCode")
      .optional()
      .custom((value, { req }) => {
        if (countryCodes.all.indexOf(value) == -1) {
          throw new Error("Invalid Country code");
        } else {
          return true;
        }
      }),
    check("name")
      .optional()
      .isString(),
    check("gender")
      .optional()
      .isString(),
    check("dob")
      .optional()
      .isString(),
    check("country")
      .optional()
      .isMongoId(),
    check("city")
      .optional()
      .isMongoId(),
    check("doctor")
      .optional()
      .isString(),
    check("hospital").optional(),
    check("speciality")
      .optional()
      .isString(),
    check("licenseNumber")
      .optional()
      .isString()
  ],
  eventController.invite
);

router.post(
  "/validate",
  [check("link").isUUID()],
  eventController.validateLink
);

router.post(
  "/appointments",
  Authenticate,
  validator.validateAppointmentFormData,
  Appointment.create
); //attach middleware for permission

router.post(
  "/reminders",
  Authenticate,
  validator.validateReminderFormData,
  Reminder.create
); //attach middleware for permission

router.get(
  "/appointments",
  Authenticate,
  eventController.getAppointmentAndReminders
); //attach middleware for permission
router.get("/reminders", Authenticate, Reminder.getReminders); //attach middleware for permissions
router.get(
  "/users/:userId/appointments/history",
  Authenticate,
  Appointment.getAppointmentHistory
); //attach middleware for permissions

router.post(
  "/appointments/:scheduleEventId/re-schedule",
  Authenticate,
  validator.validateReschedulScheduleEvent,
  Appointment.reschedulScheduleEvent
);

router.post(
  "/appointments/:scheduleEventId/edit-notes",
  Authenticate,
  validator.validateEditNotes,
  Appointment.editNotesScheduleEvent
);

router.post(
  "/reminders/:scheduleEventId/edit",
  Authenticate,
  validator.validateEditScheduleEvent,
  Reminder.editReminder
);

router.post(
  "/reminders/:scheduleEventId/edit-notes",
  Authenticate,
  validator.validateEditNotes,
  Reminder.editNotesScheduleEvent
);

router.post("/appointments/delete", Authenticate, Appointment.cancel);

router.post("/reminders/delete", Authenticate, Reminder.cancel);

router.post("/appointments/done", Authenticate, Appointment.complete); //attach middleware for permissions

router.post(
  "/adverse-events",
  Authenticate,
  validator.validateAdverseEventData,
  eventController.createAdverseEvent
);

router.post("/events/:eventId/status", Authenticate, Appointment.setStatus);

router.get(
  "/events/eventData/:eventId",
  Authenticate,
  eventController.getEventDataForId
);

router.get(
  "/users/:userId/adverse-events",
  Authenticate,
  eventController.getAdverseEvent
);

router.get(
  "/users/:userId/appointment/booked-slots",
  Authenticate,
  appointmentController.getAlReadyBookTimes
);
router.get("/events/lastEdited", Authenticate, Appointment.getLastEditedEvent);

router.get(
  "/events/:eventId/eventUsers",
  Authenticate,
  Appointment.getEventUsers
);

router.get(
  "/events/booked-timeslot",
  Authenticate,
  Appointment.getBookedTimeSlotByDate
);

router.post(
  "/events/:eventId/addVideoRoomParticipants",
  Authenticate,
  Appointment.addVideoRoomParticipants
);

module.exports = router;
