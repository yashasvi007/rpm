import { doRequest } from "../../Helper/network";
import { Phone } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";
const RESET = "reset";
const SENDING_OTP = "SENDING_OTP";
export const SENDING_OTP_COMPLETED = "SENDING_OTP_COMPLETED";
const SENDING_OTP_COMPLETED_WITH_ERROR = "SENDING_OTP_COMPLETED_WITH_ERROR";

const VERIFYING_OTP = "VERIFYING_OTP";
export const VERIFYING_OTP_COMPLETED = "VERIFYING_OTP_COMPLETED";
const VERIFYING_OTP_COMPLETED_WITH_ERROR = "VERIFYING_OTP_COMPLETED_WITH_ERROR";

const initialState = {
  isError: false,
  error: {}
};

export const reset = () => {
  return dispatch => {
    dispatch({ type: RESET });
  };
};

export const sendOtp = (data = {}, id) => {
  return async dispatch => {
    try {
      dispatch({ type: SENDING_OTP });
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: { contactNo: data, id },
        url: Phone.getSendOtpURL()
      });
      const { status, payload } = response;

      if (status) {
        dispatch({
          type: SENDING_OTP_COMPLETED,
          payload: { contactNo: { ...data, verified: false }, id: id }
        });
      } else {
        dispatch({
          type: SENDING_OTP_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const verifyOtp = (data = {}, id) => {
  return async dispatch => {
    try {
      dispatch({ type: VERIFYING_OTP });

      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: { otp: data, id },
        url: Phone.getVerifyOtpURL()
      });

      const { status, payload } = response;

      if (status) {
        dispatch({
          type: VERIFYING_OTP_COMPLETED,
          payload: {
            contactNo: { verified: true },
            id: id,
            show_otp_modal: false
          }
        });
      } else {
        dispatch({
          type: VERIFYING_OTP_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case VERIFYING_OTP:
      return {
        ...state,
        is_otp_verifying: true,
        is_otp_verified: false,
        is_otp_error: false,
        otp_error: {}
      };

    case VERIFYING_OTP_COMPLETED:
      return {
        ...state,
        is_otp_verifying: false,
        is_otp_verified: true,
        is_otp_error: false,
        otp_error: {}
      };
    case VERIFYING_OTP_COMPLETED_WITH_ERROR:
      return {
        ...state,
        is_otp_verifying: false,
        is_otp_verified: false,
        is_otp_error: true,
        otp_error: payload
      };
    case SENDING_OTP:
      return {
        is_sending_otp: true,
        error: {}
      };

    case SENDING_OTP_COMPLETED:
      return {
        ...state,
        is_sending_otp: false,
        is_otp_send: true,
        is_otp_error: false,
        error: {}
      };

    case SENDING_OTP_COMPLETED_WITH_ERROR:
      return {
        is_sending_otp: false,
        is_otp_send: false,
        is_otp_error: true,
        otp_error: payload
      };

    case RESET: {
      return initialState;
    }
    default:
      return state;
  }
};
