const stream = require("stream");
// const transfromStream = require("./streams/transform.stream");
// const notifyStream = require("./streams/notify.stream");
// const validateStream = require("./streams/validator.stream");
const validator = require("./helpers/validator");
const payloadBuilder = require("./helpers/payloadBuilder");
const NOTIFIER = require("./helpers/notify");
const { notificationLogger } = require("./helpers/notificationLogger");

class AppNotification {
  constructor(payload) {
    this.payload = payload;
  }

  action(action) {
    this.actionType = action;
    return this;
  }

  type(type) {
    this.notificationType = type;
    return this;
  }

  // notifyStreamBased() {
  //   // let payload = JSON.parse(JSON.stringify(this.payload));
  //   let sourceStream = new stream.PassThrough();
  //   sourceStream.write(JSON.stringify(this.payload));
  //   sourceStream.end();
  //   sourceStream
  //     .pipe(validateStream())
  //     .pipe(transfromStream())
  //     .pipe(notifyStream());
  // }

  async notify() {
    try {
      var data = Object.assign({}, this.payload);
      console.log("data at notify", data);
      let validData = await validator(data)
        .type(this.notificationType)
        .isValid();
      //console.log("validData", validData);
      if (validData) {
        // console.log("notification type", this.notificationType);
        // console.log("action type", this.actionType);
        let buildPayload = payloadBuilder(validData)
          .type(this.notificationType)
          .action(this.actionType)
          .getBuild();
        // console.log("buildPayload", buildPayload);
        NOTIFIER(buildPayload)
          .connect()
          .sendNotification();
        notificationLogger.success(
          "notification send successfully with payload",
          buildPayload
        );
      } else {
        notificationLogger.error("invalid payload:", validData);
      }
    } catch (err) {
      notificationLogger.error("notification not send due to error", data, err);
    }
  }
}

module.exports = payload => {
  return new AppNotification(payload);
};
