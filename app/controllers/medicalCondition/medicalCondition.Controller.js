const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("medicalConditionController");
const medicalConditionService = require("../../services/medicalCondition/medicalCondition.service");

class MedicalConditionController {
  constructor() {}
  async editBasicCondition(req, res) {
    try {
      let response = new Response(true, 200);
      let medicalConditionId = req.params.id;

      const { body: data } = req;

      const editedBasicCondition = await medicalConditionService.updateBasicCondition(
        medicalConditionId,
        data
      );

      const medicalsData = { [medicalConditionId]: editedBasicCondition };
      response.setData({ medicalsData });
      response.setMessage("You have edited the basic Condition");
      res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async addVital(req, res) {
    try {
      let response = new Response(true, 200);
      let medicalConditionId = req.params.id;

      const { body: data } = req;

      const addedVitals = await medicalConditionService.addVitals(
        medicalConditionId,
        [data]
      );

      const medicalsData = { [medicalConditionId]: addedVitals };
      response.setData({ medicalsData });
      response.setMessage("You have edited the basic Condition");
      res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async updateClinicalReading(req, res) {
    try {
      let response = new Response(true, 200);
      let medicalConditionId = req.params.id;

      const { body: data } = req;

      const addedVitals = await medicalConditionService.updateClinicalReading(
        medicalConditionId,
        [data]
      );

      const medicalsData = { [medicalConditionId]: addedVitals };
      response.setData({ medicalsData });
      response.setMessage("You have edited the basic Condition");
      res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}
module.exports = new MedicalConditionController();
