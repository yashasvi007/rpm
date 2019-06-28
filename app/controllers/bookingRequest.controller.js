const bookingSlotService = require("../services/bookingSlot.services");
const bookingRequestService = require("../services/bookingRequest.services");
const Log = require("../../libs/log")("bookingRequest.controller");
const {
  MANAGER_BOOKING_REQUEST_APPROVED,
  MANAGER_BOOKING_REQUEST_REJECTED
} = require("../../config/constants");

class BookingRequestController {
  /**
   * 
   * @api {POST} /createBookingRequest Confirm Booking Request
   * @apiName createBookingRequest
   * @apiGroup BookingRequest
   * @apiVersion  1.0.0
   * 
   * 
   * 
   * @apiSuccess (200) {JSON} bookingDetail details of booking
   * 
   * @apiParamExample  {type} Request-Example:
    {
      "providerId":"5b7a8d3b64a7a063e3122f9d",
      "memberId":"5b7a6f1daaf92c61c5d782c3",
      "date":"2018-09-22",
      "time":11,
      "cityId":"5b72b726c13f777fc4cd37b5",
      "hasConsented":1,
      "documentUrl":"",
      "assignedTo":"5b7a6d12f77dfc61259b6e8a",
      "statusId":"5b7a6299d087675f2841a684",
      "concern":"Headache"
    }
   * 
   * 
   * @apiSuccessExample {type} Success-Response:
  {
    "hasConsented": 1,
    "_id": "5b7e7d60677d4a0b65a82f42",
    "providerId": "5b7a8d3b64a7a063e3122f9d",
    "memberId": "5b7a6f1daaf92c61c5d782c3",
    "date": "2018-09-22T00:00:00.000Z",
    "time": 11,
    "cityId": "5b72b726c13f777fc4cd37b5",
    "documentUrl": "",
    "assignedTo": "5b7a6d12f77dfc61259b6e8a",
    "statusId": "5b7a6299d087675f2841a684",
    "concern": "Headache",
    "createdAt": "2018-08-23T09:24:48.087Z",
    "updatedAt": "2018-08-23T09:24:48.087Z",
    "__v": 0,
    "mailResponse": {
        "ResponseMetadata": {
            "RequestId": "61c57876-a6b6-11e8-8ec1-e9d841ca9efd"
        },
        "MessageId": "010201656619c2b6-18c0b3e1-26db-4717-bdd4-6e80795a5e69-000000"
    }
  }
   * 
   * 
   */
  async createBookingRequest(req, res) {
    try {
      let postData = req.body;
      let providerId = req.body.providerId;
      let memberId = req.body.memberId;
      let date = req.body.date;
      let timeSlot = req.body.time;

      if (req.body.hasConsented) {
        let slotCreated = await bookingSlotService.updateOrCreateSlot(
          providerId,
          memberId,
          date,
          timeSlot
        );

        if (slotCreated) {
          let response = await bookingRequestService.createBookingRequest(
            postData
          );

          res.send(response);
        } else {
          res.send({ err: 500, message: "Error while creating slot" });
        }
      } else {
        res.send({ err: 500, message: "member has not consented" });
      }
    } catch (err) {
      res.send({ err: 500, message: "unable to confirm booking request" });
    }
  }

