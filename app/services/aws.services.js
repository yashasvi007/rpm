const AWS = require("aws-sdk");
const Log = require("../../libs/log")("aws.services");
const fs = require("fs");
let AWS_S3 = new AWS.S3({
  accessKeyId: process.config.aws.access_key_id,
  secretAccessKey: process.config.aws.access_key,
  params: { Bucket: process.config.aws.aws_provider_bucket }
});

class AWServices {
  constructor() {}
  async uploadDocument(doc) {
    try {
      let timestamp = Date.now();
      let key = `prescription-${doc.textData.key}-${timestamp}`;
      let bodyData = new Buffer(doc.fileData.document[0]);

      let uploadData = {
        Key: key,
        Body: doc.fileData.document[0],
        ContentType: doc.fileData.document[0].type
      };

      let response = await AWS_S3.putObject(uploadData).promise();

      return response;
    } catch (err) {
      Log.errLog(500, "uploadDocument", err);
    }
  }
}

module.exports = new AWServices();
