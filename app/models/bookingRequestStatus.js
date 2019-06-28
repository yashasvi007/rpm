const mongoose = require("mongoose");

const BookingRequestStatusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      index: true
    }
  },
  {
    collection: "bookingrequeststatuses",
    timestamps: true
  }
);

BookingRequestStatusSchema.statics = {
  async findByIdAsync(id) {
    let result = await this.findById(id);
    return result;
  }
};

module.exports = mongoose.model(
  "BookingRequestStatus",
  BookingRequestStatusSchema
);
