import {
  ACTIVITY_TYPE,
  EVENT_TYPE,
  USER_CATEGORY,
  REPEAT_TYPE,
  APPOINTMENT_TYPE,
  ACTIVITY_TYPE,
  EVENT
} from "../../constant";

const ACTIVITY_MODE = ACTIVITY_TYPE;

const EDIT_APPOINTMENT = "EDIT_APPOINTMENT";
const RESCHEDULE_APPOINTMENT = "RESCHEDULE_APPOINTMENT";
const RESCHEDULE_THIS_APPOINTMENT = "RESCHEDULE_THIS_APPOINTMENT";
const RESCHEDULE_ALL_APPOINTMENT = "RESCHEDULE_ALL_APPOINTMENT";
const CANCEL_APPOINTMENT = "CANCEL_APPOINTMENT";
const EDIT_NOTES_OF_APPOINTMENT = "EDIT_NOTES_OF_APPOINTMENT";

const EDIT_REMINDER = "EDIT_REMINDER";
const RESCHEDULE_THIS_REMINDER = "RESCHEDULE_THIS_REMINDER";
const RESCHEDULE_ALL_REMINDER = "RESCHEDULE_ALL_REMINDER";
const CANCEL_REMINDER = "CANCEL_REMINDER";
const EDIT_NOTES_OF_REMINDER = "EDIT_NOTES_OF_REMINDER";

const UPDATE_MEDICATION = "UPDATE_MEDICATION";
const UPADTE_VITALS = "UPDATE_VITALS";
const UPDATE_BASICS = "UPDATE_BASICS";

class Appointment {
  constructor({
    viewer = {},
    participantOne = {},
    participantTwo = {},
    event = {}
  }) {
    this.viewer = viewer;
    this.participantTwo = participantTwo;
    this.particpantOne = participantOne;
    this.event = event;
  }

  getRescheduleOptions = () => {
    const {
      event: {
        eventCategory,
        status,
        data: { activity_type, activity_mode, repeat } = {}
      } = {}
    } = this;

    if (repeat !== REPEAT_TYPE.NONE) {
      return [RESCHEDULE_THIS_APPOINTMENT, RESCHEDULE_ALL_APPOINTMENT];
    } else {
      return [RESCHEDULE_APPOINTMENT];
    }
  };

  getMarkedAsComplete = () => {
    const {
      viewer: { basicInfo: { _id: viewerId } = {} },
      particpantOne: {
        basicInfo: { _id: particpantOneId, name: participantOneName } = {}
      },
      participantTwo: { basicInfo: { _id: participantTwoId } = {} },
      event: { completedBy } = {}
    } = this;

    if (viewerId === completedBy) {
      return "me";
    } else if (completedBy === particpantOneId) {
      return `${participantOneName}`;
    } else if (completedBy === particpantTwoId) {
      return `${participantTwoName}`;
    }
  };

  getTag = () => {
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
      viewer: { basicInfo: { _id: viewerId } = {} },
      particpantOne: {
        basicInfo: { _id: particpantOneId, name: participantOneName } = {}
      },
      participantTwo: { basicInfo: { _id: participantTwoId } = {} }
    } = this;

