let LanguageService = require("../services/language.services");
const Log = require("../../libs/log")("language.controller");

class LanguageController {
  async getAllLanguages(req, res) {
    try {
      let languages = await LanguageService.getAllLanguages();
      res.send(languages);
    } catch (err) {
      res.send({ error: 500, message: "unable to fetch languages" });
    }
  }

  async getLanguage(req, res) {
    try {
      let languageId = req.body.languageId;
      let language = await LanguageService.getLanguage(languageId);
      res.send(language);
    } catch (err) {
      res.send({ error: 500, message: "unable to fetch language" });
    }
  }

  async addLanguage(req, res) {
    try {
      let language = await LanguageService.addLanguage(req.body);
      res.send(language);
    } catch (err) {
      res.send({ error: 500, message: "unable to add language" });
    }
  }

  async updateLanguage(req, res) {
    try {
      let id = req.body.id;
      let langData = req.body.name;
      let response = await LanguageService.updateLanguage(id, langData);
      res.send(response);
    } catch (err) {
      res.send({ error: 500, message: "unable to update language" });
    }
  }
}

module.exports = new LanguageController();
