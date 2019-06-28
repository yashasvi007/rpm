import {
  EVENT,
  ACTIVITY_TYPE,
  USER_CATEGORY,
  REPEAT_TYPE
} from "../../../constant";
import { ACTIONS } from "./constant";

const ACTIVITY_MODE = ACTIVITY_TYPE;

const getMoreOptions = ({ event, viewer, participantOne, participantTwo }) => {
  const { status, data: { activityMode, repeat } = {} } = event;

  const {
    basicInfo: { _id: viewerId, category: viewerCategory } = {}
  } = viewer;

  const {
    basicInfo: { _id: participantOneId, category: participantOneCategory } = {}
  } = participantOne;
  const {
    basicInfo: { _id: participantTwoId, category: participantTwoCategory } = {}
  } = participantTwo;

  const rescheduleOptions =
    repeat !== REPEAT_TYPE.NONE
      ? [
          ACTIONS.RESCHEDULE_THIS_APPOINTMENT,
          ACTIONS.RESCHEDULE_ALL_APPOINTMENT
        ]
      : [ACTIONS.RESCHEDULE_APPOINTMENT];
  switch (status) {
    case EVENT.STATUS.PENDING: {
      switch (activityMode) {
        case ACTIVITY_MODE.CALL: {
          return [
            ...rescheduleOptions,
            ACTIONS.EDIT_NOTES_OF_APPOINTMENT,
            ACTIONS.CANCEL_APPOINTMENT
          ];
        }
        case ACTIVITY_MODE.CHAT: {
          return [
            ...rescheduleOptions,
            ACTIONS.EDIT_NOTES_OF_APPOINTMENT,
            ACTIONS.CANCEL_APPOINTMENT
          ];
        }
        case ACTIVITY_MODE.VISIT: {
          return [
            ...rescheduleOptions,
            ACTIONS.EDIT_NOTES_OF_APPOINTMENT,
            ACTIONS.CANCEL_APPOINTMENT
          ];
        }
        default:
          return [];
      }
    }
    case EVENT.STATUS.STARTED: {
      switch (activityMode) {
        case ACTIVITY_MODE.CALL: {
          return [
            ...rescheduleOptions,
            ACTIONS.EDIT_NOTES_OF_APPOINTMENT,
            ACTIONS.CANCEL_APPOINTMENT
          ];
        }
        case ACTIVITY_MODE.CHAT: {
          return [
            ...rescheduleOptions,
            ACTIONS.EDIT_NOTES_OF_APPOINTMENT,
            ACTIONS.CANCEL_APPOINTMENT
          ];
        }
        case ACTIVITY_MODE.VISIT: {
          return [
            ...rescheduleOptions,
            ACTIONS.EDIT_NOTES_OF_APPOINTMENT,
            ACTIONS.CANCEL_APPOINTMENT
          ];
        }
        default:
          return [];
      }
    }
    case EVENT.STATUS.PASSED: {
      switch (activityMode) {
        case ACTIVITY_MODE.CALL: {
          return [
            ACTIONS.RESCHEDULE_APPOINTMENT,
            ACTIONS.EDIT_NOTES_OF_APPOINTMENT
          ];
        }
        case ACTIVITY_MODE.CHAT: {
          return [
            ACTIONS.RESCHEDULE_APPOINTMENT,
            ACTIONS.EDIT_NOTES_OF_APPOINTMENT
          ];
        }
        case ACTIVITY_MODE.VISIT: {
          return [
            ACTIONS.RESCHEDULE_APPOINTMENT,
            ACTIONS.EDIT_NOTES_OF_APPOINTMENT
          ];
        }
        default:
          return [];
      }
    }
    case EVENT.STATUS.COMPLETED: {
      switch (activityMode) {
        case ACTIVITY_MODE.CALL: {
          if (
            participantOneCategory === USER_CATEGORY.PATIENT ||
            participantTwoCategory === USER_CATEGORY.PATIENT
          ) {
            if (
              viewerId === participantOneId ||
              viewerId === participantTwoId
            ) {
              if (viewerCategory === USER_CATEGORY.PATIENT) {
                return [
                  ACTIONS.UPADTE_VITALS,
                  ACTIONS.UPDATE_BASICS,
                  ACTIONS.UPDATE_CLINICAL_READING,
                  ACTIONS.EDIT_NOTES_OF_APPOINTMENT
                ];
              } else if (viewerCategory === USER_CATEGORY.CARE_COACH) {
                return [
                  ACTIONS.UPADTE_VITALS,
                  ACTIONS.UPDATE_BASICS,
                  ACTIONS.UPDATE_CLINICAL_READING,
                  ACTIONS.UPDATE_MEDICATION,
                  ACTIONS.EDIT_NOTES_OF_APPOINTMENT
                ];
              } else if (viewerCategory === USER_CATEGORY.DOCTOR) {
                return [ACTIONS.EDIT_NOTES_OF_APPOINTMENT];
              }
            }
          }
          return [ACTIONS.EDIT_NOTES_OF_APPOINTMENT];
        }
        case ACTIVITY_MODE.CHAT: {
          if (
            participantOneCategory === USER_CATEGORY.PATIENT ||
            participantTwoCategory === USER_CATEGORY.PATIENT
          ) {
            if (
              viewerId === participantOneId ||
              viewerId === participantTwoId
            ) {
              if (viewerCategory === USER_CATEGORY.PATIENT) {
                return [
                  ACTIONS.UPADTE_VITALS,
                  ACTIONS.UPDATE_BASICS,
                  ACTIONS.UPDATE_CLINICAL_READING,
                  ACTIONS.EDIT_NOTES_OF_APPOINTMENT
                ];
              } else if (viewerCategory === USER_CATEGORY.CARE_COACH) {
                return [
                  ACTIONS.UPADTE_VITALS,
                  ACTIONS.UPDATE_BASICS,
                  ACTIONS.UPDATE_CLINICAL_READING,
                  ACTIONS.UPDATE_MEDICATION,
                  ACTIONS.EDIT_NOTES_OF_APPOINTMENT
                ];
              } else if (viewerCategory === USER_CATEGORY.DOCTOR) {
                return [ACTIONS.EDIT_NOTES_OF_APPOINTMENT];
              }
            }
          }
          return [ACTIONS.EDIT_NOTES_OF_APPOINTMENT];
        }
        case ACTIVITY_MODE.VISIT: {
          if (
            participantOneCategory === USER_CATEGORY.PATIENT ||
            participantTwoCategory === USER_CATEGORY.PATIENT
          ) {
            if (
              viewerId === participantOneId ||
              viewerId === participantTwoId
            ) {
              if (viewerCategory === USER_CATEGORY.PATIENT) {
                return [
                  ACTIONS.UPADTE_VITALS,
                  ACTIONS.UPDATE_BASICS,
                  ACTIONS.UPDATE_CLINICAL_READING,
                  ACTIONS.EDIT_NOTES_OF_APPOINTMENT
                ];
              } else if (viewerCategory === USER_CATEGORY.CARE_COACH) {
                return [
                  ACTIONS.UPADTE_VITALS,
                  ACTIONS.UPDATE_BASICS,
                  ACTIONS.UPDATE_CLINICAL_READING,
                  ACTIONS.UPDATE_MEDICATION,
                  ACTIONS.EDIT_NOTES_OF_APPOINTMENT
                ];
              } else if (viewerCategory === USER_CATEGORY.DOCTOR) {
                return [ACTIONS.EDIT_NOTES_OF_APPOINTMENT];
              }
            }
          }
          return [ACTIONS.EDIT_NOTES_OF_APPOINTMENT];
        }
        default:
          return [];
      }
    }
    default:
      return [];
  }
};