    if (viewerId === particpantOneId || viewerId === participantTwoId) {
      return "me";
    } else {
      return `${participantOneName}`;
    }
  };

  getMoreOption = () => {
    const {
      viewer: { basicInfo: { _id: viewerId } = {} },
      particpantOne: { basicInfo: { _id: particpantOneId } = {} },
      participantTwo: { basicInfo: { _id: participantTwoId } = {} }
    } = this;

    if (viewerId === particpantOneId) {
      return participantOneMoreOption();
    }

    if (viewerId === participantTwoId) {
      return participantTwoMoreOption();
    }

    return otherViewerMoreOption();
  };

  otherViewerMoreOption = () => {
    const {
      event: {
        eventCategory,
        status,
        data: { activityType, activityMode, repeat } = {}
      } = {},
      viewer: { basicInfo: { _id, category } = {} } = {}
    } = this;

    let options = [];

    //add reshedule options
    if (
      status !== EVENT.STATUS.COMPLETED ||
      status !== EVENT.STATUS.PASSED ||
      status !== EVENT.STATUS.STARTED
    ) {
      options = [...options, RESCHEDULE_THIS_APPOINTMENT];
      if (repeat !== REPEAT_TYPE.NONE) {
        options = [...options, RESCHEDULE_ALL_APPOINTMENT];
      }
    }
    switch (status) {
      case EVENT.STATUS.PENDING: {
        const rescheduleOptions = this.getRescheduleOptions();
        switch (activityType) {
          case APPOINTMENT_TYPE.FOLLOWUP: {
            switch (activityMode) {
              case ACTIVITY_MODE.CALL: {
                return [
                  ...rescheduleOptions,
                  EDIT_NOTES_OF_APPOINTMENT,
                  CANCEL_APPOINTMENT
                ];
              }
              case ACTIVITY_MODE.CHAT: {
                return [
                  ...rescheduleOptions,
                  EDIT_NOTES_OF_APPOINTMENT,
                  CANCEL_APPOINTMENT
                ];
              }
              case ACTIVITY_MODE.VISIT: {
                return [
                  ...rescheduleOptions,
                  EDIT_NOTES_OF_APPOINTMENT,
                  CANCEL_APPOINTMENT
                ];
              }
              default:
                return [];
            }
          }
          case APPOINTMENT_TYPE.MATERIAL_DELIVERY: {
            switch (activityMode) {
              case ACTIVITY_MODE.CALL: {
                return [
                  ...rescheduleOptions,
                  EDIT_NOTES_OF_APPOINTMENT,
                  CANCEL_APPOINTMENT
                ];
              }
              case ACTIVITY_MODE.CHAT: {
                return [
                  ...rescheduleOptions,
                  EDIT_NOTES_OF_APPOINTMENT,
                  CANCEL_APPOINTMENT
                ];
              }
              case ACTIVITY_MODE.VISIT: {
                return [
                  ...rescheduleOptions,
                  EDIT_NOTES_OF_APPOINTMENT,
                  CANCEL_APPOINTMENT
                ];
              }
            }
          }
          case APPOINTMENT_TYPE.MEDICATION: {
            switch (activityMode) {
              case ACTIVITY_MODE.CALL: {
                return [
                  ...rescheduleOptions,
                  EDIT_NOTES_OF_APPOINTMENT,
                  CANCEL_APPOINTMENT
                ];
              }
              case ACTIVITY_MODE.CHAT: {
                return [
                  ...rescheduleOptions,
                  EDIT_NOTES_OF_APPOINTMENT,
                  CANCEL_APPOINTMENT
                ];
              }
              case ACTIVITY_MODE.VISIT: {
                return [
                  ...rescheduleOptions,
                  EDIT_NOTES_OF_APPOINTMENT,
                  CANCEL_APPOINTMENT
                ];
              }
            }
          }
          default:
            return [];
        }
      }
      case EVENT.STATUS.STARTED: {
        switch (activityType) {
          case APPOINTMENT_TYPE.FOLLOWUP: {
          }
          case APPOINTMENT_TYPE.MATERIAL_DELIVERY: {
          }
          case APPOINTMENT_TYPE.MEDICATION: {
          }
          default:
            return [];
        }
      }
      case EVENT.STATUS.COMPLETED: {
        switch (activityType) {
          case APPOINTMENT_TYPE.FOLLOWUP: {
          }
          case APPOINTMENT_TYPE.MATERIAL_DELIVERY: {
          }
          case APPOINTMENT_TYPE.MEDICATION: {
          }
          default:
            return [];
        }
      }
      default:
        return [];
    }
  };

  participantOneMoreOption = () => {};

  participantTwoMoreOption = () => {};
}
