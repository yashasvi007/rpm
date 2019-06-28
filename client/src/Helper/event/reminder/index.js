import dateFns from "date-fns";

import { REPEAT_TYPE, USER_STATUS, EVENT } from "../../../constant";
import { ACTIONS } from "../reminder/constant";

class Reminder {
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

  getStartDate = () => {
    const { event: { startTime } = {} } = this;
    return dateFns.format(dateFns.parse(startTime), "D MMM YYYY");
  };

  getNotes = () => {
    const { event: { data: { notes } = {} } = {} } = this;
    return notes ? notes : false;
  };

  getReminderTitle = () => {
    const { event: { data: { title } = {} } = {} } = this;
    return title ? title : false;
  };

  getReminderWithTag = () => {
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

    if (!participantTwoId) {
      return;
    }

    if (calendarUserId === viewerId) {
      //viewing self calendar
      if (viewerId === participantOneId) {
        return participantTwo;
      } else if (viewerId === participantTwoId) {
        return participantOne;
      }
    } else {
      //other user is viewing other's calendar
      if (viewerId !== participantOneId && viewerId !== participantTwoId) {
        //viewer is not one of the participant
        if (calendarUserId === participantOneId) {
          return participantTwo;
        } else if (calendarUserId === participantTwoId) {
          return participantOne;
        }
      }
      //viewer is one of the participant
      else {
        const { basicInfo } = viewer;
        return { ...viewer, basicInfo: { ...basicInfo, name: "You" } };
      }
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
    return this.getScheduledBy();
  };

  getMoreOption = () => {
    const {
      event = {},
      viewer = {},
      participantOne = {},
      participantTwo = {}
    } = this;
    const { status, data: { repeat } = {} } = event;

    const { basicInfo: { _id: viewerId } = {} } = viewer;
    const { basicInfo: { _id: participantOneId } = {} } = participantOne;
    const { basicInfo: { _id: participantTwoId } = {} } = participantTwo;

    if (viewerId === participantOneId || viewerId === participantTwoId) {
      const rescheduleOptions =
        repeat !== REPEAT_TYPE.NONE
          ? [ACTIONS.RESCHEDULE_THIS_REMINDER, ACTIONS.RESCHEDULE_ALL_REMINDER]
          : [ACTIONS.RESCHEDULE_REMINDER];
      switch (status) {
        case EVENT.STATUS.PENDING:
          return [
            ...rescheduleOptions,
            ACTIONS.EDIT_REMINDER,
            ACTIONS.EDIT_NOTES_OF_REMINDER,
            ACTIONS.CANCEL_REMINDER
          ];
        case EVENT.STATUS.COMPLETED:
        case EVENT.STATUS.PASSED:
        case EVENT.STATUS.STARTED:
          return [ACTIONS.EDIT_NOTES_OF_REMINDER];
        default:
          return [];
      }
    } else {
      return [];
    }
  };
}

export default Reminder;
