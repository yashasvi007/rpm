const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator/check");
const { Proxy_Sdk } = require("../../../app/proxySdk");

router.post("/addReminders", async (req, res) => {
  // let startDateTime = new Date('2019-01-18T15:30:00.000Z');
  // let endDateTime = new Date('2019-01-20T15:30:00.000Z');

  let { startDateTime, endDateTime, data, eventType } = req.body;
  try {
    let result = await Proxy_Sdk.scheduleEvent(
      startDateTime,
      endDateTime,
      data,
      eventType
    );
    return res.send(result);
  } catch (error) {}
});

module.exports = router;
