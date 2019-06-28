// import moment from "moment";
const moment = require("moment");

function* nextEventTime(
  eventStartTime,
  eventEndTime,
  repeatInterval,
  listOfDays
) {
  const noOfDaysInWeek = 7;

  //for next day
  let noOfDays = 0;
  let curr = 0;
  const startTime = moment(eventStartTime);
  const endTime = moment(eventEndTime);
  const totalNoOfDays = listOfDays.length;
  const daysMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };
  while (true) {
    const startTime_copy = startTime.clone();
    const endTime_copy = endTime.clone();
    const start = startTime_copy
      .day(daysMap[listOfDays[curr]] + noOfDays)
      .clone();
    const end = endTime_copy.day(daysMap[listOfDays[curr]] + noOfDays).clone();

    if (curr + 1 === totalNoOfDays) {
      noOfDays = noOfDays + repeatInterval * noOfDaysInWeek;
    }
    curr = (curr + 1) % totalNoOfDays;
    yield { startTime: start, endTime: end, valid: startTime <= start };
  }
}

const getEventList = async (
  startDate,
  endDate,
  eventStartTime,
  eventEndTime,
  repeatInterval,
  listOfDays
) => {
  const eventGenartor = await nextEventTime(
    eventStartTime,
    eventEndTime,
    repeatInterval,
    listOfDays
  );
  let events = [];
  const endOfEndDate = endDate.clone().endOf("day");
  while (true) {
    const event = eventGenartor.next().value;
    const { startTime, endTime, valid } = event;
    if (endTime <= endOfEndDate) {
      if (valid) {
        events.push({ startTime: startTime, endTime: endTime });
      }
    } else {
      break;
    }
  }
  return events;
};

module.exports = getEventList;
