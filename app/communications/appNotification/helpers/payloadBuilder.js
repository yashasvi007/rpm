const moment = require("moment");
const { isEmpty } = require("lodash");
const {
  ARTICLE,
  ARTICLE_CREATE,
  ARTICLE_UPDATE,
  APPOINTMENT,
  APPOINTMENT_CREATE,
  APPOINTMENT_NOW,
  APPOINTMENT_PRIOR,
  APPOINTMENT_UPDATE,
  ADVERSE_EVENT,
  ADVERSE_EVENT_CREATE,
  PRESCRIPTION,
  PRESCRIPTION_CREATE,
  PRESCRIPTION_UPDATE,
  REMINDER,
  REMINDER_CREATE,
  REMINDER_UPDATE,
  REMINDER_NOW,
  SURVEY,
  SURVEY_CREATE,
  SURVEY_UPDATE,
  VITALS,
  VITALS_CREATE,
  VITALS_UPDATE,
  VITALS_DELETE,
  VITALS_SELF_CREATE,
  VITALS_SELF_DELETE,
  VITALS_SELF_UPDATE
} = require("../contants");

const notificationMessage = require("../notificationMessages");
const userServices = require("../../../services/user/user.service");

class PayloadBuilder {
  constructor(data) {
    this.data = data;
  }

  action(actionName) {
    this.activityType = actionName;
    return this;
  }

  type(type) {
    this.notificationType = type;
    return this;
  }

  getReminderPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };

    let newPayload = {
      eventId: payload._id,
      category: payload.eventCategory,
      actor: payload.participantOne,
      object: `${payload.participantOne}-reminder-${payload._id}`,
      foreignId: `${payload.participantOne}-reminder-${payload._id}`,
      participantOne: payload.participantOne,
      participantTwo: payload.participantTwo,
      createdAt: moment().format("DD-MM-YYYY HH:MM:SS")
    };

    switch (this.activityType) {
      case "create":
        return {
          ...newPayload,
          ...{
            message: notificationMessage.reminder.Create({}),
            verb: REMINDER_CREATE
          }
        };

      case "update":
        return {
          ...newPayload,
          ...{
            message: notificationMessage.reminder.Reschedule({}),
            verb: REMINDER_UPDATE
          }
        };
      case "now":
        return {
          ...newPayload,
          ...{
            message: notificationMessage.reminder.Now({}),
            verb: REMINDER_NOW
          }
        };
      default:
        return null;
    }
  }

  getAppointmentPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };
    console.log("app payload", payload);
    let newPayload = {
      eventId: payload._id,
      category: payload.eventCategory,
      actor: payload.participantOne,
      object: `${payload.participantOne}-appointment-${payload._id}`,
      foreign_id: `${payload.participantTwo}`,
      participantOne: payload.participantOne,
      participantTwo: payload.participantTwo,
      createdAt: moment().format("DD-MM-YYYY HH:MM:SS"),
      activityType: payload.details.activityType || "",
      activityMode: payload.details.activityMode || "",
      startTime: payload.details.startTime || "",
      endTime: payload.details.endTime || "",
      notes: payload.details.notes || "",
      sendTo: payload.sendTo || null
    };

    switch (this.activityType) {
      case "create":
        return isEmpty(payload.sendTo)
          ? {
              ...newPayload,
              ...{
                message: notificationMessage.appointment.Create({
                  name: payload.participantOneDetails.name,
                  category: payload.participantOneDetails.category
                }),
                verb: APPOINTMENT_CREATE
              }
            }
          : {
              ...newPayload,
              ...(payload.sendTo == "participantOne"
                ? {
                    message: `Appointment Created successfully with ${
                      payload.participantTwoDetails.name
                    } ${payload.participantTwoDetails.category}`,
                    verb: APPOINTMENT_CREATE
                  }
                : {
                    message: notificationMessage.appointment.Create({
                      name: payload.participantOneDetails.name,
                      category: payload.participantOneDetails.category
                    }),
                    verb: APPOINTMENT_CREATE
                  })
            };
      case "reschedule":
        return isEmpty(payload.sendTo)
          ? {
              ...newPayload,
              ...{
                message: notificationMessage.appointment.Reschedule({
                  name: payload.participantOneDetails.name,
                  category: payload.participantOneDetails.category
                }),
                verb: APPOINTMENT_UPDATE
              }
            }
          : {
              ...newPayload,
              ...(payload.sendTo == "participantOne"
                ? {
                    message: `Appointment with ${
                      payload.participantTwoDetails.name
                    } ${
                      payload.participantTwoDetails.category
                    } successfully  Rescheduled /Updated `,
                    verb: APPOINTMENT_UPDATE
                  }
                : {
                    message: notificationMessage.appointment.Reschedule({
                      name: payload.participantOneDetails.name,
                      category: payload.participantOneDetails.category
                    }),
                    verb: APPOINTMENT_UPDATE
                  })
            };
      case "now":
        return {
          ...newPayload,
          ...{
            message: notificationMessage.appointment.Now({
              name: payload.participantOneDetails.name,
              category: payload.participantOneDetails.category
            }),
            verb: APPOINTMENT_NOW
          }
        };
      case "prior":
        return {
          ...newPayload,
          ...{
            message: notificationMessage.appointment.Prior({
              name: payload.participantOneDetails.name,
              category: payload.participantOneDetails.category,
              time: "15 mins"
            }),
            verb: APPOINTMENT_PRIOR
          }
        };
      default:
        return null;
    }
  }
  getArticlePayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };
    let newPayload = {
      eventId: payload._id,
      category: payload.eventCategory,
      actor: payload.participantOne,
      object: `${payload.participantOne}-article-${payload._id}`,
      foreignId: `${payload.participantOne}`,
      participantOne: payload.participantOne,
      participantTwo: payload.participantTwo,
      createdAt: moment().format("DD-MM-YYYY HH:MM:SS")
    };
    switch (this.action) {
      case "create":
        return {
          ...newPayload,
          ...{ message: "" }
        };
      case "delete":
        return {
          ...newPayload,
          ...{ message: "" }
        };
      default:
        return null;
    }
  }

  getSurveyPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };
    let newPayload = {
      eventId: payload._id,
      category: payload.eventCategory,
      actor: payload.participantOne,
      object: `${payload.participantOne}-survey-${payload._id}`,
      foreignId: `${payload.participantOne}-survey-${payload._id}`,
      participantOne: payload.participantOne,
      participantThree: payload.participantTwo
    };
    switch (this.action) {
      case "create":
        return {
          ...newPayload,
          ...{
            message: notificationMessage.survey.Create({}),
            verb: SURVEY_CREATE
          }
        };
      default:
        return null;
    }
  }

  getVitalsPayload() {
    let payload = !isEmpty(arguments)
      ? { ...{}, ...arguments[0] }
      : { ...{}, ...this.data };
    let newPayload = {
      eventId: payload._id,
      category: payload.eventCategory,
      actor: payload.participantOne,
      object: `${payload.participantOne}-vitals-${payload._id}`,
      foreignId: `${payload.participantOne}-vitals-${payload._id}`,
      participantOne: payload.participantOne,
      participantTwo: payload.participantTwo
    };
    switch (this.action) {
      case "create-self":
        return {
          ...newPayload,
          ...{
            message: notificationMessage.vitals.SelfUpdate({}),
            verb: VITALS_SELF_CREATE
          }
        };
      case "update-self":
        return {
          ...newPayload,
          ...{
            messages: notificationMessage.vitals.SelfUpdate({}),
            verb: VITALS_SELF_UPDATE
          }
        };
      case "delete-self":
        return {
          ...newPayload,
          ...{
            messages: notificationMessage.vitals.SelfUpdate({}),
            verb: VITALS_SELF_DELETE
          }
        };
      case "create":
        return {
          ...newPayload,
          ...{
            messages: notificationMessage.vitals.OtherUpdate({}),
            verb: VITALS_CREATE
          }
        };
      case "update":
        return {
          ...newPayload,
          ...{
            messages: notificationMessage.vitals.OtherUpdate({}),
            verb: VITALS_UPDATE
          }
        };
      case "delete":
        return {
          ...newPayload,
          ...{
            messages: notificationMessage.vitals.OtherUpdate({}),
            verb: VITALS_UPDATE
          }
        };
      default:
        return null;
    }
  }

  getBuild() {
    try {
      let payload = { ...{}, ...this.data };
      //console.log("payload @ getBuild", payload);

      switch (this.notificationType) {
        case APPOINTMENT:
          return this.getAppointmentPayload(payload);
        case REMINDER:
          return this.getReminderPayload(payload);
        case ARTICLE:
          return this.getArticlePayload(payload);
        case SURVEY:
          return this.getSurveyPayload(payload);
        case PRESCRIPTION:
          return this.getPrescriptionPayload(payload);
        case VITALS:
          return this.getVitalsPayload(payload);
        default:
          return null;
      }
    } catch (err) {
      throw err;
    }
  }
}
module.exports = data => new PayloadBuilder(data);
