const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
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
    hasConsented: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    collection: "members",
    timestamps: true
  }
);

MemberSchema.statics = {
  async findByIdAsync(id) {
    let result = await this.findById(id);
    return result;
  }
};

module.exports = mongoose.model("Member", MemberSchema);
