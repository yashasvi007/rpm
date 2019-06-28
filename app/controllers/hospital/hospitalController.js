const hospitalService = require("../../services/hospital/hospital.service");
const { validationResult } = require("express-validator/check");
const Response = require("../../helper/responseFormat");

class HospitalController {
  constructor() {}

  async getHospitals(req, res) {
    const errors = validationResult(req);
    //
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const { countryId, cityId } = req.query;
      let hospitals = await hospitalService.getHospitals(countryId, cityId);
      if (!hospitals) {
        throw new Error(constants.NO_HOSPITALS_FOUND);
      } else {
        let response = new Response(true, 200);
        response.setData(hospitals);
        response.setMessage("hospital data set");
        return res.send(response.getResponse());
      }
    } catch (err) {
      let payload;
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getDoctorHospitals(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const doctorId = req.params.doctorId;
      let doctorHospitals = await hospitalService.getDoctorHospitals(doctorId);
      if (!doctorHospitals) {
        throw new Error(constants.NO_HOSPITALS_FOUND);
      } else {
        let response = new Response(true, 200);
        response.setData(doctorHospitals);
        response.setMessage("hospital data set");
        return res.send(response.getResponse());
      }
    } catch (err) {
      let payload;
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new HospitalController();
