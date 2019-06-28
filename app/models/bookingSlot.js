const mongoose = require("mongoose");

const BookingSlotSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true
    },
    slots: {
      type: Object
    }
  },
  {
    collection: "bookingSlots",
    timestamps: true
  }
);

BookingSlotSchema.statics = {
  async findByIdAsync(id) {
    let result = await this.findById(id);
    return result;
  }
};

module.exports = mongoose.model("BookingSlot", BookingSlotSchema);
