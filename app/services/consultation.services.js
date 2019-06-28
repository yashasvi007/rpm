const fs = require("fs");
const AWS = require("aws-sdk");
const path = require("path");
const PDFDocument = require("pdfkit");
const S3Bucket = new AWS.S3({
  accessKeyId: process.config.aws.access_key_id,
  secretAccessKey: process.config.aws.access_key,
  params: { Bucket: process.config.aws.aws_prescription_bucket }
});

class ConsultationServices {
  constructor() {}

  getDrugDuration(value) {
    switch (value) {
      case "1/1":
        return "1 time A day";
        break;
      case "2/1":
        return "2 times A day";
        break;
      case "3/1":
        return "3 times A day";
        break;
      case "1/2":
        return "1 time in 2 days";
        break;
      case "2/2":
        return "2 times in 2 days";
        break;
      case "3/2":
        return "3 times in 2 days";
        break;
      case "1/3":
        return "1 time in 3 days";
        break;
      case "2/3":
        return "2 times in 3 days";
        break;
      case "3/3":
        return "3 times in 3 days";
        break;
      default:
        return "Dont take!!";
    }
  }
  getPdfData(data) {
    let drugString = data.prescriptionData.map((value, index) => {
      return `${index + 1})${value["drugName"]} ----> ${
        value["quantity"]
      }Tablet(s) -----> ${this.getDrugDuration(value["duration"])}`;
    });
    drugString = drugString.join("\n");

    return `Hi ${data.bookingData.memberId.firstName} ${
      data.bookingData.memberId.lastName
    }\nRx:\n${drugString}`;
  }

  uploadFile2(data, filePath) {
    try {
      let fileKey = `prescrb-${data.bookingData.memberId._id}-${
        data.bookingData._id
      }.pdf`;

      let fileStream = fs.createReadStream(filePath);
      fileStream.on("error", function(err) {});
      return new Promise((resolve, reject) => {
        S3Bucket.upload(
          {
            Key: fileKey,
            Bucket: process.config.aws.aws_prescription_bucket,
            Body: fileStream
          },
          (error, response) => {
            if (error) reject(err);
            else resolve(response);
          }
        );
      });
    } catch (err) {}
  }
  createPdf2(data) {
    try {
      let filePath = path.join(
        __dirname,
        `../../../uploads/prescrb-${data.bookingData.memberId._id}-${
          data.bookingData._id
        }.pdf`
      );
      let pdf = new PDFDocument();
      return new Promise((resolve, reject) => {
        pdf.text(this.getPdfData(data));
        pdf.pipe(fs.createWriteStream(filePath)).on("finish", function() {
          resolve({
            status: "finished",
            fpath: filePath
          });
        });
        pdf.end();
      });
    } catch (err) {}
  }

  async sendPrescription(data) {
    try {
      let response = await this.createPdf2(data);

      if (response && response.status == "finished") {
        let uploadResp = await this.uploadFile2(data, response.fpath);

        return uploadResp;
      }
    } catch (err) {}
  }

  downloadPrescription(fileKey) {
    try {
      let options = {
        Bucket: "e-consulting-store",
        Key: fileKey
      };

      let prescriptionFileStream = S3Bucket.getObject(
        options
      ).createReadStream();

      return prescriptionFileStream;
    } catch (err) {
      console(err);
    }
  }
}

module.exports = new ConsultationServices();
