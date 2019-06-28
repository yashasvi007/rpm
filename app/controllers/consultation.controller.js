const consultationServices = require("../services/consultation.services");

class Consultation {
  async sendPrescription(req, res) {
    try {
      let postData = req.body;
      let response = await consultationServices.sendPrescription(postData);

      if (response) {
        res.send({ error: 0, apiResponse: response });
      } else {
        res.send({ error: 1, message: "unable to push data to S3" });
      }
    } catch (err) {
      res.send({ error: 1, message: "unable to push data to S3" });
    }
  }

  downloadPrescription(req, res) {
    try {
      let fileKey = req.query.fKey;
      res.attachment(fileKey);
      let fileStream = consultationServices.downloadPrescription(fileKey);
      fileStream.pipe(res);
    } catch (err) {}
  }
}

module.exports = new Consultation();
