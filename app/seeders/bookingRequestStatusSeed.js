const BookingRequestStatus = require("../models/bookingRequestStatus");
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
        name: "Submitted"
      },
      {
        name: "Approved"
      },
      {
        name: "Rejected"
      },
      {
        name: "Completed"
      }
    ];
    for (let i = 0; i < options.length; i++) {
      let status = await BookingRequestStatus.create(options[i]);
    }
    mongo.disconnectConnection();
  } catch (err) {}
})();
