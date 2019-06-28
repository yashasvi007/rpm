import Joi from "joi";
import moment from "moment";
import {
  ACTIVITY_MODE,
  ACTIVITY_TYPE,
  REPEAT_TYPE,
  SEVERITY
} from "../../../constant";
const Response = require("../../../app/helper/responseFormat");

const appointMentFormSchema = Joi.object().keys({
  activityType: Joi.string()
    .valid([
      ACTIVITY_TYPE.FOLLOWUP,
      ACTIVITY_TYPE.MATERIAL_DELIVERY,
      ACTIVITY_TYPE.MEDICATION
    ])
    .required(),
  activityMode: Joi.string().valid([
    ACTIVITY_MODE.CALL,
    ACTIVITY_MODE.CHAT,
    ACTIVITY_MODE.VISIT
  ]),
  participantTwo: Joi.string().required(),
  repeat: Joi.string()
    .valid([
      REPEAT_TYPE.NONE,
      REPEAT_TYPE.WEEKLY,
      REPEAT_TYPE.DAILY,
      REPEAT_TYPE.MONTHLY,
      REPEAT_TYPE.YEARLY
    ])
    .required(),
  repeatInterval: Joi.when("repeat", {
    is: Joi.string().valid([
      REPEAT_TYPE.WEEKLY,
      REPEAT_TYPE.MONTHLY,
      REPEAT_TYPE.YEARLY
    ]),
    then: Joi.number().required()
  }),
  repeatDays: Joi.when("repeat", {
    is: REPEAT_TYPE.WEEKLY,
    then: Joi.array().required()
  }),
  startDate: Joi.date().required(),
  endDate: Joi.when("repeat", {
    is: Joi.string().valid([
      REPEAT_TYPE.WEEKLY,
      REPEAT_TYPE.DAILY,
      REPEAT_TYPE.MONTHLY,
      REPEAT_TYPE.YEARLY
    ]),
    then: Joi.date().required()
  }),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  notes: Joi.string()
    .optional()
    .allow("")
});

const reminderFormSchema = Joi.object().keys({
  title: Joi.string().required(),
  participantTwo: Joi.string(),
  repeat: Joi.string()
    .valid([
      REPEAT_TYPE.NONE,
      REPEAT_TYPE.WEEKLY,
      REPEAT_TYPE.DAILY,
      REPEAT_TYPE.MONTHLY,
      REPEAT_TYPE.YEARLY
    ])
    .required(),
  repeatInterval: Joi.when("repeat", {
    is: Joi.string().valid([
      REPEAT_TYPE.WEEKLY,
      REPEAT_TYPE.MONTHLY,
      REPEAT_TYPE.YEARLY
    ]),
    then: Joi.number().required()
  }),
  repeatDays: Joi.when("repeat", {
    is: REPEAT_TYPE.WEEKLY,
    then: Joi.array().required()
  }),
  startDate: Joi.date().required(),
  endDate: Joi.when("repeat", {
    is: Joi.string().valid([
      REPEAT_TYPE.WEEKLY,
      REPEAT_TYPE.DAILY,
      REPEAT_TYPE.MONTHLY,
      REPEAT_TYPE.YEARLY
    ]),
    then: Joi.date().required()
  }),
  startTime: Joi.string().required(),
  notes: Joi.string()
    .optional()
    .allow("")
});

const adverseEventSchema = Joi.object().keys({
  patient: Joi.string().required(),
  severity: Joi.string()
    .valid([
      SEVERITY.MILD,
      SEVERITY.MODERATE,
      SEVERITY.SEVERE,
      SEVERITY.VERY_SEVERE,
      SEVERITY.FATAL
    ])
    .required(),
  on: Joi.date().required(),
  at: Joi.date().required(),
  description: Joi.string().required(),
  docs: Joi.array(),
  medications: Joi.array()
});

const editNotesSchema = Joi.object().keys({
  notes: Joi.string()
    .optional()
    .allow([null, ""])
});

const setStatusSchema = Joi.object().keys({
  status: Joi.string().required()
});

