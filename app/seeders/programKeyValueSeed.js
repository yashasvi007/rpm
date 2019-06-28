const programKeyValue = require("../models/programKeyValue");
const Mongo = require("../../libs/mongo");
var ObjectId = require("mongodb").ObjectID;
const { ABI_TEST, SomeXYZTest } = require("../testTemplates");

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
        _id: "333330303030303030303037",
        programId: "333330303030303030303030",
        values: {
          test: { ABI_TEST, SomeXYZTest }
        }
      },
      {
        _id: "223330303030303030303039",
        programId: "223330303030303030303030",
        values: {
          test: { ABI_TEST, SomeXYZTest }
        }
      },
      {
        _id: "333220303030303030303038",
        programId: "333220303030303030303030",
        values: {
          test: { ABI_TEST, SomeXYZTest }
        }
      }
    ];

    await programKeyValue.remove({});
    for (let i = 0; i < options.length; i++) {
      let status = await programKeyValue.create(options[i]);
      console.log("status", status);
    }
    mongo.disconnectConnection();
  } catch (err) {
    console.log("err", err);
  }
})();
