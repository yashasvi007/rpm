import { REQUEST_TYPE } from "../../../constant";
import { User } from "../../../Helper/urls";
import { doRequest } from "../../../Helper/network";

import { FETCH_ADVERSE_EVENT_COMPLETED } from "../../../modules/events";

const FETCHING_PATIENT_DATA_BY_ID = "FETCHING_PATIENT_DATA_BY_ID";
const FETCHING_PATIENT_DATA_BY_ID_COMPLETED =
  "FETCHING_PATIENT_DATA_BY_ID_COMPLETED";
const FETCHING_PATIENT_DATA_BY_ID_COMPLETED_WITH_ERROR =
  "FETCHING_PATIENT_DATA_BY_ID_COMPLETED_WITH_ERROR";

export const fetchPatient = userId => {
  return async dispatch => {
    dispatch({ type: FETCHING_PATIENT_DATA_BY_ID });
    try {
      const response = await doRequest({
        url: User.getUserByIdURL(userId),
        method: REQUEST_TYPE.GET
      });

      const { status, payload } = response;
      const { data } = payload;
      if (status === true) {
        dispatch({
          type: FETCHING_PATIENT_DATA_BY_ID_COMPLETED,
          payload: { ...data, userId }
        });
      } else if (status === false) {
        dispatch({
          type: FETCHING_PATIENT_DATA_BY_ID_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
      return status;
    } catch (err) {
      throw new Error(err);
    }
  };
};

const setAdverseEvent = (state, data) => {
  const { adverseEvent } = data;
  return { ...state, adverseEvent: adverseEvent };
};

const initial_state = {
  id: "",
  is_error: false,
  is_loading: true,
  is_data_loaded: false,
  error: ""
};

export default (state = initial_state, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case FETCHING_PATIENT_DATA_BY_ID: {
      return {
        ...state,
        is_loading: true
      };
    }

    case FETCHING_PATIENT_DATA_BY_ID_COMPLETED: {
      return {
        ...state,
        id: payload.userId,
        is_loading: false,
        is_data_loaded: true
      };
    }
    case FETCHING_PATIENT_DATA_BY_ID_COMPLETED_WITH_ERROR: {
      return {
        ...state,
        is_error: true,
        error: payload.error,
        is_loading: false,
        is_data_loaded: false
      };
    }
    case FETCH_ADVERSE_EVENT_COMPLETED:
      return setAdverseEvent(state, payload);
    default: {
      return state;
    }
  }
};
