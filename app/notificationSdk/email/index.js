import { NOTIFY_WITH } from "../notificationType";
import getAge from "../../helper/getAge";
import {
  EVENT_IS,
  EVENT_TYPE,
  USER_CATEGORY,
  ACTIVITY_MODE
} from "../../../constant";
const { NotificationSdk } = require("../");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
const log = require("../../../libs/log")("NOTIFICATION_SDK");
const userService = require("../../services/user/user.service");
const isEqual = require("lodash/isEqual");
const moment = require("moment");

class EmailNotification {
  constructor({}) {
    this._event = NotificationSdk;
  }

  getTimeDate(payload) {
    const { data, eventIs } = payload;
    let Time;
    let StartDate;
    switch (eventIs) {
      case EVENT_IS.CREATED:
        {
          const { details = {} } = data;
          const { startTime = "" } = details;
          Time = new moment.parseZone(startTime).format("h:mm a");
          StartDate = new moment.parseZone(startTime).format(
            "DD MMM YYYY, ddd"
          );
        }
        break;
      case EVENT_IS.RESCHEDULED:
      case EVENT_IS.START:
      case EVENT_IS.UPDATED:
      case EVENT_IS.CANCEL:
        {
          const { startTime = "" } = data;
          Time = new moment(startTime)
            .utcOffset(process.config.UTC_OFFSET_STR)
            .format("h:mm a");
          StartDate = new moment(startTime)
            .utcOffset(process.config.UTC_OFFSET_STR)
            .format("DD MMM YYYY, ddd");
        }
        break;
      default:
        const timeStamp = moment().utcOffset(process.config.UTC_OFFSET_STR);
        Time = timeStamp.format("h:mm a");
        StartDate = timeStamp.format("DD MMM YYYY, ddd");
    }
    return {
      Time,
      StartDate
    };
  }

  prepareReminderMailData = async (payload, user) => {
    try {
      const { data, message, eventIs } = payload;
      const { _id: currentUserId, name: currentUserName, category } = user;
      let ParticipantOne = "";
      let ParticipantTwo = "";
      let ReminderTitle = "";
      if (eventIs === EVENT_IS.CREATED) {
        const { participantOne = "", participantTwo = "", details = {} } = data;
        const { title = "", startTime = "" } = details;
        ParticipantOne = participantOne;
        ParticipantTwo = participantTwo;
        ReminderTitle = title;
      } else {
        const { startTime = "", data: details = {} } = data;
        const {
          title = "",
          participantOne = "",
          participantTwo = ""
        } = details;
        ParticipantOne = participantOne;
        ParticipantTwo = participantTwo;
        ReminderTitle = title;
      }
      const { Time, StartDate } = this.getTimeDate(payload);
      let otherUser = {};

      if (isEqual(currentUserId, ParticipantOne) && ParticipantTwo !== "") {
        otherUser = await userService.getUser({ _id: ParticipantTwo });
      }
      if (isEqual(currentUserId, ParticipantTwo) && ParticipantOne !== "") {
        otherUser = await userService.getUser({ _id: ParticipantOne });
      }
      const formatedData = {};
      const { name: otherUserName, dob, gender } = otherUser;
      const age = category === USER_CATEGORY.CARECOACH ? getAge(dob) : "";
      formatedData.UserName = currentUserName;
      formatedData.mainBodyText = message;

      formatedData.eventWith = `Reminder for ${ReminderTitle}`;

      formatedData.userDetail = "";

      formatedData.eventTime = `at ${Time} on ${StartDate}`;
      formatedData.buttonText = "View In App";
      formatedData.link = process.config.WEB_URL + "/";
      formatedData.host = process.config.APP_URL;
      formatedData.message = message;
      return formatedData;
    } catch (error) {
      console.log("error", error);
    }
  };

  prepareAppointMentMailData = async (payload, user) => {
    try {
      const { data, message, eventIs } = payload;
      const { _id: currentUserId, name: currentUserName, category } = user;
      let ParticipantOne = "";
      let ParticipantTwo = "";
      let ActivityMode = "";
      let ActivityType = "";
      if (eventIs === EVENT_IS.CREATED) {
        const { participantOne = "", participantTwo = "", details = {} } = data;
        const {
          activityMode = "",
          activityType = "",
          startTime = ""
        } = details;
        ParticipantOne = participantOne;
        ParticipantTwo = participantTwo;
        ActivityMode =
          activityMode === ACTIVITY_MODE.CHAT ? "Video call" : activityMode;
        ActivityType = activityType;
      } else {
        const { startTime = "", data: details = {} } = data;
        const {
          activityMode = "",
          activityType = "",
          participantOne = "",
          participantTwo = ""
        } = details;
        ParticipantOne = participantOne;
        ParticipantTwo = participantTwo;
        ActivityMode =
          activityMode === ACTIVITY_MODE.CHAT ? "Video call" : activityMode;
        ActivityType = activityType;
      }

      const { Time, StartDate } = this.getTimeDate(payload);
      let otherUser = {};

      if (isEqual(currentUserId, ParticipantOne)) {
        otherUser = await userService.getUser({ _id: ParticipantTwo });
      }
      if (isEqual(currentUserId, ParticipantTwo)) {
        otherUser = await userService.getUser({ _id: ParticipantOne });
      }
      const formatedData = {};
      const {
        name: otherUserName,
        dob,
        gender,
        category: otherUserCategory
      } = otherUser;
      const age =
        otherUserCategory === USER_CATEGORY.PATIENT ? getAge(dob) : "";
      formatedData.UserName = currentUserName;
      formatedData.mainBodyText = message;

      formatedData.eventWith = `${
        otherUserCategory === USER_CATEGORY.CARE_COACH
          ? "Care Coach"
          : otherUserCategory
      } ${ActivityMode} for ${ActivityType} with`;

      formatedData.userDetail =
        otherUserCategory === USER_CATEGORY.PATIENT
          ? `${otherUserName}(${age} ${gender})`
          : `${otherUserName}`;

      formatedData.eventTime = `at ${Time} on ${StartDate}`;
      formatedData.buttonText = "View In App";
      formatedData.link = process.config.WEB_URL + "/";
      formatedData.host = process.config.APP_URL;
      formatedData.message = message;

      return formatedData;
    } catch (error) {
      console.log("error", error);
    }
  };

  notify = async data => {
    try {
      //prepare email Data
      const { payload = {}, user } = data;
      const { data: payloadData = {} } = payload;
      const { eventCategory, eventType } = payloadData;
      const event = eventCategory || eventType;
      let templateData = {};
      switch (event) {
        case EVENT_TYPE.APPOINTMENT:
          templateData = await this.prepareAppointMentMailData(payload, user);
          break;
        case EVENT_TYPE.REMINDER:
          templateData = await this.prepareReminderMailData(payload, user);
          break;
        default:
          console.log(payloadData);
          throw new Error("invalid eventType");
      }
      if (eventCategory === EVENT_TYPE.APPOINTMENT) {
        templateData = await this.prepareAppointMentMailData(payload, user);
      } else if (eventCategory === EVENT_TYPE.REMINDER) {
        templateData = await this.prepareReminderMailData(payload, user);
      }
      const emailPayload = {
        toAddress: user.email,
        title: "PEP Appointment",
        templateData: templateData,
        templateName: "appointment"
      };

      const emailResponse = await Proxy_Sdk.execute(EVENTS.SEND_EMAIL, {
        ...emailPayload
      });
    } catch (error) {
      console.log("error=========>", error);
    }
  };

  runObservers() {
    this._event.on(NOTIFY_WITH.EMAIL, this.notify);
  }
}

export default new EmailNotification({});
