import { EventEmitter } from "events";
import { NOTIFY_WITH } from "./notificationType";
const userService = require("../services/user/user.service");
const log = require("../../libs/log")("NOTIFICATION_SDK");

class Notification extends EventEmitter {
  constructor() {
    super();
  }

  notify = () => {};

  execute = async (userId, payload) => {
    //need to make below keys same
    const { data: { eventType, eventCategory } = {} } = payload;
    const isReminder = eventType === "reminder" || eventCategory === "reminder";

    const user = await userService.getUser({ _id: userId });
    if (!user && user === null) {
      return;
    }
    const {
      contactNo: { verified: contactNoVerified } = {},
      settings: {
        preferences: { smsAlerts, emailAlerts, pushAlerts, reminderAlerts }
      } = {}
    } = user;

    log.info(
      smsAlerts,
      emailAlerts,
      pushAlerts,
      reminderAlerts,
      isReminder,
      contactNoVerified
    );

    if (isReminder && !reminderAlerts) {
      return;
    }
    if (smsAlerts && contactNoVerified) {
      this.emit(NOTIFY_WITH.SMS, { payload: payload, user: user });
    }
    if (emailAlerts) {
      this.emit(NOTIFY_WITH.EMAIL, { payload: payload, user: user });
    }
    if (pushAlerts) {
      this.emit(NOTIFY_WITH.PUSH_APP, { payLoad: payload, user: user });
    }
  };
}

const NotificationSdk = new Notification();

module.exports = { NotificationSdk };