const getAction = ({ viewer, event, participantOne, participantTwo }) => {
  const { status, data: { activityMode } = {} } = event;

  /*const {
    basicInfo: { _id: viewerId,  } = {}
  } = viewer;

  const {
    basicInfo: { _id: participantOneId,  } = {}
  } = participantOne;
  const {
    basicInfo: { _id: participantTwoId} = {}
  } = participantTwo;

 const self =
  viewerId === participantOneId || viewerId === participantTwoId ? true : false;*/

  switch (status) {
    case EVENT.STATUS.PENDING: {
      switch (activityMode) {
        case ACTIVITY_MODE.CALL: {
          return { type: ACTIONS.MARK_AS_DONE, disabled: true };
        }
        case ACTIVITY_MODE.CHAT: {
          return { type: ACTIONS.JOIN_CALL, disabled: true };
        }
        case ACTIVITY_MODE.VISIT: {
          return { type: ACTIONS.MARK_AS_DONE, disabled: true };
        }
        default:
          return {};
      }
    }
    case EVENT.STATUS.STARTED: {
      switch (activityMode) {
        case ACTIVITY_MODE.CALL: {
          return { type: ACTIONS.MARK_AS_DONE, disabled: false };
        }
        case ACTIVITY_MODE.CHAT: {
          return { type: ACTIONS.JOIN_CALL, disabled: false };
        }
        case ACTIVITY_MODE.VISIT: {
          return { type: ACTIONS.MARK_AS_DONE, disabled: false };
        }
        default:
          return {};
      }
    }
    case EVENT.STATUS.PASSED: {
      switch (activityMode) {
        case ACTIVITY_MODE.CALL: {
          return { type: ACTIONS.MARK_AS_DONE, disabled: false };
        }
        case ACTIVITY_MODE.CHAT: {
          return { type: ACTIONS.JOIN_CALL, disabled: true };
        }
        case ACTIVITY_MODE.VISIT: {
          return { type: ACTIONS.MARK_AS_DONE, disabled: false };
        }
        default:
          return {};
      }
    }
    case EVENT.STATUS.COMPLETED: {
      switch (activityMode) {
        case ACTIVITY_MODE.CALL: {
          return { type: ACTIONS.UNDO, disabled: false };
        }
        case ACTIVITY_MODE.CHAT: {
          return { type: ACTIONS.JOIN_CALL, disabled: true };
        }
        case ACTIVITY_MODE.VISIT: {
          return { type: ACTIONS.UNDO, disabled: false };
        }
        default:
          return {};
      }
    }
    default:
      return {};
  }
};

export default {
  getMoreOptions,
  getAction
};
