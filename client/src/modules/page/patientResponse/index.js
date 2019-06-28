import { REQUEST_TYPE } from "../../../constant";
import { Survey } from "../../../Helper/urls";
import { doRequest } from "../../../Helper/network";

const FETCHING_PATIENT_RESPONSE = "FETCHING_PATIENT_RESPONSE";
const FETCHING_PATIENT_RESPONSE_COMPLETED =
  "FETCHING_PATIENT_RESPONSE_COMPLETED";
const FETCHING_PATIENT_RESPONSE_COMPLETED_WITH_ERROR =
  "FETCHING_PATIENT_RESPONSE_COMPLETED_WITH_ERROR";

export const fetchPatientresponse = (surveyId, patientId) => {
  return async dispatch => {
    dispatch({ type: FETCHING_PATIENT_RESPONSE });
    try {
      const response = await doRequest({
        url: Survey.getFetchPatientResponURL(surveyId, patientId),
        method: REQUEST_TYPE.GET
      });
      const { status, payload } = response;
      const { data } = payload;
      if (status === true) {
        dispatch({
          type: FETCHING_PATIENT_RESPONSE_COMPLETED,
          payload: { ...data }
        });
      } else if (status === false) {
        dispatch({
          type: FETCHING_PATIENT_RESPONSE_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

const initial_state = {
  id: "",
  is_error: false,
  is_loading: true,
  error: ""
};

export default (state = initial_state, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case FETCHING_PATIENT_RESPONSE: {
      return {
        ...state,
        is_loading: true
      };
    }

    case FETCHING_PATIENT_RESPONSE_COMPLETED: {
      const { responses, completedOn } = payload;
      return {
        ...state,
        response: responses,
        completedOn: completedOn
      };
    }
    case FETCHING_PATIENT_RESPONSE_COMPLETED_WITH_ERROR: {
      return {
        ...state,
        is_error: true,
        error: payload.error,
        is_loading: false
      };
    }
    default: {
      return state;
    }
  }
};
