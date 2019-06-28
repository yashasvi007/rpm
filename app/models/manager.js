const mongoose = require("mongoose");

const ManagerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true
    }
  },
  {
    collection: "managers",
    timestamps: true
  }
);

ManagerSchema.statics = {
  async findByIdAsync(id) {
    let result = await this.findById(id);
    return result;
  }
};

module.exports = mongoose.model("Manager", ManagerSchema);