const reschedulScheduleEventSchema = Joi.object().keys({
  startDate: Joi.date().required(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  notes: Joi.string()
    .optional()
    .allow([null, ""]),
  series: Joi.bool().required(),
  repeat: Joi.when("series", {
    is: true,
    then: Joi.string()
      .valid([
        REPEAT_TYPE.WEEKLY,
        REPEAT_TYPE.DAILY,
        REPEAT_TYPE.MONTHLY,
        REPEAT_TYPE.YEARLY
      ])
      .required()
  }),
  repeatInterval: Joi.when("series", {
    is: true,
    then: Joi.when("repeat", {
      is: Joi.string().valid([
        REPEAT_TYPE.WEEKLY,
        REPEAT_TYPE.MONTHLY,
        REPEAT_TYPE.YEARLY
      ]),
      then: Joi.number().required()
    })
  }),
  repeatDays: Joi.when("repeat", {
    is: REPEAT_TYPE.WEEKLY,
    then: Joi.array().required()
  }),
  startDate: Joi.date().required(),
  endDate: Joi.when("series", {
    is: true,
    then: Joi.when("repeat", {
      is: Joi.string().valid([
        REPEAT_TYPE.DAILY,
        REPEAT_TYPE.WEEKLY,
        REPEAT_TYPE.MONTHLY,
        REPEAT_TYPE.YEARLY
      ]),
      then: Joi.date()
    })
  })
});

const reschedulRecurringScheduleEventSchema = Joi.object().keys({});

const validateTimeInterval = (startTime, endTime) => {
  return moment(startTime) < moment(endTime);
};

const validateStartTime = startTime => {
  const now = moment().subtract(3, "minutes");
  return moment(startTime).isAfter(now);
};

export const validateAppointmentFormData = (req, res, next) => {
  const { body: data = {} } = req;
  const { startTime, endTime } = data;
  const isValid = Joi.validate(data, appointMentFormSchema);
  if (isValid && isValid.error != null) {
    const response = new Response(false, 422);
    response.setError(isValid.error);
    return res.status(422).json(response.getResponse());
  }
  if (!validateStartTime(startTime)) {
    const response = new Response(false, 422);
    response.setError({
      error: "you can't create Appointment on passed time."
    });
    return res.status(422).json(response.getResponse());
  }
  if (!validateTimeInterval(startTime, endTime)) {
    const response = new Response(false, 422);
    response.setError({ error: "start time should be less than end time" });
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateReminderFormData = (req, res, next) => {
  const { body: data = {} } = req;
  const { startTime, endTime } = data;
  const isValid = Joi.validate(data, reminderFormSchema);

  if (!validateStartTime(startTime)) {
    const response = new Response(false, 422);
    response.setError({ error: "you can't create Reminder on passed time." });
    return res.status(422).json(response.getResponse());
  }

  if (isValid && isValid.error != null) {
    const response = new Response(false, 422);
    response.setError(isValid.error);
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateAdverseEventData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = Joi.validate(data, adverseEventSchema);
  if (isValid && isValid.error != null) {
    const response = new Response(false, 422);
    response.setError(isValid.error);
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateReschedulScheduleEvent = (req, res, next) => {
  const { body: data } = req;
  const { startTime, endTime, series = false } = data;
  const isValid = Joi.validate(data, reschedulScheduleEventSchema);
  if (isValid && isValid.error != null) {
    const response = new Response(false, 422);
    response.setError(isValid.error);
    return res.status(422).json(response.getResponse());
  }

  if (!validateStartTime(startTime)) {
    const response = new Response(false, 422);
    response.setError({ error: "you can't reschedule on passed time." });
    return res.status(422).json(response.getResponse());
  }

  next();
};

export const validateEditScheduleEvent = (req, res, next) => {
  const { body: data } = req;
  const { startTime, endTime, notes, series = false } = data;
  const isValid = Joi.validate(data, reschedulScheduleEventSchema);
  if (isValid && isValid.error != null) {
    const response = new Response(false, 422);
    console.log("object", isValid.error);
    response.setError(isValid.error);
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateEditNotes = (req, res, next) => {
  const { body: data } = req;
  const isValid = Joi.validate(data, editNotesSchema);

  if (isValid && isValid.error != null) {
    const response = new Response(false, 422);
    response.setError(isValid.error);
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateSetAppointmentStatus = (req, res, next) => {
  const { body: data } = req;
  const isValid = Joi.validate(data, setStatusSchema);

  if (isValid && isValid.error != null) {
    const response = new Response(false, 422);
    response.setError(isValid.error);
    return res.status(422).json(response.getResponse());
  }
  next();
};
