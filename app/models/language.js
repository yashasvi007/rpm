const mongoose = require("mongoose");

const LanguageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  {
    collection: "languages",
    timestamps: true
  }
);

LanguageSchema.statics = {
  async findByIdAsync(id) {
    let result = await this.findById(id);
    return result;
  }
};

module.exports = mongoose.model("Language", LanguageSchema);
