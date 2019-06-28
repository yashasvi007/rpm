import { doRequest } from "../../../Helper/network";
import { User } from "../../../Helper/urls";
import { REQUEST_TYPE } from "../../../constant";

const CHANGING_PASSWORD = "CHANGING_PASSWORD";
export const CHANGING_PASSWORD_COMPLETED = "CHANGING_PASSWORD_COMPLETED";
const CHANGING_PASSWORD_COMPLETED_WITH_ERROR =
  "CHANGING_PASSWORD_COMPLETED_WITH_ERROR";

const intial_state = {};

export const changePassword = data => {
  return async dispatch => {
    try {
      dispatch({ type: CHANGING_PASSWORD });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: User.getChangePasswordURL()
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({ type: CHANGING_PASSWORD_COMPLETED, payload });
      } else if (status === false) {
        dispatch({
          type: CHANGING_PASSWORD_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

export default (state = intial_state, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case CHANGING_PASSWORD:
      return {
        ...state,
        is_password_changing: true,
        is_password_changed: false,
        is_changing_password_error: false,
        change_password_error: {}
      };
    case CHANGING_PASSWORD_COMPLETED:
      return {
        ...state,
        is_password_changing: false,
        is_password_changed: true,
        is_changing_password_error: false,
        change_password_error: {}
      };
    case CHANGING_PASSWORD_COMPLETED_WITH_ERROR:
      return {
        ...state,
        is_password_changing: false,
        is_password_changed: false,
        is_changing_password_error: true,
        change_password_error: payload
      };
    default:
      return state;
  }
};
