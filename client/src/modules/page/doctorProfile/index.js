import { REQUEST_TYPE } from "../../../constant";
import { User } from "../../../Helper/urls";
import { doRequest } from "../../../Helper/network";

const FETCHING_DOCTOR_DATA_BY_ID = "FETCHING_DOCTOR_DATA_BY_ID";
const FETCHING_DOCTOR_DATA_BY_ID_COMPLETED =
  "FETCHING_DOCTOR_DATA_BY_ID_COMPLETED";
const FETCHING_DOCTOR_DATA_BY_ID_COMPLETED_WITH_ERROR =
  "FETCHING_DOCTOR_DATA_BY_ID_COMPLETED_WITH_ERROR";

export const fetchDoctor = userId => {
  return async dispatch => {
    dispatch({ type: FETCHING_DOCTOR_DATA_BY_ID });
    try {
      const response = await doRequest({
        url: User.getUserByIdURL(userId),
        method: REQUEST_TYPE.GET
      });

      const { status, payload } = response;
      const { message, data } = payload;
      if (status === true) {
        dispatch({
          type: FETCHING_DOCTOR_DATA_BY_ID_COMPLETED,
          payload: { ...data, userId, message }
        });
      } else if (status === false) {
        dispatch({
          type: FETCHING_DOCTOR_DATA_BY_ID_COMPLETED_WITH_ERROR,
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
    case FETCHING_DOCTOR_DATA_BY_ID: {
      return {
        ...state,
        is_loading: true
      };
    }

    case FETCHING_DOCTOR_DATA_BY_ID_COMPLETED: {
      return {
        ...state,
        id: payload.userId,
        is_loading: false
      };
    }
    case FETCHING_DOCTOR_DATA_BY_ID_COMPLETED_WITH_ERROR: {
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
