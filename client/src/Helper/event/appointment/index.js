import dateFns from "date-fns";

import { APPOINTMENT_TYPE, USER_STATUS, EVENT } from "../../../constant";
import followup from "./folowup";
import materialDelivery from "./materialDelivery";
import medication from "./medication";

class Appointment {
  constructor({
    viewer = {},
    calendarUser = {},
    participantOne = {},
    participantTwo = {},
    event = {}
  }) {
    this.viewer = viewer;
    this.participantTwo = participantTwo;
    this.participantOne = participantOne;
    this.event = event;
    this.calendarUser = calendarUser;
  }

  isCardEnable = () => {
    const {
      participantOne: { status: participantOneStatus } = {},
      participantTwo: { status: participantTwoStatus } = {}
    } = this;

    if (
      participantOneStatus === USER_STATUS.DISCHARGED ||
      participantTwoStatus === USER_STATUS.DISCHARGED
    ) {
      return false;
    } else {
      return true;
    }
  };

  getStartTime = () => {
    const { event: { startTime } = {} } = this;
    return dateFns.format(dateFns.parse(startTime), "h:mm A");
  };

  getActivityName = () => {
    const { event: { data: { activityMode } = {} } = {} } = this;
    return activityMode.charAt(0).toUpperCase() + activityMode.slice(1);
  };

  getActivityTypeName = () => {
    const { event: { data: { activityType } = {} } = {} } = this;
    switch (activityType) {
      case APPOINTMENT_TYPE.FOLLOWUP:
        return "Follow up";
      case APPOINTMENT_TYPE.MATERIAL_DELIVERY:
        return "Material Delivery";
      case APPOINTMENT_TYPE.MEDICATION:
        return "Medication";
      default:
        return null;
    }
  };

  getEventDuration = () => {
    const { event: { startTime, endTime } = {} } = this;
    if (!startTime || !endTime) {
      return null;
    }
    let diff = dateFns.differenceInMinutes(
      dateFns.parse(endTime),
      dateFns.parse(startTime)
    );
    if (diff > 60) {
      diff =
        dateFns.differenceInHours(
          dateFns.parse(endTime),
          dateFns.parse(startTime)
        ) + " hr";
    } else if (diff > 0 && diff <= 60) {
      diff = diff + " min";
    } else {
      diff = null;
    }
    return diff;
  };

  getNotes = () => {
    const { event: { data: { notes } = {} } = {} } = this;
    return notes ? notes : false;
  };

  getAppointmentMode = () => {
    const { event: { data: { activityMode } = {} } = {} } = this;
    return activityMode;
  };

  getAppointmentWithTag = () => {
    const {
      participantOne = {},
      participantTwo = {},
      viewer = {},
      calendarUser = {}
    } = this;

    const { basicInfo: { _id: viewerId } = {} } = viewer,
      { basicInfo: { _id: participantOneId } = {} } = participantOne,
      { basicInfo: { _id: participantTwoId } = {} } = participantTwo,
      { basicInfo: { _id: calendarUserId } = {} } = calendarUser;

    if (calendarUserId === viewerId) {
      //viewing self calendar
      if (viewerId === participantOneId) {
        return participantTwo;
      } else if (viewerId === participantTwoId) {
        return participantOne;
      } else {
        return participantTwo;
      }
    } else {
      //other user is viewing other's calendar
      if (viewerId !== participantOneId && viewerId !== participantTwoId) {
        //viewer is not one of the participant
        if (calendarUserId === participantOneId) {
          return participantTwo;
        } else if (calendarUserId === participantTwoId) {
          return participantOne;
        } else {
          return participantTwo;
        }
      }
      //viewer is one of the participant
      else {
        const { basicInfo = {} } = viewer;
        return { ...viewer, basicInfo: { ...basicInfo, name: "You" } };
      }
    }
  };

  getMarkedAsComplete = () => {
    const {
      viewer: { basicInfo: { _id: viewerId } = {} } = {},
      participantOne: {
        basicInfo: { _id: participantOneId, name: participantOneName } = {}
      } = {},
      participantTwo: {
        basicInfo: { _id: participantTwoId, name: participantTwoName } = {}
      } = {},
      event: { completedBy } = {}
    } = this;

    if (viewerId === completedBy) {
      return "Me";
    } else if (completedBy === participantOneId) {
      return `${participantOneName}`;
    } else if (completedBy === participantTwoId) {
      return `${participantTwoName}`;
    }
  };

  getStatus = () => {
    const { event: { status } = {} } = this;
    switch (status) {
      case EVENT.STATUS.PENDING:
        return "Scheduled";
      case EVENT.STATUS.PASSED:
        return "Overdue";
      case EVENT.STATUS.COMPLETED:
        return "Completed";
      case EVENT.STATUS.STARTED:
        return "Active";
      default:
        return null;
    }
  };

  getScheduledBy = () => {
    const {
      viewer: { basicInfo: { _id: viewerId } = {} } = {},
      participantOne: {
        basicInfo: { _id: participantOneId, name: participantOneName } = {}
      } = {}
    } = this;

    if (viewerId === participantOneId) {
      return "Me";
    } else {
      return `${participantOneName}`;
    }
  };

  getLastActedUser = () => {
    const { event: { status } = {} } = this;
    if (status === EVENT.STATUS.COMPLETED) {
      return this.getMarkedAsComplete();
    } else {
      return this.getScheduledBy();
    }
  };

  getMoreOption = () => {
    const {
      event = {},
      viewer = {},
      participantOne = {},
      participantTwo = {}
    } = this;
    const {
      data: { activityType }
    } = event;
    console.log("activityType :", activityType);
    switch (activityType) {
      case APPOINTMENT_TYPE.FOLLOWUP:
        return followup.getMoreOptions({
          event,
          viewer,
          participantOne,
          participantTwo
        });
      case APPOINTMENT_TYPE.MATERIAL_DELIVERY:
        return materialDelivery.getMoreOptions({
          event,
          viewer,
          participantOne,
          participantTwo
        });
      case APPOINTMENT_TYPE.MEDICATION:
        return materialDelivery.getMoreOptions({
          event,
          viewer,
          participantOne,
          participantTwo
        });
      default:
        return [];
    }
  };

  getAction = () => {
    const {
      event = {},
      viewer = {},
      participantOne = {},
      participantTwo = {}
    } = this;
    const {
      data: { activityType }
    } = event;
    switch (activityType) {
      case APPOINTMENT_TYPE.FOLLOWUP:
        return followup.getAction({
          event,
          viewer,
          participantOne,
          participantTwo
        });
      case APPOINTMENT_TYPE.MATERIAL_DELIVERY:
        return materialDelivery.getAction({
          event,
          viewer,
          participantOne,
          participantTwo
        });
      case APPOINTMENT_TYPE.MEDICATION:
        return medication.getAction({
          event,
          viewer,
          participantOne,
          participantTwo
        });
      default:
        return {};
    }
  };
}

export default Appointment;
