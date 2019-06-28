const AWS = require("aws-sdk");
const log = require("../../../libs/log")("communications ---> smsManger");

class SmsManager {
  constructor() {
    AWS.config.update({
      accessKeyId: process.config.aws.access_key_id,
      secretAccessKey: process.config.aws.access_key,
      region: process.config.aws.region
    });

    this.TopicArn = process.config.aws.topic_arn;

    this.sns = new AWS.SNS();
  }

  async sendSms(smsPayload) {
    try {
      log.info("validating sms payload!!");

      let isSmsDataValid = this.smsDataValidator(smsPayload);
      if (isSmsDataValid.error && isSmsDataValid.error == 1)
        return isSmsDataValid;

      log.success("Sms payload is valid!!");

      log.info("transforming sms payload to aws payload!!");
      let smsData = this.smsDataTransformer(smsPayload);
      log.info("Sms payload successfully transformed!!");

      log.info(`Sending SMS...!!`);

      let smsPublishResponse = await this.sns
        .publish(smsData, (err, data) => {
          if (err) {
            log.info("sending sms error.........!!", err);
          }
          if (data) {
            log.info("sms sent...........!!", data);
          }
        })
        .promise();
      return smsPublishResponse;
    } catch (err) {}
  }

  smsDataTransformer(smsData) {
    let smsTransformedData = new Object();
    smsTransformedData.PhoneNumber = smsData.phonenumber;
    smsTransformedData.Message = smsData.message;
    smsTransformedData.MessageStructure = smsData.messageStructure || "string";
    smsTransformedData.Subject = smsData.Subject || "EconsultingAppWaala";
    // smsTransformedData.TopicArn = this.TopicArn;
    return smsTransformedData;
  }

  async smsDataValidator(smsData) {
    if (!smsData.phonenumber)
      return {
        error: 1,
        message: "invalid or empty phone number!!"
      };

    if (!smsData.message)
      return {
        error: 1,
        message: "message can't be empty"
      };
    return {
      error: 0,
      message: "valid"
    };
  }
}

module.exports = new SmsManager();
