const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  {
    collection: "countries",
    timestamps: true
  }
);

CountrySchema.statics = {
  async findByIdAsync(id) {
    let result = await this.findById(id);
    return result;
  }
};

module.exports = mongoose.model("Country", CountrySchema);
