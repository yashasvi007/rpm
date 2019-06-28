const mongoose = require("mongoose");

const ProviderSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String
    },
    specialityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speciality",
      required: true
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true
    },
    bio: {
      type: String
    },
    photoUrl: {
      type: String
    },
    education: {
      type: String
    },
    languages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }],
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address"
      ]
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    tags: {
      type: String
    }
  },
  {
    collection: "providers",
    timestamps: true
  }
);

ProviderSchema.statics = {
  getFullName() {
    return this.firstName + " " + this.lastName;
  }
};

module.exports = mongoose.model("Provider", ProviderSchema);
