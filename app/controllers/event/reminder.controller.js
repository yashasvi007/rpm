const eventService = require("../../services/event/event.service");
const Response = require("../../helper/responseFormat");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
const { ActivitySdk, STAGES } = require("../../activitySdk");
const errMessages = require("../../../config/messages.json").errMessages;

import moment from "moment";
import scheduleService from "../../services/scheduler/scheduler.service";
import { EVENT_TYPE } from "../../../constant";
import { handleRescheduleAll } from "./helper";

class ReminderController {
  eventCategory = "reminder";
  create = async (req, res) => {
    try {
      const { body: data, userDetails } = req;
      const {
        participantTwo,
        startTime,
        startDate,
        endDate,
        repeat,
        repeatDays,
        repeatInterval,
        notes,
        title
      } = data;
      const { userId: participantOne } = userDetails;
      //create link of this et
      const dataToSave = {
        eventCategory: this.eventCategory,
        participantOne,
        participantTwo,
        startDate: startDate,
        endDate: endDate,
        details: {
          repeat,
          repeatDays,
          repeatInterval,
          startTime,
          endTime: startTime,
          notes,
          title
        },
        link: ""
      };

      const reminder = await eventService.addEvent(dataToSave);

      //prepare data for scheduling job

      const schedulerData = {
        eventId: reminder._id,
        eventType: this.eventCategory,
        actionMode: reminder.activityMode,
        scheduledOn: startDate,
        data: reminder
      };

      const result = ActivitySdk.execute({
        eventType: EVENT_TYPE.REMINDER,
        stage: STAGES.INIT,
        data: reminder
      });
      await Proxy_Sdk.scheduleEvent(schedulerData);

      let response = new Response(true, 200);
      response.setMessage("Reminder created succesfully");
      return res.send(response.getResponse());
    } catch (err) {
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError({ error: payload.error });
      return res.status(payload.code).json(response.getResponse());
    }
  };

  async getReminders(req, res) {
    const { userId, startDate, endDate } = req.query;
    try {
      const remindersData = await eventService.getEventsByuserId({
        eventCategory: "reminder",
        userId,
        startDate: startDate,
        endDate: endDate
      });

      let reminders = {};
      let schedulesEvents = {};
      for (const reminder of remindersData) {
        const scheduleEventList = await scheduleService.getScheduleEvent({
          eventId: reminder._id,
          startDate: startDate,
          endDate: endDate
        });

        scheduleEventList.forEach(scheduleEvent => {
          const {
            _id,
            eventType,
            eventId,
            startTime,
            endTime,
            data,
            status
          } = scheduleEvent;
          schedulesEvents[_id] = {
            id: _id,
            eventType: eventType,
            eventId: eventId,
            startTime: startTime,
            endTime: endTime,
            data: data,
            status: status
          };
        });
        reminders[reminder._id] = scheduleEventList.map(
          scheduleEvent => scheduleEvent._id
        );
      }

      const response = new Response(true, 200);
      response.setData({
        reminders: reminders,
        events: schedulesEvents
      });

      return res.send(response.getResponse());
    } catch (err) {
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
  async cancel(req, res) {
    try {
      const { id, all } = req.query;
      const { userId } = req.userDetails;
      if (all === "false") {
        const result = await scheduleService.markAllEventsAsCancel({
          id: id
        });
      } else if (all === "true") {
        const result = await scheduleService.scheduleEventMarkAsCancel({
          id: id
        });

        const data = {
          eventType: EVENT_TYPE.REMINDER,
          stage: STAGES.CANCEL,
          data: { ...result, userId }
        };
        const handled = await ActivitySdk.execute(data);
      }
      //ActivitySdk.execute();
      let response = new Response(true, 200);
      response.setMessage("Reminder Cancelled Successfully");
      return res.send(response.getResponse());
    } catch (err) {
      const payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async editReminder(req, res) {
    try {
      const {
        startDate,
        startTime,
        endTime,
        notes,
        series = false,
        repeat,
        repeatDays,
        repeatInterval,
        endDate
      } = req.body;
      const { scheduleEventId } = req.params;
      const { userId } = req.userDetails;

      if (series) {
        const rescheduleAllData = await handleRescheduleAll({
          startDate,
          startTime,
          endTime,
          notes,
          scheduleEventId,
          repeat,
          repeatDays,
          repeatInterval,
          endDate
        });
        const response = new Response(true, 200);
        response.setMessage("Event details change successfully");
        return res.send(response.getResponse());
      }

      //check for only appointmnet and reminder
      const rescheduleresult = await scheduleService.reschedule({
        id: scheduleEventId,
        on: startDate,
        startTime: startTime,
        endTime: startTime
      });
      const editNotesresult = await scheduleService.editNotes({
        id: scheduleEventId,
        notes: notes
      });

      const data = {
        eventType: EVENT_TYPE.REMINDER,
        stage: STAGES.RESCHEDULE,
        data: { ...editNotesresult, userId: userId }
      };

      const handled = await ActivitySdk.execute(data);

      const now = moment().add(15, "minutes");
      let startOn = moment(startTime);
      if (startOn < now) {
        await Proxy_Sdk.scheduleStartEndOfEvent(rescheduleresult);
      }

      const response = new Response(true, 200);
      response.setMessage("Event details change successfully");
      return res.send(response.getResponse());
    } catch (err) {
      console.log(err);

      const payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async editNotesScheduleEvent(req, res) {
    try {
      const { notes } = req.body;
      const { scheduleEventId } = req.params;
      const { userId } = req.userDetails;
      //check for only appointmnet and reminder
      const result = await scheduleService.editNotes({
        id: scheduleEventId,
        notes: notes
      });

      const data = {
        eventType: EVENT_TYPE.REMINDER,
        stage: STAGES.EDIT_NOTES,
        data: { ...result, userId }
      };
      const handled = await ActivitySdk.execute(data);
      const response = new Response(true, 200);
      response.setMessage("Event notes edited");
      return res.send(response.getResponse());
    } catch (err) {
      const payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR
      };
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

export default new ReminderController();
