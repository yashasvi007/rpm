import { NOTIFY_WITH } from "../notificationType";

const { NotificationSdk } = require("../");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");

class SmsNotification {
  constructor({}) {
    this._event = NotificationSdk;
  }

  async notify(data) {
    //prepare payload
  }

  runObservers() {
    this._event.on(NOTIFY_WITH.SMS, this.notify);
  }
}

export default new SmsNotification({});
