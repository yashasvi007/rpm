import { differenceInMinutes } from "date-fns";

import { NOTIFY_WITH } from "../notificationType";
import { NotificationSdk } from "../";
import Notifier from "../../communications/appNotification";

const actionList = {
  CREATE: "create",
  RESCHEDULE: "reschedule",
  NOW: "now",
  PROIR: "prior",
  DELETE: "delete"
};

class PushAppNotification {
  constructor({}) {
    this._event = NotificationSdk;
  }

  Notify(args) {
    try {
      console.log("args at sdk", args);
      let {
        payLoad: { data, eventIs },
        user
      } = args;
      if (data) {
        let { _id, eventId, eventCategory, eventType, startTime } = data;

        let difference = differenceInMinutes(new Date(startTime), new Date());
        console.log("diff", difference);
        let actionType = null,
          notificationId = null,
          etype = null;
        if (eventIs == "CREATED") {
          actionType = actionList.CREATE;
          notificationId = _id;
          etype = eventCategory;
        }
        if (eventIs == "RESCHEDULED") {
          actionType = actionList.RESCHEDULE;
          notificationId = eventId;
          etype = eventType;
        }
        if (difference === 15) {
          actionType = actionList.PROIR;
          notificationId = eventId;
          etype = eventType;
        }
        if (eventIs == "START") {
          actionType = actionList.NOW;
          notificationId = eventId;
          etype = eventType;
        }

        console.log("action & type", actionType, etype);
        Notifier({ notificationId, sendTo: user._id })
          .action(actionType)
          .type(etype)
          .notify();
      }
    } catch (err) {
      console.log("error @ push app noitfier", err);
    }
  }

  runObservers() {
    this._event.on(NOTIFY_WITH.PUSH_APP, this.Notify);
  }
}

export default new PushAppNotification({});