  /**
   * 
   * @api {GET} /getAllBookingRequests Get all booking requests
   * @apiName getAllBookingRequests
   * @apiGroup BookingRequest
   * @apiVersion  1.0.0
   * 
   * 
   * @apiSuccess (200) {Array} bookingRequests array of booking Requests
   * 
   * @apiParamExample  {type} Request-Example:
   * {
   *     
   * }
   * 
   * 
   * @apiSuccessExample {type} Success-Response: 
   [
    {
        "hasConsented": 0,
        "_id": "5b7ba9f805d804730a34557a",
        "providerId": "5b7a8d3b64a7a063e3122f9d",
        "memberId": "5b7a6f1daaf92c61c5d782c3",
        "date": "2018-08-21T00:00:00.000Z",
        "time": 10,
        "cityId": "5b72b726c13f777fc4cd37b5",
        "documentUrl": "",
        "assignedTo": "5b7a6d12f77dfc61259b6e8a",
        "statusId": "5b7a6299d087675f2841a684",
        "concern": "Headache",
        "createdAt": "2018-08-21T05:58:16.071Z",
        "updatedAt": "2018-08-21T05:58:16.071Z",
        "__v": 0
    },
    {
        "hasConsented": 0,
        "_id": "5b7be33df309d37b1b1a2150",
        "providerId": "5b7a8d3b64a7a063e3122f9d",
        "memberId": "5b7a6f1daaf92c61c5d782c3",
        "date": "2018-08-20T07:41:29.371Z",
        "time": 10,
        "cityId": "5b72b726c13f777fc4cd37b5",
        "documentUrl": "",
        "assignedTo": "5b7a6d12f77dfc61259b6e8a",
        "statusId": "5b7a6299d087675f2841a684",
        "concern": "Headache",
        "createdAt": "2018-08-21T10:02:37.188Z",
        "updatedAt": "2018-08-21T10:02:37.188Z",
        "__v": 0
    }
  ]
   * 
   * 
   */
  async getAllBookingRequests(req, res) {
    try {
      let response = await bookingRequestService.getAllBookingRequests();
      res.send(response);
    } catch (err) {
      res.send({ error: 500, message: "unable to fetch bookingRequests" });
    }
  }

  async getBookingRequest(req, res) {
    try {
      let id = req.body.id;
      let response = null;
      if (req.body.providerId && req.body.dateRange && req.body.type) {
        response = await bookingRequestService.getBookingRequestByDateAndProviderId(
          req.body.providerId,
          req.body.dateRange,
          req.body.type
        );
      } else {
        response = await bookingRequestService.getBookingRequest(id);
      }

      res.send(response);
    } catch (err) {
      res.send({ error: 500, message: "unable to fetch bookingRequest" });
    }
  }

  async getApprovedBookingRequest(req, res) {
    try {
      let providerId = req.body.providerId;
      let dateRange = req.body.dataRange;
      let response = await bookingRequestService.getBookingRequestByDateAndProviderId(
        providerId,
        dateRange
      );
      res.send(response);
    } catch (err) {
      res.send({ error: 500, message: "unable to fetch bookingRequest" });
    }
  }

  async getManagersBookingRequests(req, res) {
    try {
      let managerId = req.body.managerId;
      let bookingRequestsResponse = await bookingRequestService.getManagersBookingRequests(
        managerId
      );
      res.send(bookingRequestsResponse);
    } catch (err) {
      res.send({
        error: 500,
        message: "unable to fetch bookingRequests for manager"
      });
    }
  }

  async confirmRejectBookingRequestByManager(req, res) {
    try {
      let { bookingRequestId, confirmCode } = req.body;
      let updatedBookingRequest;
      if (confirmCode == MANAGER_BOOKING_REQUEST_APPROVED) {
        let slotBookingSuccessful = await bookingSlotService.checkSlotAvailableAndBook(
          bookingRequestId
        );
        if (slotBookingSuccessful) {
          updatedBookingRequest = await bookingRequestService.changeBookingRequestStatus(
            bookingRequestId,
            confirmCode
          );
        } else {
          res.send({
            error: 500,
            message:
              "unable to confirm booking request as slot is already booked"
          });
        }
      } else if (confirmCode == MANAGER_BOOKING_REQUEST_REJECTED) {
        updatedBookingRequest = await bookingRequestService.changeBookingRequestStatus(
          bookingRequestId,
          confirmCode
        );
      }

      res.send(updatedBookingRequest);
    } catch (err) {
      res.send({ err: 500, message: "unable to update booking request" });
    }
  }

  async rejectBookingRequest(req, res) {
    try {
    } catch (err) {
      res.send({ err: 500, message: "unable to reject booking request" });
    }
  }

  async uploadDocuments(req, res) {
    try {
      let savedDocumentUrls = await bookingRequestService.uploadDocument(
        req.body.documentUrls,
        req.body.documentTypes
      );

      res.send(savedDocumentUrls);
    } catch (err) {
      res.send({ err: 500, message: "unable to upload documents" });
    }
  }
}

module.exports = new BookingRequestController();
