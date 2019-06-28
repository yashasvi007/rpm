const mongoose = require("mongoose");
const collectionName = "medicalConditions";
const modelName = "medicalCondition";

const medicalConditionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", index: true },
    basicCondition: {
      _id: false,
      chiefComplaint: { type: String },
      allergies: { type: String }, //seperated with commas
      surgeriesOrFracture: { type: String }, //seperated with commas
      others: { type: String } //seperated with commas
    },
    vitals: [
      {
        _id: false,
        updatedAt: { type: Date },
        temperatureUnit: { type: "String", enum: ["c", "f"] },
        temperature: { type: Number },
        respirationRate: { type: Number },
        pulse: { type: Number },
        bloodPressure: { type: String }
      }
    ],
    clinicalReadings: { type: Object } //like [TEST_TYPE1:{},TEST_TYPE2:{}]
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model(modelName, medicalConditionSchema);
