import { doRequest } from "../../Helper/network";
import { Event } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";
import {
  DISCHARGE_PATIENT_REQUEST,
  DISCHARGE_PATIENT_REQUEST_COMPLETED,
  DISCHARGE_PATIENT_REQUEST_COMPLETED_WITH_ERROR,
  VERIFY_DOCUMENT_REQUEST,
  VERIFY_DOCUMENT_REQUEST_COMPLETED,
  VERIFY_DOCUMENT_REQUEST_COMPLETED_WITH_ERROR,
  REUPLOAD_IDPROOF_REQUEST,
  REUPLOAD_IDPROOF_REQUEST_COMPLETED,
  REUPLOAD_IDPROOF_REQUEST_COMPLETED_WITH_ERROR,
  REUPLOAD_CONSENTFORM_REQUEST,
  REUPLOAD_CONSENTFORM_REQUEST_COMPLETED,
  REUPLOAD_CONSENTFORM_REQUEST_COMPLETED_WITH_ERROR
} from "../user";
import {
  CANCEL_APPOINTMENT,
  CANCEL_APPOINTMENT_COMPLETED,
  CANCEL_APPOINTMENT_COMPLETED_WITH_ERROR,
  CANCEL_REMINDER,
  CANCEL_REMINDER_COMPLETED,
  CANCEL_REMINDER_COMPLETED_WITH_ERROR,
  RESCHEDULE,
  RESCHEDULE_COMPLETED,
  RESCHEDULE_COMPLETED_WITH_ERROR,
  EDIT_NOTES,
  EDIT_NOTES_COMPLETED,
  EDIT_NOTES_COMPLETED_WITH_ERROR
} from "../events";

import {
  SHARING_ARTICLE,
  SHARING_ARTICLE_COMPLETED,
  SHARING_ARTICLE_COMPLETED_WITH_ERROR
} from "../articles";

import { CHANGING_PASSWORD_COMPLETED } from "../page/changePassword";

const OPEN_MODAL = "OPEN_MODAL";
const CLOSE_MODAL = "CLOSE_MODAL";

const CREATING_APPOINTMENT_REQUEST = "CREATING_APPOINTMENT_REQUEST";
export const CREATING_APPOINTMENT_REQUEST_COMPLETED =
  "CREATING_APPOINTMENT_REQUEST_COMPLETED";
const CREATING_APPOINTMENT_REQUEST_COMPLETED_WITH_ERROR =
  "CREATING_APPOINTMENT_REQUEST_COMPLETED_WITH_ERROR";

const CREATING_REMINDER_REQUEST = "CREATING_REMINDER_REQUEST";
export const CREATING_REMINDER_REQUEST_COMPLETED =
  "CREATING_REMINDER_REQUEST_COMPLETED";
const CREATING_REMINDER_REQUEST_COMPLETED_WITH_ERROR =
  "CREATING_REMINDER_REQUEST_COMPLETED_WITH_ERROR";

const CREATING_ADVERSE_EVENT_REQUEST = "CREATING_ADVERSE_EVENT_REQUEST";
export const CREATING_ADVERSE_EVENT_REQUEST_COMPLETED =
  "CREATING_ADVERSE_EVENT_REQUEST_COMPLETED";
const CREATING_ADVERSE_EVENT_REQUEST_COMPLETED_WITH_ERROR =
  "CREATING_ADVERSE_EVENT_REQUEST_COMPLETED_WITH_ERROR";

const CLEAR_ERROR = "CLEAR_ERROR";

const initialState = {
  show: false
};

//data is for extra data pass to the containers on modal open
export const open = (modalType, entityId, purpose, data) => {
  return dispatch => {
    dispatch({
      type: OPEN_MODAL,
      payload: { modalType, entityId: entityId, purpose, data }
    });
  };
};

export const close = () => {
  return dispatch => {
    dispatch({ type: CLOSE_MODAL });
  };
};

export const clearMsg = () => {
  return { type: CLEAR_ERROR };
};

export const addAppointment = data => {
  return async dispatch => {
    try {
      dispatch({ type: CREATING_APPOINTMENT_REQUEST });
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: Event.getAddAppointmentURL()
      });

      if (response.status === false) {
        dispatch({
          type: CREATING_APPOINTMENT_REQUEST_COMPLETED_WITH_ERROR,
          payload: { error: response.payload.error }
        });
      } else if (response.status === true) {
        dispatch({
          type: CREATING_APPOINTMENT_REQUEST_COMPLETED,
          payload: response.payload
        });
      }

      return response;
    } catch (err) {
      throw err;
    }
  };
};

