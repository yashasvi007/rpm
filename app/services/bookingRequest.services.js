const AWS = require("aws-sdk");
var s3Bucket = new AWS.S3({
  accessKeyId: process.config.aws.access_key_id,
  secretAccessKey: process.config.aws.access_key,
  params: { Bucket: process.config.aws.aws_booking_request_bucket }
});
const BookingRequest = require("../models/bookingRequest");
const BookingRequestStatus = require("../models/bookingRequestStatus");
const managerService = require("./manager.services");
const Log = require("../../libs/log")("bookingRequest.services");
const mailService = require("../communications/email/emailManger");
const globalEventEmitter = require("../globals/globalEventEmitter");
const globalConstants = require("../globals/globalContants");

class BookingRequestServices {
  constructor() {}

  async createBookingRequest(bookingData) {
    try {
      let manager = await managerService.getManager({
        cityId: bookingData.cityId
      });

      let bookingRequestStatus = await BookingRequestStatus.findOne({
        name: "Submitted"
      });

      bookingData["assignedTo"] = manager._id;
      bookingData["statusId"] = bookingRequestStatus._id;
      if (bookingData.documentUrls && bookingData.documentUrls.length > 0) {
        let documentsData = [];
        bookingData.documentUrls.map((docurl, index) => {
          let document = {};
          document["name"] = bookingData.documentNames[index];
          document["url"] = docurl;
          documentsData.push(document);
        });
        bookingData["documents"] = documentsData;
      }
      // if (bookingData.documentUrls && bookingData.documentUrls.length > 0) {
      //
      //   let buf = new Buffer(
      //     bookingData.documentUrl.replace(/^data:image\/\w+;base64,/, ""),
      //     "base64"
      //   );
      //   let timestamp = Date.now();
      //   let key = bookingData.providerId + "-document-image-" + timestamp;
      //   let uploadData = {
      //     Key: key,
      //     Body: buf,
      //     ContentEncoding: "base64",
      //     ContentType: "image/jpeg"
      //   };
      //
      //   let response = await s3Bucket.putObject(uploadData).promise();
      //
      //   bookingData["documentUrl"] =
      //     "https://s3.us-east-2.amazonaws.com/e-consulting-store/bookingRequestDocuments/" +
      //     key;
      // }
      let result = await BookingRequest.create(bookingData);

      let mailResponse;
      if (result) {
        let globalEventObj = globalEventEmitter.getInstance();
        globalEventObj.emit(
          globalConstants.BOOKING_REQUEST_SUBMITTED_USER,
          result._id
        );
        // mailResponse = await mailService.sendEmail({
        //   toAddress: ["yranjan@in.imshealth.com"],
        //   title: "WELCOME",
        //   templateData: {
        //     firstname: "Jennifer",
        //     lastname: "Lawrence",
        //     topic: "Success",
        //     fb_url:
        //       "http://localhost:3000/feedback/getQtns?pid=5b50597e1fbc1eec86e19c26&qid=5b50d9dde713d11657aa66e6&uid=5b51a3946c303d133b0ef5d5"
        //   },
        //   templateName: "general",
        //   userid: "dasdasdasdsadad"
        // });
        //
      }
      //
      // let new_result = result.toJSON();
      // new_result["mailResponse"] = mailResponse;
      return result;
    } catch (err) {
      Log.errLog(500, "createBookingRequest", err);
    }
  }

  async getAllBookingRequests() {
    try {
      let result = await BookingRequest.find();
      return result;
    } catch (err) {
      Log.errLog(500, "getAllBookingRequests", err);
    }
  }

  async getBookingRequest(id) {
    try {
      let bookinRequest = await BookingRequest.findById(id)
        .populate("providerId")
        .populate("memberId")
        .populate("cityId")
        .populate("assignedTo")
        .populate("statusId");
      return bookinRequest;
    } catch (err) {
      Log.errLog(500, "getBookingRequest", err);
    }
  }

  async getBookingRequestByDateAndProviderId(providerId, dateRange, type) {
    try {
      let bookingTypeId = await BookingRequestStatus.find({ name: type });

      let bookingRequest = await BookingRequest.find({
        providerId: providerId,
        statusId: bookingTypeId[0]["_id"],
        date: {
          $gte: new Date(dateRange[0]),
          $lte: new Date(dateRange[1])
        }
      })
        .populate("providerId")
        .populate("memberId")
        .populate("cityId")
        .populate("assignedTo")
        .populate("statusId");

      return bookingRequest;
    } catch (err) {
      Log.errLog(500, "getBookingRequestByDateAndProviderId", err);
    }
  }

  async getManagersBookingRequests(managerId) {
    try {
      let bookingRequests = await BookingRequest.find({
        assignedTo: managerId
      });

      return bookingRequests;
    } catch (err) {
      Log.errLog(500, "getManagersBookingRequests", err);
    }
  }

  async changeBookingRequestStatus(bookingId, status) {
    try {
      let bookingRequestStatus;
      if (status == 1) {
        bookingRequestStatus = await BookingRequestStatus.findOne({
          name: "Approved"
        });
      } else if (status == 2) {
        bookingRequestStatus = await BookingRequestStatus.findOne({
          name: "Rejected"
        });
      } else if (status == 3) {
        bookingRequestStatus = await BookingRequestStatus.findOne({
          name: "Completed"
        });
      }
      let updatedBookingRequest = await BookingRequest.findByIdAndUpdate(
        bookingId,
        { statusId: bookingRequestStatus.id },
        { new: true }
      );
      //Trigger mail
      //Update updatedBookingRequest with mail data
      return updatedBookingRequest;
    } catch (err) {
      Log.errLog(500, "changeBookingRequestStatus", err);
    }
  }

  async uploadDocument(documentUrls, documentTypes) {
    try {
      let documets = documentUrls.map(async (doc, index) => {
        let buf = new Buffer(
          doc.replace(/^data:\w+\/\w+;base64,/, ""),
          "base64"
        );
        let timestamp = Date.now();
        let key = "document-image-" + timestamp;
        let uploadData = {
          Key: key,
          Body: buf,
          ContentEncoding: "base64",
          ContentType: documentTypes[index]
        };

        //
        let response = await s3Bucket.putObject(uploadData).promise();

        return (
          "https://s3.us-east-2.amazonaws.com/e-consulting-store/bookingRequestDocuments/" +
          key
        );
      });
      return Promise.all(documets).then(results => {
        return results;
      });
    } catch (err) {
      Log.errLog(500, "uploadDocument", err);
    }
  }
}

module.exports = new BookingRequestServices();
