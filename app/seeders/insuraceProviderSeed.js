const insuranceProvider = require("../models/insuranceProvider");
const Mongo = require("../../libs/mongo");

(async () => {
  try {
    const mongo = new Mongo("mongodb://mongodb:27017/rpm");

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();
    const options = [
      {
        name: "MedLife Insurance",
        isActive: true
      },
      {
        name: "Healthcare Insurance",
        isActive: false
      }
    ];
    await insuranceProvider.remove({});
    for (let i = 0; i < options.length; i++) {
      let status = await insuranceProvider.create(options[i]);
      console.log("status", status);
    }
    mongo.disconnectConnection();
  } catch (err) {}
})();
