const { EventEmitter } = require("events");
const EVENTS = require("./proxyEvents");
const scheduler = require("./scheduler");
const { NotificationSdk } = require("../notificationSdk");
const log = require("../../libs/log")("PROXY_SDK");
import scheduleService from "../services/scheduler/scheduler.service";
import moment from "moment";
import { EVENT_TYPE } from "../../constant";
const { ActivitySdk, STAGES } = require("../activitySdk");
const getAllListOfEvents = require("./scheduler/helper");
const schedule = require("node-schedule");

export const REPEAT_TYPE = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly"
};

class ProxySdk extends EventEmitter {
  constructor() {
    super();
  }

  execute(eventName, ...args) {
    this.emit(eventName, ...args);
  }

  handleNotification = (eventType, data) => {
    const { participantOne, participantTwo } = data;
    switch (eventType) {
      case "appointment":
        NotificationSdk.execute(participantOne, data);
        NotificationSdk.execute(participantTwo, data);
        break;
      case "reminder":
        NotificationSdk.execute(participantOne, data, true);
        NotificationSdk.execute(participantTwo, data, true);
        break;
      default:
    }
  };

  scheduleEvent = async ({ data }) => {
    try {
      const {
        _id,
        eventCategory,
        startDate,
        endDate,
        participantOne,
        participantTwo,
        details: {
          activityMode,
          activityType,
          repeat,
          repeatDays,
          repeatInterval,
          startTime: eventStartTime,
          endTime: eventEndTime,
          notes,
          title
        },
        link
      } = data;

      const start = moment(startDate);
      const end = moment(endDate);

      let startTime = moment(eventStartTime);
      let endTime = moment(eventEndTime);

      let timeToAdd;
      switch (repeat) {
        case REPEAT_TYPE.NONE:
          break;
        case REPEAT_TYPE.WEEKLY: {
          const listOfEvents = await getAllListOfEvents(
            start.clone(),
            end.clone(),
            startTime.clone(),
            endTime.clone(),
            repeatInterval,
            repeatDays
          );
          for (const event of listOfEvents) {
            const { startTime, endTime } = event;
            const schedulerDataToSave = {
              eventId: _id,
              eventType: eventCategory,
              startTime: startTime,
              endTime: endTime,
              data: {
                activityMode: activityMode,
                activityType: activityType,
                repeat: repeat,
                repeatInterval: repeatInterval,
                repeatDays: repeatDays,
                notes: notes,
                link: link,
                title: title,
                participantOne: participantOne,
                participantTwo: participantTwo
              }
            };
            const scheduledJob = await scheduleService.addNewJob(
              schedulerDataToSave
            );
            log.info(scheduledJob);
          }
          return true;
        }
        case REPEAT_TYPE.MONTHLY:
          timeToAdd = {
            months: repeatInterval
          };
          break;
        case REPEAT_TYPE.YEARLY:
          timeToAdd = {
            years: repeatInterval
          };
          break;
        case REPEAT_TYPE.DAILY:
          timeToAdd = {
            days: 1
          };
          break;
      }

      const schedulerDataToSave = {
        eventId: _id,
        eventType: eventCategory,
        startTime: startTime,
        endTime: endTime,
        data: {
          activityMode: activityMode,
          activityType: activityType,
          repeat: repeat,
          repeatInterval: repeatInterval,
          repeatDays: repeatDays,
          notes: notes,
          link: link,
          title,
          participantOne: participantOne,
          participantTwo: participantTwo
        }
      };

      const now = moment().add(15, "minutes");
      const scheduledJob = await scheduleService.addNewJob(schedulerDataToSave);
      if (startTime < now) {
        log.info("event will be start soon after create");
        await this.scheduleStartEndOfEvent(scheduledJob);
      }
      if (timeToAdd) {
        let next = startTime.clone().add({ timeToAdd });
        for (next = start; next < end; next = next.add(timeToAdd)) {
          startTime = startTime.add(timeToAdd);
          endTime = endTime.add(timeToAdd);
          const dataToSave = Object.assign({}, schedulerDataToSave, {
            startTime: startTime,
            endTime: endTime
          });
          scheduleService.addNewJob(dataToSave);
        }
      }

      return true;
    } catch (error) {
      log.warn(`Error in scheduleEvent: ${error}`);
    }
  };

