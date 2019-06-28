const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("medicationController");
const medicationService = require("../../services/medication/medication.service");
const moment = require("moment");

class MedicationController {
  constructor() {}

  async addMedication(req, res) {
    try {
      if (req.userDetails.exists) {
        const updateAt = moment().format();

        const { body: data } = req;
        const { value, userId } = data;
        const { product_id } = value;
        const updatedValue = { ...value, updateAt: new Date() };
        let medicine = {};
        medicine[product_id] = updatedValue;

        const lastMedication = await medicationService.getMedications({
          userId: userId
        });

        const lastMedicationLength = lastMedication.length;

        const medicinesArrayLength =
          lastMedicationLength > 0 ? lastMedication[0].medicine.length : 0;

        const lastMedicines =
          lastMedicationLength > 0 ? lastMedication[0].medicine : {};
        const prevMedication =
          lastMedicationLength > 0
            ? lastMedication[0].medicine[medicinesArrayLength - 1]
            : {};

        const newMedicines = Object.assign(prevMedication, medicine);
        newMedicines.updatedAt = updateAt;

        let newMedication = {};
        newMedication.userId = userId;
        newMedication.medicine = newMedicines;

        let addedMedication = {};

        let medication = {};
        if (lastMedication.length > 0) {
          addedMedication = await medicationService.updateMedication(
            newMedicines,
            userId
          );
          const { medicine, userId: patientId } = addedMedication;
          const latestMedicine = medicine[medicine.length - 1];
          medication.userId = patientId;
          medication.medicine = latestMedicine;
        } else {
          addedMedication = await medicationService.addMedication(
            newMedication
          );
          medication = addedMedication;
        }
        const response = new Response(true, 200);
        response.setData({ medication });
        response.setMessage("You have added the medication");
        res.send(response.getResponse());
      }
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

  async removeMedicine(req, res) {
    try {
      if (req.userDetails.exists) {
        const { body: data, params } = req;
        const { productId, userId } = data;

        const newMedication = medicationService.removeMedicine(
          productId,
          userId
        );

        // ("=========removeMedication lastest medication============",  lastMedication)
        // const newMedication ;
        const response = new Response(true, 200);
        response.setData({ newMedication });
        response.setMessage("You have added the medication");
        res.send(response.getResponse());
      }
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

module.exports = new MedicationController();
