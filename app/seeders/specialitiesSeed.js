const Speciality = require("../models/speciality");
const Mongo = require("../../libs/mongo");
(async () => {
  try {
    const mongo = new Mongo("mongodb://127.0.0.1:27017/rpm");

    var conn = (async function() {
      try {
        const connection = await mongo.getConnection();
      } catch (err) {}
    })();
    const options = [
      {
        specialityName: "Cardiologist"
      },
      {
        specialityName: "Dentist"
      },
      {
        specialityName: "Neurologist"
      },
      {
        specialityName: "Radiologist"
      }
    ];
    await Speciality.remove({});
    for (let i = 0; i < options.length; i++) {
      let status = await Speciality.create(options[i]);
    }
    mongo.disconnectConnection();
  } catch (err) {}
})();
