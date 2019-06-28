const FIELD_ERROR = "FIELD_ERROR";
// const SERVER_ERROR = "SERVER_ERROR";
// const AUTH_ERROR = "AUTH_ERROR";
// const OTP_ERROR = "OTP_ERROR";

const initialState = {
  isError: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FIELD_ERROR:
      return {
        ...state,
        isOtpVerifying: true
      };

    // case VERIFYING_OTP_COMPLETED:
    // 	return {
    // 		...state,
    // 		isOtpVerifying: false,
    // 		isOtpVerify: true
    // 	};
    case "VERIFYING_OTP_COMPLETED_WITH_ERROR":
      return {
        ...state,
        isOtpVerifying: false,
        isOtpVerify: false,
        isError: true,
        error: action.payload
      };
    case "SENDING_OTP":
      return {
        ...state,
        isSendingOtp: true
      };

    case "SENDING_OTP_COMPLETED":
      return {
        ...state,
        isSendingOtp: false,
        isOtpSend: true
      };

    case "SENDING_OTP_COMPLETED_WITH_ERROR":
      return {
        ...state,
        isSendingOtp: false,
        isOtpSend: false,
        isError: true,
        error: action.payload
      };
    default:
      return state;
  }
};
