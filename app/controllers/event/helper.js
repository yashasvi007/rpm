const eventService = require("../../services/event/event.service");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
import scheduleService from "../../services/scheduler/scheduler.service";

export const handleRescheduleAll = async (data = {}) => {
  try {
    const {
      startDate,
      startTime,
      endTime,
      notes,
      scheduleEventId,
      repeat,
      repeatDays,
      repeatInterval,
      endDate
    } = data;
    const scheduleEventData = await scheduleService.getScheduleEventById(
      scheduleEventId
    );
    const { eventId } = scheduleEventData;
    const eventData = await eventService.getEventById(eventId);
    await scheduleService.cancelEventBetweenRange({
      id: eventId,
      startDate,
      endDate
    });
    const { _id, ...restData } = eventData;
    const { details = {} } = restData;
    const newEventData = {
      ...restData,
      startDate,
      endDate,
      details: {
        ...details,
        startTime,
        endTime,
        notes,
        repeat,
        repeatInterval,
        repeatDays
      }
    };
    const newEvent = await eventService.addEvent(newEventData);
    const scheduledJob = await Proxy_Sdk.scheduleEvent({ data: newEvent });
  } catch (err) {
    throw err;
  }

  // await scheduleService.cancelEventBetweenRange({id:scheduleEventId,startDate,endDate});
  // const res = await eventService.
};
