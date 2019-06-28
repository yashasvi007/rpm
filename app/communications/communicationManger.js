const globalEventEmitter = require("../globals/globalEventEmitter");
const globalConstant = require("../globals/globalContants");
const BookingRequestService = require("../services/bookingRequest.services");
const emailManager = require("./email/emailManger");
const smsManager = require("./sms/smsManger");
const pnManager = require("./PN/pnManger");

class CommunicationManger {
  constructor() {}
  async sendCommunicationsForBookingRequestSubmittedUser(bookingRequestId) {
    try {
      if (!bookingRequestId)
        return {
          error: 1,
          message: "undefined booking id"
        };
      let BookingRequestData = await BookingRequestService.getBookingRequest(
        bookingRequestId
      );
      let templateData = new Object();
      templateData.bookingRequestId = BookingRequestData.memberId._id;
      templateData.firstname = BookingRequestData.memberId.firstName;
      templateData.lastname = BookingRequestData.memberId.lastName;
      templateData.email = BookingRequestData.memberId.email;
      templateData.phone = BookingRequestData.memberId.phone;

      let emailPayload = {
        toAddress: [
          "yranjan@in.imshealth.com" || BookingRequestData.memberId.email
        ],
        title: `Booking request ${BookingRequestData._id} Submitted!!`,
        templateData: templateData,
        templateName: "BookingStatusSubmittedUser",
        userid: BookingRequestData.memberId._id
      };

      let emailResponse = await emailManager.sendEmail(emailPayload);
      let smsPayload = {
        recieverNumbers: "7892317781" || BookingRequestData.memberId.phone,
        sender: "econsulting_chokra!!",
        countryCode: "91",
        message: `Hi ${BookingRequestData.memberId.firstName +
          " " +
          BookingRequestData.memberId.lastName} ${
          BookingRequestData._id
        } is submitted!!`
      };

      let smsResponse = await smsManager.sendSms(smsPayload);
      let pnPayload = {
        type: "android",
        data: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been approved`,
          title: "Booking Submitted!!"
        },
        notification: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been approved`,
          title: "Booking Submitted!!"
        }
      };

      // let pnResponse = await pnManager.sendPN(pnPayload, process.config.aws.device_token);

      let socket = await globalSocketPromise;
      socket.emit("BookingStatusSubmittedUser", {
        body: `Booking Request id ${BookingRequestData._id} has been approved`,
        title: "Booking Submitted!!"
      });
    } catch (err) {}
  }

  async sendCommunicationsForBookingRequestSubmittedManager(bookingRequestId) {
    try {
      if (!bookingRequestId)
        return {
          error: 1,
          message: "undefined booking id"
        };
      let BookingRequestData = await BookingRequestService.getBookingRequest(
        bookingRequestId
      );
      let templateData = new Object();
      templateData.bookingRequestId = BookingRequestData._id;
      templateData.mangerFirstName = BookingRequestData.assignedTo.firstName;
      templateData.mangerLastName = BookingRequestData.assignedTo.lastName;
      templateData.mangerEmail = BookingRequestData.assignedTo.email;
      templateData.memberFirstName = BookingRequestData.memberId.firstName;
      templateData.memberLastName = BookingRequestData.memberId.lastName;
      templateData.memberEmail = BookingRequestData.memberId.email;
      templateData.memberPhone = BookingRequestData.memberId.phone;
      templateData.providerFirstName = BookingRequestData.providerId.firstName;
      templateData.providerLastName = BookingRequestData.providerId.lastName;
      templateData.providerEmail = BookingRequestData.providerId.email;

      let emailPayload = {
        toAddress: [
          "yranjan@in.imshealth.com" || BookingRequestData.assignedTo.email
        ],
        title: `Booking request ${BookingRequestData._id} created!!`,
        templateData: templateData,
        templateName: "BookingStatusSubmittedManager",
        userid: BookingRequestData.memberId._id
      };

      let emailResponse = await emailManager.sendEmail(emailPayload);

      let smsPayload = {
        recieverNumbers: "7892317781" || BookingRequestData.assignedTo.phone,
        sender: "econsulting_chokra!!",
        countryCode: "91",
        message: `Hi ${BookingRequestData.assignedTo.firstName +
          " " +
          BookingRequestData.assignedTo.lastName} ${
          BookingRequestData._id
        } Created!!`
      };

      let smsResponse = await smsManager.sendSms(smsPayload);

      let pnPayload = {
        type: "android",
        data: {
          body: `Booking Request id ${BookingRequestData._id} has been created`,
          title: "Booking Created!!"
        },
        notification: {
          body: `Booking Request id ${BookingRequestData._id} has been created`,
          title: "Booking Created!!"
        }
      };

      // let pnResponse = await pnManager.sendPN(pnPayload, process.config.aws.device_token);
      //
      let socket = await globalSocketPromise;

      socket.emit("BookingStatusSubmittedManager", {
        body: `Booking Request id ${BookingRequestData._id} has been approved`,
        title: "Booking Submitted!!"
      });
    } catch (err) {}
  }

  async sendCommunicationsForBookingRequestStatusApprovedUser(
    bookingRequestId
  ) {
    try {
      if (!bookingRequestId)
        return {
          error: 1,
          message: "undefined booking id"
        };
      let BookingRequestData = await BookingRequestService.getBookingRequest(
        bookingRequestId
      );
      let templateData = new Object();
      templateData.bookingRequestId = BookingRequestData._id;
      templateData.userFirstName = BookingRequestData.memberId.firstName;
      templateData.userLastName = BookingRequestData.memberId.lastName;
      templateData.userEmail = BookingRequestData.memberId.email;
      templateData.userPhone = BookingRequestData.memberId.phone;
      templateData.providerFirstName = BookingRequestData.providerId.firstName;
      templateData.providerLastName = BookingRequestData.providerId.lastName;
      templateData.providerEmail = BookingRequestData.providerId.email;

      let emailPayload = {
        toAddress: [
          "yranjan@in.imshealth.com" || BookingRequestData.memberId.email
        ],
        title: `Booking request ${BookingRequestData._id} Approved!!`,
        templateData: templateData,
        templateName: "BookingStatusApprovedUser",
        userid: BookingRequestData.memberId._id
      };

      let emailResponse = await emailManager.sendEmail(emailPayload);

      let smsPayload = {
        recieverNumbers: "7892317781" || BookingRequestData.memberId.phone,
        sender: "econsulting_chokra!!",
        countryCode: "91",
        message: `Hi ${BookingRequestData.memberId.firstName +
          " " +
          BookingRequestData.memberId.lastName} ${
          BookingRequestData._id
        } has been Approved!!`
      };

      let smsResponse = await smsManager.sendSms(smsPayload);

      let pnPayload = {
        type: "android",
        data: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been approved`,
          title: "Booking approved!!"
        },
        notification: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been approved`,
          title: "Booking approved!!"
        }
      };

      // let pnResponse = await pnManager.sendPN(pnPayload, process.config.aws.device_token);
      //

      let socket = await globalSocketPromise;

      socket.emit("BookingStatusApprovedUser", {
        body: `Booking Request id ${BookingRequestData._id} has been approved`,
        title: "Booking Submitted!!"
      });
    } catch (err) {}
  }

  async sendCommunicationsForBookingRequestStatusApprovedProvider(
    bookingRequestId
  ) {
    try {
      if (!bookingRequestId)
        return {
          error: 1,
          message: "undefined booking id"
        };
      let BookingRequestData = await BookingRequestService.findById(
        bookingRequestId
      );
      let templateData = new Object();
      templateData.bookingRequestId = BookingRequestData._id;
      templateData.userFirstName = BookingRequestData.memberId.firstName;
      templateData.userLastName = BookingRequestData.memberId.lastName;
      templateData.userEmail = BookingRequestData.memberId.email;
      templateData.userPhone = BookingRequestData.memberId.phone;
      templateData.providerFirstName = BookingRequestData.providerId.firstName;
      templateData.providerLastName = BookingRequestData.providerId.lastName;
      templateData.providerEmail = BookingRequestData.providerId.email;

      let emailPayload = {
        toAddress: [
          "yranjan@in.imshealth.com" || BookingRequestData.memberId.email
        ],
        title: `Booking request ${BookingRequestData._id} Approved!!`,
        templateData: templateData,
        templateName: "BookingStatusApprovedProvider",
        userid: BookingRequestData.memberId._id
      };

      let emailResponse = await emailManager.sendEmail(emailPayload);

      let smsPayload = {
        recieverNumbers: "7892317781" || BookingRequestData.memberId.phone,
        sender: "econsulting_chokra!!",
        countryCode: "91",
        message: `Hi ${BookingRequestData.providerId.firstName +
          " " +
          BookingRequestData.providerId.lastName} ${
          BookingRequestData._id
        } has been Approved!!`
      };

      let smsResponse = await smsManager.sendSms(smsPayload);

      let pnPayload = {
        type: "android",
        data: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been approved`,
          title: "Booking approved!!"
        },
        notification: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been approved`,
          title: "Booking approved!!"
        }
      };

      // let pnResponse = await pnManager.sendPN(pnPayload, process.config.aws.device_token);
      //

      let socket = await globalSocketPromise;

      socket.emit("BookingStatusApprovedProvider", {
        body: `Booking Request id ${BookingRequestData._id} has been approved`,
        title: "Booking Submitted!!"
      });
    } catch (err) {}
  }

  async sendCommunicationsForBookingRequestRejectedUser(bookingRequestId) {
    try {
      if (!bookingRequestId)
        return {
          error: 1,
          message: "undefined booking id"
        };
      let BookingRequestData = await BookingRequestService.getBookingRequest(
        bookingRequestId
      );
      let templateData = new Object();
      templateData.bookingRequestId = BookingRequestData._id;
      templateData.userFirstName = BookingRequestData.memberId.firstName;
      templateData.userLastName = BookingRequestData.memberId.lastName;
      templateData.userEmail = BookingRequestData.memberId.email;
      templateData.userPhone = BookingRequestData.memberId.phone;
      templateData.providerFirstName = BookingRequestData.providerId.firstName;
      templateData.providerLastName = BookingRequestData.providerId.lastName;
      templateData.providerEmail = BookingRequestData.providerId.email;

      let emailPayload = {
        toAddress: [
          "yranjan@in.imshealth.com" || BookingRequestData.memberId.email
        ],
        title: `Booking request ${BookingRequestData._id} Rejected!!`,
        templateData: templateData,
        templateName: "BookingStatusRejectedUser",
        userid: BookingRequestData.memberId._id
      };

      let emailResponse = await emailManager.sendEmail(emailPayload);

      let smsPayload = {
        recieverNumbers: "7892317781" || BookingRequestData.memberId.phone,
        sender: "econsulting_chokra!!",
        countryCode: "91",
        message: `Hi ${BookingRequestData.memberId.firstName +
          " " +
          BookingRequestData.memberId.lastName} ${
          BookingRequestData._id
        } has been Rejected!!`
      };

      let smsResponse = await smsManager.sendSms(smsPayload);

      let pnPayload = {
        type: "android",
        data: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been rejected`,
          title: "Booking Rejected!!"
        },
        notification: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been rejected`,
          title: "Booking Rejected!!"
        }
      };

      //  let pnResponse = await pnManager.sendPN(pnPayload, process.config.aws.device_token);
      //

      let socket = await globalSocketPromise;

      socket.emit("BookingStatusRejectedUser", {
        body: `Booking Request id ${BookingRequestData._id} has been approved`,
        title: "Booking Submitted!!"
      });
    } catch (err) {}
  }

  async sendCommunicationsForBookingRequestRejectedProvider(bookingRequestId) {
    try {
      if (!bookingRequestId)
        return {
          error: 1,
          message: "undefined booking id"
        };
      let BookingRequestData = await BookingRequestService.getBookingRequest(
        bookingRequestId
      );
      let templateData = new Object();
      templateData.bookingRequestId = BookingRequestData._id;
      templateData.userFirstName = BookingRequestData.memberId.firstName;
      templateData.userLastName = BookingRequestData.memberId.lastName;
      templateData.userEmail = BookingRequestData.memberId.email;
      templateData.userPhone = BookingRequestData.memberId.phone;
      templateData.providerFirstName = BookingRequestData.providerId.firstName;
      templateData.providerLastName = BookingRequestData.providerId.lastName;
      templateData.providerEmail = BookingRequestData.providerId.email;

      let emailPayload = {
        toAddress: [
          "yranjan@in.imshealth.com" || BookingRequestData.memberId.email
        ],
        title: `Booking request ${BookingRequestData._id} Rejected!!`,
        templateData: templateData,
        templateName: "BookingStatusRejectedProvider",
        userid: BookingRequestData.memberId._id
      };

      let emailResponse = await emailManager.sendEmail(emailPayload);

      let smsPayload = {
        recieverNumbers: "7892317781" || BookingRequestData.memberId.phone,
        sender: "econsulting_chokra!!",
        countryCode: "91",
        message: `Hi ${BookingRequestData.providerId.firstName +
          " " +
          BookingRequestData.providerId.lastName} ${
          BookingRequestData._id
        } has been rejected!!`
      };

      let smsResponse = await smsManager.sendSms(smsPayload);

      let pnPayload = {
        type: "android",
        data: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been rejected`,
          title: "Booking Rejected!!"
        },
        notification: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been rejected`,
          title: "Booking Rejected!!"
        }
      };

      // let pnResponse = await pnManager.sendPN(pnPayload, process.config.aws.device_token);
      //

      let socket = await globalSocketPromise;

      socket.emit("BookingStatusRejectedProvider", {
        body: `Booking Request id ${BookingRequestData._id} has been approved`,
        title: "Booking Submitted!!"
      });
    } catch (err) {}
  }

  async sendCommunicationsForBookingRequestCompletedUser(bookingRequestId) {
    try {
      if (!bookingRequestId)
        return {
          error: 1,
          message: "undefined booking id"
        };
      let BookingRequestData = await BookingRequestService.getBookingRequest(
        bookingRequestId
      );
      let templateData = new Object();
      templateData.bookingRequestId = BookingRequestData._id;
      templateData.userFirstName = BookingRequestData.memberId.firstName;
      templateData.userLastName = BookingRequestData.memberId.lastName;
      templateData.userEmail = BookingRequestData.memberId.email;
      templateData.userPhone = BookingRequestData.memberId.phone;
      templateData.providerFirstName = BookingRequestData.providerId.firstName;
      templateData.providerLastName = BookingRequestData.providerId.lastName;
      templateData.providerEmail = BookingRequestData.providerId.email;

      let emailPayload = {
        toAddress: [
          "yranjan@in.imshealth.com" || BookingRequestData.memberId.email
        ],
        title: `Booking request ${BookingRequestData._id} Completed!!`,
        templateData: templateData,
        templateName: "BookingStatusCompletedUser",
        userid: BookingRequestData.memberId._id
      };

      let emailResponse = await emailManager.sendEmail(emailPayload);

      let smsPayload = {
        recieverNumbers: "7892317781" || BookingRequestData.memberId.phone,
        sender: "econsulting_chokra!!",
        countryCode: "91",
        message: `Hi ${BookingRequestData.memberId.firstName +
          " " +
          BookingRequestData.memberId.lastName} ${
          BookingRequestData._id
        } has been completed!!`
      };

      let smsResponse = await smsManager.sendSms(smsPayload);

      let pnPayload = {
        type: "android",
        data: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been completed`,
          title: "Booking Completed!!"
        },
        notification: {
          body: `Booking Request id ${
            BookingRequestData._id
          } has been completed`,
          title: "Booking Completed!!"
        }
      };

      // let pnResponse = await pnManager.sendPN(pnPayload, process.config.aws.device_token);
      //
      let socket = await globalSocketPromise;

      socket.emit("BookingStatusCompletedUser", {
        body: `Booking Request id ${BookingRequestData._id} has been approved`,
        title: "Booking Submitted!!"
      });
    } catch (err) {}
  }

  async sendCommunicationsForBookingRequestCompletedProvider(bookingRequestId) {
    try {
      if (!bookingRequestId)
        return {
          error: 1,
          message: "undefined booking id"
        };
      let BookingRequestData = await BookingRequestService.getBookingRequest(
        bookingRequestId
      );
      let templateData = new Object();
      templateData.bookingRequestId = BookingRequestData._id;
      templateData.userFirstName = BookingRequestData.memberId.firstName;
      templateData.userLastName = BookingRequestData.memberId.lastName;
      templateData.userEmail = BookingRequestData.memberId.email;
      templateData.userPhone = BookingRequestData.memberId.phone;
      templateData.providerFirstName = BookingRequestData.providerId.firstName;
      templateData.providerLastName = BookingRequestData.providerId.lastName;
      templateData.providerEmail = BookingRequestData.providerId.email;

      let emailPayload = {
        toAddress: [
          "yranjan@in.imshealth.com" || BookingRequestData.memberId.email
        ],
        title: `Booking request ${BookingRequestData._id} Closed!!`,
        templateData: templateData,
        templateName: "BookingStatusCompletedProvider",
        userid: BookingRequestData.memberId._id
      };

      let emailResponse = await emailManager.sendEmail(emailPayload);

      let smsPayload = {
        recieverNumbers: "7892317781" || BookingRequestData.memberId.phone,
        sender: "econsulting_chokra!!",
        countryCode: "91",
        message: `Hi ${BookingRequestData.providerId.firstName +
          " " +
          BookingRequestData.providerId.lastName} ${
          BookingRequestData._id
        } has been closed!!`
      };

      let smsResponse = await smsManager.sendSms(smsPayload);

      let pnPayload = {
        type: "android",
        data: {
          body: `Booking Request id ${BookingRequestData._id} has been closed`,
          title: "Booking closed!!"
        },
        notification: {
          body: `Booking Request id ${BookingRequestData._id} has been closed`,
          title: "Booking closed!!"
        }
      };

      //let pnResponse = await pnManager.sendPN(pnPayload, process.config.aws.device_token);
      //

      let socket = await globalSocketPromise;

      socket.emit("BookingStatusCompletedProvider", {
        body: `Booking Request id ${BookingRequestData._id} has been approved`,
        title: "Booking Submitted!!"
      });
    } catch (err) {}
  }

  initiateGlobalEmitter() {
    let self = this;
    globalEventEmitter.addSubscribers(
      globalConstant.BOOKING_REQUEST_SUBMITTED_USER,
      "sendCommunicationsForBookingRequestSubmittedUser",
      self.sendCommunicationsForBookingRequestSubmittedUser.bind(this)
    );
    globalEventEmitter.addSubscribers(
      globalConstant.BOOKING_REQUEST_SUBMITTED_MANAGER,
      "sendCommunicationsForBookingRequestSubmittedManger",
      self.sendCommunicationsForBookingRequestSubmittedManager.bind(this)
    );

    globalEventEmitter.addSubscribers(
      globalConstant.BOOKING_REQUEST_STATUS_APPROVED_USER,
      "sendCommunicationsForBookingRequestStatusApprovedUser ",
      self.sendCommunicationsForBookingRequestStatusApprovedUser.bind(this)
    );
    globalEventEmitter.addSubscribers(
      globalConstant.BOOKING_REQUEST_STATUS_APPROVED_PROVIDER,
      "sendCommunicationsForBookingRequestStatusApprovedProvider",
      self.sendCommunicationsForBookingRequestStatusApprovedProvider.bind(this)
    );

    globalEventEmitter.addSubscribers(
      globalConstant.BOOKING_REQUEST_STATUS_REJECTED_USER,
      "sendCommunicationsForBookingRequestRejectedUser",
      self.sendCommunicationsForBookingRequestRejectedUser.bind(this)
    );
    globalEventEmitter.addSubscribers(
      globalConstant.BOOKING_REQUEST_STATUS_REJECTED_PROVIDER,
      "sendCommunicationsForBookingRequestRejectedProvider",
      self.sendCommunicationsForBookingRequestRejectedProvider.bind(this)
    );

    globalEventEmitter.addSubscribers(
      globalConstant.BOOKING_REQUEST_STATUS_COMPLETED_USER,
      "sendCommunicationsForBookingRequestCompletedUser ",
      self.sendCommunicationsForBookingRequestCompletedUser.bind(this)
    );
    globalEventEmitter.addSubscribers(
      globalConstant.BOOKING_REQUEST_STATUS_COMPLETED_PROVIDER,
      "sendCommunicationsForBookingRequestCompletedProvider",
      self.sendCommunicationsForBookingRequestCompletedProvider.bind(this)
    );
  }
}

module.exports = CommunicationManger;
