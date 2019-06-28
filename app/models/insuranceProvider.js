const mongoose = require("mongoose");

const insuranceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    isActive: {
      type: Boolean, 
      default: false
    }
  },
  {
    collection: "insuranceProvider",
    timestamps: true
  }
);

module.exports = mongoose.model("insuranceProvider", insuranceProviderSchema);
