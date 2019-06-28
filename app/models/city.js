const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true
    }
  },
  {
    collection: "cities",
    timestamps: true
  }
);

CitySchema.statics = {
  async findByIdAsync(id) {
    let result = await this.findById(id);
    return result;
  }
};

module.exports = mongoose.model("City", CitySchema);
