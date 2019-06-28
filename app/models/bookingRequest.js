const mongoose = require("mongoose");

const BookingRequestSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      index: true
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true
    },
    hasConsented: {
      type: Boolean,
      required: true,
      default: false
    },
    documents: {
      type: Array,
      default: []
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manager"
    },
    statusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookingRequestStatus"
    },
    concern: {
      type: String
    }
  },
  {
    collection: "bookingrequests",
    timestamps: true
  }
);

BookingRequestSchema.statics = {
  async findByIdAsync(id) {
    let result = await this.findById(id);
    return result;
  }
};

module.exports = mongoose.model("BookingRequest", BookingRequestSchema);
