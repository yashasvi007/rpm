const eventService = require("../../services/event/event.service");
const userService = require("../../services/user/user.service");
const programService = require("../../services/program/program.service");
import scheduleService from "../../services/scheduler/scheduler.service";
const { validationResult } = require("express-validator/check");
const uuid = require("uuid/v4");
const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("eventController");
const emailManager = require("../../../app/communications/email/emailManger");
const smsManager = require("../../../app/communications/sms/smsManger");
const rbac = require("../../helper/rbac");
const millisInADay = 86400000;
const errMessages = require("../../../config/messages.json").errMessages;
const userCategories = require("../../../config/messages.json").userCategories;
const constants = require("../../../config/constants");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
const { ActivitySdk, STAGES } = require("../../activitySdk");
import { EVENT_TYPE } from "../../../constant";
import isEmpty from "lodash/isEmpty";

class EventController {
  constructor() {}

  /**
   * @api {POST} /invite Creates a invitation event
   * @apiName invite
   * @apiGroup Events
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Status of the event
   *
   * @apiParam {String} email Email of the user.
   * @apiParam {ContactObject} [contactNo] Contact details of the user
   * @apiParam {String} contactNo.countryCode Country Code of the user
   * @apiParam {String} contactNo.phoneNumber Phone number of the user
   * @apiParam {String} userCategory Category of the invitee
   * @apiParam {ObjectId[]} [programId] Id of the program
   * @apiParam {String} [name] Name of the invitee
   * @apiParam {String} [organizationName] Name of the organization of the invitee
   * @apiParam {String} [speciality] Speciality of the invitee
   * @apiParam {String} [licenseNumber] License number of the invitee
   *
   * @apiParamExample {json} Request-Example:
   * {
   *  "email": "maxlife@email.com",
   *  "contactNo": {
   *    "countryCode": "+91",
   *    "phoneNumber": 9122110019
   *  },
   *  "userCategory": "doctor",
   *  "programId": 1
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "status": true,
   *    "statusCode": 200,
   *    "payload": {
   *        "data": {
   *           "status": "pending",
   *           "_id": "5c011e2d2217692a513134cc"
   *        },
   *        "message": "Invite sent."
   *     }
   * }
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INVITE_NOT_SENT",
   *           "message": "Your invite was not sent."
   *        }
   *    }
   * }
   *
   */
  async invite(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }

