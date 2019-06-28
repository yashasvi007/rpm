const mongoose = require("mongoose");
const collectionName = "programs";

const patients = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    patients: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user",
      default: []
    }
  },
  { _id: false }
);

const patientAndHospital = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "hospital" }
});

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    programCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    pharmaCo: { type: String },
    targetLocation: {
      _id: false,
      city: { type: String },
      country: { type: String }
    },
    description: { type: String },
    activeFrom: { type: Date, default: Date.now },
    expiresOn: { type: Date },
    products: { type: [mongoose.Schema.Types.ObjectId] },
    accessLevel: {
      type: String,
      enum: ["ALL_USERS", "CARE_COACHES", "DOCTORS"]
    },
    doctors: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        patients: [patientAndHospital]
      }
    ],
    careCoaches: [patients]
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("program", programSchema);
