import {
  CREATING_ADVERSE_EVENT_REQUEST_COMPLETED,
  CREATING_REMINDER_REQUEST_COMPLETED,
  CREATING_APPOINTMENT_REQUEST_COMPLETED
} from "../modals";

import {
  CANCEL_APPOINTMENT_COMPLETED,
  RESCHEDULE_COMPLETED,
  EDIT_NOTES_COMPLETED,
  CANCEL_REMINDER_COMPLETED
} from "../events";

import {
  SAVING_BASIC_CONDITION_COMPLETED,
  SAVING_VITAL_COMPLETED,
  SAVING_CLINICAL_READING_COMPLETED
} from "../medical";

import {
  SHARING_ARTICLE_COMPLETED,
  MAKE_FAVOURITE_UNFAVOURITE_COMPLETE
} from "../articles";

import { DISCHARGE_PATIENT_REQUEST_COMPLETED } from "../user";
import { CREATING_SURVEYS_COMPLETED } from "../survey";

import { CHANGING_PASSWORD_COMPLETED } from "../page/changePassword";

const CLEAR_MSG = "CLEAR_MSG";
const SHOW_MSG = "SHOW_MSG";

const initialState = {};

export const clearMsg = () => {
  return dispatch => {
    dispatch({ type: CLEAR_MSG });
  };
};

export const showMsg = msg => {
  return dispatch => {
    dispatch({ type: SHOW_MSG, message: msg });
  };
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case CREATING_ADVERSE_EVENT_REQUEST_COMPLETED:
    case CREATING_APPOINTMENT_REQUEST_COMPLETED:
    case CREATING_REMINDER_REQUEST_COMPLETED:
    case CANCEL_APPOINTMENT_COMPLETED:
    case RESCHEDULE_COMPLETED:
    case EDIT_NOTES_COMPLETED:
    case CREATING_SURVEYS_COMPLETED:
    case SAVING_BASIC_CONDITION_COMPLETED:
    case SAVING_VITAL_COMPLETED:
    case SAVING_CLINICAL_READING_COMPLETED:
    case DISCHARGE_PATIENT_REQUEST_COMPLETED:
    case CANCEL_REMINDER_COMPLETED:
    case CHANGING_PASSWORD_COMPLETED:
    case SHARING_ARTICLE_COMPLETED:
    case MAKE_FAVOURITE_UNFAVOURITE_COMPLETE:
    case SHOW_MSG:
      return {
        msg: payload.message
      };
    case CLEAR_MSG:
      return {};
    default:
      return state;
  }
};
