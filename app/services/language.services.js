const Language = require("../models/language");
const Log = require("../../libs/log")("language.services");

class LanguageService {
  async getAllLanguages() {
    try {
      let languages = await Language.find();
      return languages;
    } catch (err) {
      Log.errLog(500, "getAllLanguages", err);
    }
  }

  async getLanguage(languageId) {
    try {
      let language = await Language.findById(languageId);
      return language;
    } catch (err) {
      Log.errLog(500, "getLanguage", err);
    }
  }

  async addLanguage(langData) {
    try {
      let language = await Language.create(langData);
      return language;
    } catch (err) {
      Log.errLog(500, "addLanguage", err);
    }
  }

  async updateLanguage(id, langData) {
    try {
      let language = await Language.findByIdAndUpdate(
        id,
        {
          name: langData
        },
        { new: true }
      );

      return language;
    } catch (err) {
      Log.errLog(500, "updateLanguage", err);
    }
  }
}

module.exports = new LanguageService();