export const addReminder = data => {
  return async dispatch => {
    try {
      dispatch({ type: CREATING_REMINDER_REQUEST });
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: Event.getAddReminderURL()
      });

      if (response.status === false) {
        dispatch({
          type: CREATING_REMINDER_REQUEST_COMPLETED_WITH_ERROR,
          payload: { error: response.payload.error }
        });
      } else if (response.status === true) {
        dispatch({
          type: CREATING_REMINDER_REQUEST_COMPLETED,
          payload: response.payload
        });
      }
    } catch (err) {
      throw err;
    }
  };
};

export const reportAdverseEvent = data => {
  return async dispatch => {
    try {
      dispatch({ type: CREATING_ADVERSE_EVENT_REQUEST });
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: Event.getCreateAdverseEventURL()
      });

      if (response.status === false) {
        dispatch({
          type: CREATING_ADVERSE_EVENT_REQUEST_COMPLETED_WITH_ERROR,
          payload: { error: response.payload.error }
        });
      } else if (response.status === true) {
        dispatch({
          type: CREATING_ADVERSE_EVENT_REQUEST_COMPLETED,
          payload: response.payload
        });
      }
    } catch (err) {
      throw err;
    }
  };
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case OPEN_MODAL:
      return {
        show: true,
        modalType: payload.modalType,
        entityId: payload.entityId,
        purpose: payload.purpose,
        data: payload.data,
        subentity: payload.data
      };

    case CLOSE_MODAL:
      return {
        show: false
      };
    case CREATING_APPOINTMENT_REQUEST:
    case CREATING_REMINDER_REQUEST:
    case DISCHARGE_PATIENT_REQUEST:
    case CANCEL_APPOINTMENT:
    case CANCEL_REMINDER:
    case VERIFY_DOCUMENT_REQUEST:
    case CREATING_ADVERSE_EVENT_REQUEST:
    case REUPLOAD_IDPROOF_REQUEST:
    case REUPLOAD_CONSENTFORM_REQUEST:
    case RESCHEDULE:
    case EDIT_NOTES:
    case SHARING_ARTICLE:
      return { ...state, requesting: true };
    case CREATING_APPOINTMENT_REQUEST_COMPLETED:
    case CREATING_REMINDER_REQUEST_COMPLETED:
    case DISCHARGE_PATIENT_REQUEST_COMPLETED:
    case CANCEL_APPOINTMENT_COMPLETED:
    case CANCEL_REMINDER_COMPLETED:
    case VERIFY_DOCUMENT_REQUEST_COMPLETED:
    case CREATING_ADVERSE_EVENT_REQUEST_COMPLETED:
    case EDIT_NOTES_COMPLETED:
    case RESCHEDULE_COMPLETED:
    case CHANGING_PASSWORD_COMPLETED:
    case SHARING_ARTICLE_COMPLETED:
      return {
        show: false,
        requesting: false
      };
    case CREATING_APPOINTMENT_REQUEST_COMPLETED_WITH_ERROR:
    case CREATING_REMINDER_REQUEST_COMPLETED_WITH_ERROR:
    case DISCHARGE_PATIENT_REQUEST_COMPLETED_WITH_ERROR:
    case CANCEL_APPOINTMENT_COMPLETED_WITH_ERROR:
    case CANCEL_REMINDER_COMPLETED_WITH_ERROR:
    case VERIFY_DOCUMENT_REQUEST_COMPLETED_WITH_ERROR:
    case CREATING_ADVERSE_EVENT_REQUEST_COMPLETED_WITH_ERROR:
    case REUPLOAD_IDPROOF_REQUEST_COMPLETED_WITH_ERROR:
    case REUPLOAD_CONSENTFORM_REQUEST_COMPLETED_WITH_ERROR:
    case EDIT_NOTES_COMPLETED_WITH_ERROR:
    case RESCHEDULE_COMPLETED_WITH_ERROR:
    case SHARING_ARTICLE_COMPLETED_WITH_ERROR:
      return {
        ...state,
        requesting: false,
        is_error: false,
        error: payload.error
      };

    case REUPLOAD_IDPROOF_REQUEST_COMPLETED:
    case REUPLOAD_CONSENTFORM_REQUEST_COMPLETED:
      return {
        ...state,
        show: true,
        requesting: false
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: {}
      };
    default:
      return state;
  }
};
