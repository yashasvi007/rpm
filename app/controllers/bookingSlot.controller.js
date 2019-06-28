const bookingSlotService = require("../services/bookingSlot.services");
const Log = require("../../libs/log")("bookingSlot.controller");

class BookingSlotController {
  async getBookingSlots(req, res) {
    try {
      let providerId = req.body.providerId;
      let date = req.body.date;
      let bookingSlots = await bookingSlotService.getBookingSlots(
        providerId,
        date
      );

      res.send(bookingSlots);
    } catch (err) {
      res.send({ err: 501, message: "unable to get booking slots" });
    }
  }
}

module.exports = new BookingSlotController();
