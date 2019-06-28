import FollowUpActivity from "./followUp";
import MedicationActivity from "./medication";
import MaterialDeliveryActivity from "./materialDelivery";
import AdverseEventActivity from "./adverseEvent";
import ReminderActivity from "./reminder";
const Log = require("../../libs/log")("activitySdk:ActivityObserver");

class ActivityObserver {
  constructor() {}

  runObservers() {
    FollowUpActivity.runObservers();
    Log.info(`Observing FOLLOWUP activity..!!`);
    MedicationActivity.runObservers();
    Log.info(`Observing MEDICATION activity..!!`);
    MaterialDeliveryActivity.runObservers();
    Log.info(`Observing MATERIAL_DELIVERY activity..!!`);
    AdverseEventActivity.runObservers();
    Log.info(`Observing ADVERSE_EVENT activity..!!`);
    ReminderActivity.runObservers();
    Log.info(`Observing REMINDER activity..!!`);
  }
}

module.exports = new ActivityObserver();
