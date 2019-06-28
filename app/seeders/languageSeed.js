const Language = require("../models/language");
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
        name: "English"
      },
      {
        name: "Hindi"
      },
      {
        name: "Odia"
      },
      {
        name: "Sanskrit"
      }
    ];
    await Language.remove({});
    for (let i = 0; i < options.length; i++) {
      let status = await Language.create(options[i]);
    }
    mongo.disconnectConnection();
  } catch (err) {}
})();
