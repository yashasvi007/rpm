let SpecialityService = require("../services/speciality.services");
const Log = require("../../libs/log")("speciality.controller");

class Speciality {
  async addSpeciality(req, res) {
    try {
      let specData = req.body;
      let response = await SpecialityService.addSpeciality(specData);
      res.send(response);
    } catch (err) {
      res.send({ error: 500, message: "unable to add speciality" });
    }
  }

  async getSpeciality(req, res) {
    try {
      let specData = req.body;
      let response = await SpecialityService.getSpeciality(specData);
      res.send(response);
    } catch (err) {
      res.send({ error: 500, message: "unable to fetch speciality" });
    }
  }

  async getAllSpecialities(req, res) {
    try {
      const response = await SpecialityService.getAllSpecialities();
      res.send(response);
    } catch (err) {
      res.send({ error: 500, message: "unable to fetch specialities" });
    }
  }

  async updateSpeciality(req, res) {
    try {
      let id = req.body.id;
      let specData = req.body.specialityName;
      let response = await SpecialityService.updateSpeciality(id, specData);
      res.send(response);
    } catch (err) {
      res.send({ error: 500, message: "unable to update speciality" });
    }
  }

  async deleteSpeciality(req, res) {
    try {
    } catch (err) {}
  }
}

module.exports = new Speciality();
