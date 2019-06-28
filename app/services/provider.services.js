const AWS = require("aws-sdk");
//AWS.config.loadFromPath("./s3_config.json");
var s3Bucket = new AWS.S3({
  params: { Bucket: process.config.aws.aws_provider_bucket }
});
const Speciality = require("../models/speciality");
const Language = require("../models/language");
const Provider = require("../models/provider");
const BookingRequest = require("../models/bookingRequest");
const Log = require("../../libs/log")("provider.services");

class ProviderServices {
  async addProvider(providerData) {
    try {
      if (providerData.photoUrl.length > 0) {
        let buf = new Buffer(
          providerData.photoUrl.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        let timstamp = Date.now();
        let key = providerData.email + "-image-" + timstamp;
        let data = {
          Key: key,
          Body: buf,
          ContentEncoding: "base64",
          ContentType: "image/jpeg"
        };

        let response = await s3Bucket.putObject(data).promise();

        providerData.photoUrl =
          "https://s3.us-east-2.amazonaws.com/e-consulting-store/providers/" +
          key;
      }
      let response = await Provider.create(providerData);
      return response;
    } catch (err) {
      Log.errLog(500, "addProvider", err);
    }
  }

  async getAllProviders() {
    try {
      let result = await Provider.find()
        .populate("specialityId")
        .populate("cityId")
        .populate("languages");
      return result;
    } catch (err) {
      Log.errLog(500, "getAllProviders", err);
    }
  }

  async getProvidersByCityAndSpecs(cityid, specialityid) {
    try {
      let result = await Provider.find({
        cityId: cityid,
        specialityId: specialityid
      })
        .populate("specialityId")
        .populate("cityId")
        .populate("languages");
      return result;
    } catch (err) {
      Log.errLog(500, "getProvidersByCity", err);
    }
  }

  async getProvider(param) {
    try {
      let provider = await Provider.findOne(param);

      return provider;
    } catch (err) {
      Log.errLog(500, "getProvider", err);
    }
  }

  async getProviderAppointmentHistory(param) {
    try {
      let appointments = BookingRequest.find()
        .where("date")
        .equals(param.date)
        .where("providerId")
        .equals(param.providerId)
        .where("statusId")
        .in(param.statusIds)
        .populate("memberId")
        .populate("providerId")
        .populate("statusId")
        .populate("cityId")
        .sort("time");
      return appointments;
    } catch (err) {
      Log.errLog(500, "getProviderAppointmentHistory", err);
    }
  }
}

module.exports = new ProviderServices();
