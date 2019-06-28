const BookingSlot = require("../models/bookingSlot");
const BookingRequest = require("../models/bookingRequest");
const Log = require("../../libs/log")("bookingSlot.services");
const { BOOKING_SLOTS } = require("../../config/constants");

class BookingSlotServices {
  constructor() {}

  async updateOrCreateSlot(providerId, memberId, date, timeSlot) {
    try {
      let result = await BookingSlot.findOne({ providerId, date });

      if (result) {
        return true;
        // if (Object.keys(result.slots).indexOf("" + timeSlot) != -1) {
        //
        //   return true;
        // } else {
        //
        //   const slot = result.slots;
        //   slot[timeSlot] = {};
        //   slot[timeSlot]["status"] = "pending";
        //   const updatedBookingSlot = await BookingSlot.findOneAndUpdate(
        //     result.id,
        //     { slots: slot },
        //     { new: true }
        //   );
        //   return true;
        // }
      } else {
        const slot = BOOKING_SLOTS;
        //slot[timeSlot] = {};
        //slot[timeSlot]["status"] = "pending";
        const bookingSlot = await BookingSlot.create({
          providerId,
          memberId,
          date,
          slots: slot
        });

        return true;
      }
    } catch (err) {
      Log.errLog(500, "updateOrCreateSlot", err);
    }
  }

  async checkSlotAvailableAndBook(bookingId) {
    try {
      let bookingRequest = await BookingRequest.findById(bookingId);

      let { providerId, date } = bookingRequest;
      let bookingSlot = await BookingSlot.findOne({ providerId, date });
      let slots = bookingSlot.slots;
      if (slots[bookingRequest.time].status == "pending") {
        slots[bookingRequest.time].status = "booked";

        let updatedBookingSlot = await BookingSlot.findByIdAndUpdate(
          bookingSlot.id,
          { slots },
          { new: true }
        );

        return true;
      } else return false;
    } catch (err) {
      Log.errLog(500, "checkSlotAvailableAndBook", err);
    }
  }

  async getBookingSlots(providerId, date) {
    try {
      let bookingSlots = await BookingSlot.findOne({ providerId, date });

      if (bookingSlots) {
        let slots = bookingSlots.slots;
        return slots;
      } else {
        //booked
        let createdSlots = BOOKING_SLOTS;
        return createdSlots;
      }
      return slots;
    } catch (err) {
      Log.errLog(500, "getBookingSlots", err);
    }
  }
}

module.exports = new BookingSlotServices();