  async scheduleStartEndOfEvent(event) {
    const now = new Date();
    const {
      _id: scheduledJobId,
      eventType,
      startTime,
      endTime,
      data: { activityType }
    } = event;
    const eventStartTime = new Date(startTime);
    const diff = eventStartTime.getTime() - now.getTime();
    if (diff > 0) {
      schedule.scheduleJob(
        eventStartTime,
        function(y) {
          scheduler
            .updateScheduledJob({
              id: scheduledJobId,
              status:
                eventType === EVENT_TYPE.REMINDER ? "completed" : "started"
            })
            .then(res => {
              log.info("job is started", scheduledJobId);
            });
        }.bind(event)
      );
    } else {
      scheduler
        .updateScheduledJob({
          id: scheduledJobId,
          status: eventType === EVENT_TYPE.REMINDER ? "completed" : "started"
        })
        .then(res => {
          log.info("job is started", scheduledJobId);
        });
    }

    const data = {
      eventType: eventType,
      activityType,
      stage: STAGES.STARTED,
      data: event
    };

    const result = await ActivitySdk.execute(data);
    log.info(`startedJob: ${event}`);

    if (eventType === EVENT_TYPE.APPOINTMENT) {
      const eventEndTime = new Date(endTime);
      schedule.scheduleJob(eventEndTime, () => {
        const {
          data: { activityMode }
        } = event;
        let statusToUpdate = "passed";
        if (activityMode === "chat") {
          const joinedParticipants = scheduleService
            .getScheduleEventById(event._id)
            .then(result => {
              statusToUpdate =
                result.joinedParticipants.length === 2 &&
                activityMode === "chat"
                  ? "completed"
                  : "passed";
              const updatedJob = scheduler
                .updateScheduledJob({
                  id: scheduledJobId,
                  status: statusToUpdate
                })
                .then(res => {
                  const data = {
                    eventType: eventType,
                    activityType,
                    stage: STAGES.PASSED,
                    data: res
                  };
                  ActivitySdk.execute(data);
                  log.info(`updatedJob: ${res}`);
                });
            });
        } else {
          const updatedJob = scheduler
            .updateScheduledJob({
              id: scheduledJobId,
              status: "passed"
            })
            .then(res => {
              const data = {
                eventType: eventType,
                activityType,
                stage: STAGES.PASSED,
                data: res
              };
              ActivitySdk.execute(data);
              log.info(`updatedJob: ${res}`);
            });
        }
      });
    }
  }

  async executeScheduledEvent() {
    const scheduledJobs = await scheduler.fetchScheduledJobs();
    const passedJobs = await scheduler.fetchPassedJobs();

    log.info(`scheduledJobs: , ${scheduledJobs}`);
    log.info(`passsedJobs: , ${passedJobs}`);

    for (const job of scheduledJobs) {
      this.scheduleStartEndOfEvent(job);
    }
    for (const job of passedJobs) {
      const { _id: scheduledJobId, eventType } = job;

      const updatedJob = await scheduler.updateScheduledJob({
        id: scheduledJobId,
        status: eventType === EVENT_TYPE.REMINDER ? "completed" : "passed"
      });

      const {
        data: { activityType }
      } = updatedJob;

      const data = {
        eventType: eventType,
        activityType,
        stage:
          eventType === EVENT_TYPE.REMINDER ? STAGES.COMPLETE : STAGES.PASSED,
        data: updatedJob
      };
      const result = await ActivitySdk.execute(data);

      log.info(`updatedJob: ${updatedJob}`);
    }
  }
}

const Proxy_Sdk = new ProxySdk();
module.exports = { Proxy_Sdk, EVENTS };