    try {
      let {
        email,
        contactNo,
        userCategory,
        programId,
        name,
        organizationName,
        speciality,
        licenseNumber,
        country,
        dob,
        gender,
        city,
        doctor,
        hospital
      } = req.body;

      let userName = email.split("@")[0];
      email = email.toLowerCase();

      const { userDetails = {} } = req;

      const can = await rbac.can(
        req.userDetails.userData.category,
        "invite",
        userCategory + "s"
      );
      if (!can) {
        throw new Error(constants.INVITE_NOT_PERMISSIBLE);
      }

      const { userId } = req.userDetails;

      let inviteeEmailIdExist = await userService.getUser({ email: email }); //checking if email id already exists or not
      let inviteeNumberExist = false;
      if (!isEmpty(contactNo)) {
        const { countryCode, phoneNumber } = contactNo;
        inviteeNumberExist = await userService.getUser({
          "contactNo.phoneNumber": phoneNumber,
          "contactNo.countryCode": countryCode
        });
      }

      let link = uuid(); // create unique link

      let eventData = {};
      if (userCategory == "patient") {
        eventData = {
          participantOne: req.userDetails.userId,
          eventCategory: "invitation",
          details: {
            userCategory,
            email,
            contactNo,
            programId,
            name,
            country,
            dob,
            gender,
            city,
            doctor,
            hospital
          },
          link,
          endDate: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * millisInADay
          )
        };
      } else {
        eventData = {
          participantOne: req.userDetails.userId,
          eventCategory: "invitation",
          details: {
            userCategory,
            email,
            contactNo,
            programId,
            name,
            country,
            licenseNumber,
            speciality,
            city,
            hospital
          },
          link,
          endTime: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * millisInADay
          )
        };
      }

      let resp = await eventService.addEvent(eventData);

      // send invitation link
      let templateData = new Object();
      templateData.userName = userName;
      templateData.host = process.config.S3_BUCKET_URL;
      templateData.inviteCard =
        process.config.S3_BUCKET_URL + "/placeholder_image.png";

      if (inviteeEmailIdExist || inviteeNumberExist) {
        // if (programId == null || programId == undefined) {
        //   throw new Error(constants.EXISTING_USER);
        // }
        // templateData.link = process.config.APP_URL + "/accept-invite/" + link;
        throw new Error(constants.EXISTING_USER);
      } else {
        templateData.link = process.config.APP_URL + "/sign-up/" + link;
      }

      let inviterCategory = req.userDetails.userData.category;

      if (programId != null || programId != undefined) {
        let program = await programService.getProgram({
          _id: programId
        });
        templateData.mainBodyText = `${
          userCategories[inviterCategory]
        } Ms. Jasmin has invited you to collaborate on a program for <strong>${
          program.pharmaCo
        }</strong> titled <strong>${
          program.name
        }</strong> to observe the <strong>${
          program.targetLocation.city
        }</strong> region patients`;

        templateData.subBodyText = `The Program commences from <strong>${new Date(
          program.activeFrom
        ).toDateString()}</strong> and ends on <strong>${new Date(
          program.expiresOn
        ).toDateString()}</strong>.`;

        templateData.buttonText = "Join the Program";
      } else {
        templateData.mainBodyText = `${
          userCategories[inviterCategory]
        } Ms. Jasmin has invited you to come onboard to collaborate on programs for mutliple Pharma companies primarily to observe patients of different regions.`;

        templateData.subBodyText = `The Program commencement date will be mailed soon.`;
        templateData.buttonText = "Accept the Invitation";
      }

      let emailPayload = {
        toAddress: email,
        title:
          "Jasmin has invited you to collaborate on a Program using RPM web application",
        templateData: templateData,
        templateName: "invite"
      };

      const emailResponse = await Proxy_Sdk.execute(EVENTS.SEND_EMAIL, {
        ...emailPayload,
        programId: programId,
        loggedInUserId: userId
      });

      // send msg if we have number

      // let smsLink = process.config.APP_URL + "/sign-up/" + link;
      // if (contactNo) {
      // 	let smsPayload = {
      // 		phonenumber: contactNo.countryCode + String(contactNo.phoneNumber),
      // 		sender: "rpm",
      // 		message: `Hi, join us on ${smsLink} .`
      // 	};
      // 	await smsManager.sendSms(smsPayload);
      // }
      // sms sending ends here
      let response = new Response(true, 200);
      response.setData({
        status: resp._doc.status,
        _id: resp._doc._id
      });
      response.setMessage("Invite sent.");
      return res.send(response.getResponse());
    } catch (err) {
      let payload;
      Log.debug(err);
      switch (err.message) {
        case constants.INVITE_NOT_PERMISSIBLE:
          payload = {
            code: 403,
            error: errMessages.INVITE_NOT_PERMISSIBLE
          };
          break;

        case constants.EXISTING_USER:
          payload = {
            code: 400,
            error: errMessages.EXISTING_USER
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessages.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
  /**
   * @api {POST} /validate Validates provided link
   * @apiName validateLink
   * @apiGroup Events
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Validation Validation along with email
   *
   * @apiParam {String} link Unique key sent to the user in link.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *    "link": "e716c149-761a-4250-b5d1-b5ea55e35774"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "status": true,
   *     "statusCode": 200,
   *     "payload": {
   *        "data": {
   *             "email": "nikhil.prabhakar@tripock.com"
   *             "category": "doctor"
   *         },
   *        "message": "Your link is valid."
   *     }
   * }
   *
   * @apiErrorExample {json} Already-Used-Link-Response:
   * {
   *    "status": false,
   *    "statusCode": 403,
   *    "payload": {
   *        "error": {
   *           "status": "LINK_ALREADY_USED",
   *           "message": "Your link has been used. Same link can't be used twice."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Expired-Link-Response:
   * {
   *    "status": false,
   *    "statusCode": 410,
   *    "payload": {
   *        "error": {
   *           "status": "EVENT_EXPIRED",
   *           "message": "Your invite link has expired."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Cancelled-Event-Response:
   * {
   *    "status": false,
   *    "statusCode": 403,
   *    "payload": {
   *        "error": {
   *           "status": "EVENT_WAS_CANCELLED",
   *           "message": "Your had cancelled your invite previously, so it no longer exists. You may ask for a new invite."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Invalid-Link-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "INVALID_LINK",
   *           "message": "Your link is invalid."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Invalid-OR-Expired-Token-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   */
  async validateLink(req, res) {
    const { link } = req.body;
    try {
      let result = await eventService.searchByField({ link: link });
      let response;
      if (result.length > 0) {
        if (result[0].endDate < new Date(Date.now())) {
          await eventService.updateEvent(
            { link: link },
            { status: "expired", invitee: null }
          );
          throw new Error(constants.EVENT_EXPIRED);
        }
        if (result[0].status == "completed") {
          throw new Error(constants.LINK_ALREADY_USED);
        } else if (result[0].status == "expired") {
          throw new Error(constants.EVENT_EXPIRED);
        } else if (result[0].status == "cancelled") {
          throw new Error(constants.EVENT_WAS_CANCELLED);
        } else {
          response = new Response(true, 200);
          if (result[0].eventCategory == EVENT_TYPE.INVITATION) {
            response.setData({
              email: result[0].details.email,
              category: result[0].details.userCategory
            });
          } else if (result[0].eventCategory === EVENT_TYPE.FORGOT_PASSWORD) {
            response.setData({
              email: result[0].details.email
            });
          } else {
            response.setData({});
          }
          response.setMessage("Your link is valid.");
          return res.send(response.getResponse());
        }
      } else if (result.length == 0) {
        throw new Error(constants.EVENT_WAS_CANCELLED);
      }
    } catch (err) {
      let payload;

      switch (err.message) {
        case constants.LINK_ALREADY_USED:
          payload = {
            code: 403,
            error: errMessages.LINK_ALREADY_USED
          };
          break;

        case constants.EVENT_EXPIRED.status:
          payload = {
            code: 410,
            error: errMessages.EVENT_EXPIRED
          };
          break;

        case constants.EVENT_WAS_CANCELLED.status:
          payload = {
            code: 403,
            error: errMessages.EVENT_WAS_CANCELLED
          };
          break;

        case constants.INVALID_LINK.status:
          payload = {
            code: 401,
            error: errMessages.INVALID_LINK
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessages.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getEvents() {
    const { userId, startDate, endDate } = req.body;
    //get events appointment,reminder,userId
  }

  async confirmEvent(req, res) {}
  async cancelEvent(req, res) {
    const { eventId } = req.params;
    const { recurr, scheduleEventId } = req.body;
    if (recurr) {
      //delete event as well as all schedule events
      //
    } else {
      //delete one this schedule event
    }
  }
  async completeEvent(req, res) {}
  async deleteEvent(req, res) {
    const { eventId } = req.params;
    const { recurr, scheduleEventId } = req.body;
    if (recurr) {
      //delete event as well as all schedule events
      //
    } else {
      //delete one this schedule event
    }
  }

  async updateEvent(req, res) {}

  //   const PATIENT = "patient";
  // const SEVERITY_FIELD = "severity";
  // const ON = "on";
  // const AT = "at";
  // const DESCRIPTION = "description";

  async createAdverseEvent(req, res) {
    try {
      const {
        patient,
        severity,
        on,
        at,
        description,
        docs = [],
        medications = []
      } = req.body;
      const eventData = {
        participantOne: req.userDetails.userId,
        participantTwo: patient,
        eventCategory: "adverse",
        details: {
          patient,
          severity,
          on,
          at,
          description,
          docs,
          medications
        }
      };
      const adverseEvent = await eventService.addEvent(eventData);

      const result = ActivitySdk.execute({
        eventType: EVENT_TYPE.ADVERSE_EVENT,
        stage: STAGES.INIT,
        data: adverseEvent
      });
      const response = new Response(true, 200);
      response.setMessage("Adverse event created successfully");
      return res.send(response.getResponse());
    } catch (err) {
      const payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getAdverseEvent(req, res) {
    try {
      const { userId } = req.params;
      const adverseEventData = await eventService.getAdverseEvent({
        userId: userId
      });
      let adverseEventList = [];
      let events = {};
      adverseEventData.forEach(value => {
        const {
          _id,
          participantOne,
          eventCategory,
          participantTwo,
          details,
          status
        } = value;
        adverseEventList.push(value._id);
        events = {
          ...events,
          [_id]: {
            _id,
            participantOne,
            participantTwo,
            eventCategory,
            details,
            status
          }
        };
      });
      const response = new Response(true, 200);
      const adverseEvent = {};
      adverseEvent[userId] = adverseEventList;
      response.setData({ adverseEvent: adverseEvent, events: events });
      res.send(response.getResponse());
    } catch (err) {
      const payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getAppointmentAndReminders(req, res) {
    const { userId, startDate, endDate } = req.query;
    try {
      const appointmentsData = await eventService.getEventsByuserId({
        eventCategories: ["appointment", "reminder"],
        userId,
        status: ["pending", "cancelled", "completed", "expired"],
        startDate: startDate,
        endDate: endDate
      });
      let appointments = {};
      let schedulesEvents = {};
      let scheduleEventListByDate = {};
      const eventList = appointmentsData.map(appointment => appointment._id);
      let participants = new Set();
      for (const appointment of appointmentsData) {
        const { _id, participantOne, participantTwo } = appointment;
        participants.add(participantOne);
        participants.add(participantTwo);
        const scheduleEventList = await scheduleService.getScheduleEvent({
          eventId: _id,
          startDate: startDate,
          endDate: endDate
        });
        scheduleEventList.forEach(scheduleEvent => {
          const {
            _id,
            eventType,
            eventId,
            startTime,
            endTime,
            data,
            status,
            completedBy
          } = scheduleEvent;
          schedulesEvents[_id] = {
            id: _id,
            eventType: eventType,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime,
            data: data,
            status: status,
            completedBy: completedBy
          };
        });
        appointments[appointment._id] = scheduleEventList.map(
          scheduleEvent => scheduleEvent._id
        );
      }

      let users = {};
      for (const id of participants) {
        const usersData = await userService.getUserById(id); //need to make batch get
        users[id] = {
          basicInfo: usersData.basicInfo,
          status: usersData.status
        };
      }

      const scheduleEventListData = await scheduleService.getScheduleEventByEventIdGroupByDate(
        { eventIds: eventList, startDate, endDate }
      );

      scheduleEventListData.forEach(scheduleEvent => {
        const { _id, scheduleEvents = [] } = scheduleEvent;
        scheduleEventListByDate[_id] = scheduleEvents;
      });

      //const users = userService.getBasicInfo();//

      const response = new Response(true, 200);
      response.setData({
        appointments: appointments,
        events: schedulesEvents,
        scheduleEventListByDate: scheduleEventListByDate,
        users: users
      });

      return res.send(response.getResponse());
    } catch (err) {
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getEventDataForId(req, res) {
    try {
      const { eventId } = req.params;

      const eventData = await scheduleService.getScheduleEventById(eventId);

      const response = new Response(true, 200);
      response.setData({
        events: eventData
      });
      return res.send(response.getResponse());
    } catch (err) {
      console.log("error", err);

      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new EventController();
