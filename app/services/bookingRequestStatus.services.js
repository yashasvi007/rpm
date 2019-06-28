const BookingRequestStatus = require("../models/bookingRequestStatus");
const Log = require("../../libs/log")("bookingRequestStatus.services");

class BookingRequestStatusServices {
  constructor() {}

  async getBookingRequestStatusForProviderAppointmentHistory() {
    try {
      let statuses = await BookingRequestStatus.find()
        .where("name")
        .in(["Rejected", "Completed"]);

      return statuses;
    } catch (err) {
      "Error while fetching booking request status for provider appointment history",
        err;
      Log.errLog(
        500,
        "getBookingRequestStatusForProviderAppointmentHistory",
        err
      );
    }
  }
}

module.exports = new BookingRequestStatusServices();
