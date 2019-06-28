import { doRequest } from "../../../Helper/network";
import { User } from "../../../Helper/urls";
import { REQUEST_TYPE } from "../../../constant";
import { VERIFYING_OTP_COMPLETED } from "../../phone";
import { CHANGING_PROFILE_PIC_COMPLETED } from "../changeProfilePic";

const RESET_MSG = "RESET_EDIT_PROFILE_MSG";
const SHOW_PROFILE_PIC_MODAL = "SHOW_PROFILE_PIC_MODAL";
const CLOSE_PROFILE_PIC_MODAL = "CLOSE_PROFILE_PIC_MODAL";

const SHOW_OTP_MODAL = "SHOW_OTP_MODAL";
const CLOSE_OTP_MODAL = "CLOSE_OTP_MODAL";

// const SAVING_USER = "SAVING_USER";
export const SAVING_USER_COMPLETED = "SAVING_USER_COMPLETED";
const SAVING_USER_COMPLETED_WITH_ERROR = "SAVING_USER_COMPLETED_WITH_ERROR";

const FETCHING_USER_DATA = "FETCHING_USER_DATA";
const FETCHING_USER_DATA_COMPLETED = "FETCHING_USER_DATA_COMPLETED";
const FETCHING_USER_DATA_COMPLETED_WITH_ERROR =
  "FETCHING_USER_DATA_COMPLETED_WITH_ERROR";

export const openProfilePicModal = () => {
  return dispatch => {
    dispatch({ type: SHOW_PROFILE_PIC_MODAL });
  };
};

export const closeProfilePicModal = () => {
  return dispatch => {
    dispatch({ type: CLOSE_PROFILE_PIC_MODAL });
  };
};

export const openOtpModal = () => {
  return dispatch => {
    dispatch({ type: SHOW_OTP_MODAL });
  };
};

export const closeOtpModal = () => {
  return dispatch => {
    dispatch({ type: CLOSE_OTP_MODAL });
  };
};

export const saveUserData = (data = {}) => {
  return async dispatch => {
    const { userId } = data;
    try {
      const response = await doRequest({
        data: data,
        url: User.getEditProfileURL(),
        method: REQUEST_TYPE.POST
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: SAVING_USER_COMPLETED,
          payload: { message: payload.message, userId: userId }
        });
      } else if (status === false) {
        dispatch({
          type: SAVING_USER_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

export const fetchUser = user_id => {
  return async (dispatch, getState) => {
    const state = getState();
    const {
      auth: { authenticated_user }
    } = state;

    try {
      dispatch({ type: FETCHING_USER_DATA });
      let url = User.getMyProfileURL();

      if (user_id) {
        url = User.getUserByIdURL(user_id);
      }
      const response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: url
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_USER_DATA_COMPLETED,
          payload: {
            ...payload.data,
            currentUserId: user_id ? user_id : authenticated_user
          }
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_USER_DATA_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const clearMsg = () => {
  return dispatch => {
    dispatch({ type: RESET_MSG });
  };
};

const initial_state = {
  show_otp_modal: false,
  show_profile_pic_modal: false
};

export default (state = initial_state, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case SAVING_USER_COMPLETED: {
      return {
        ...state,
        success_msg: payload.message,
        is_profile_saved: true,
        is_profile_error: false,
        profile_error: {}
      };
    }
    case SAVING_USER_COMPLETED_WITH_ERROR: {
      return {
        ...state,
        success_msg: null,
        is_profile_error: true,
        is_profile_saved: false,
        profile_error: payload
      };
    }
    case FETCHING_USER_DATA:
      return {
        ...state,
        isLoading: true
      };
    case FETCHING_USER_DATA_COMPLETED:
      return {
        ...state,
        current_user_id: payload.currentUserId,
        isLoading: false
      };
    case FETCHING_USER_DATA_COMPLETED_WITH_ERROR:
      return {
        isLoading: false,
        error: payload
      };
    case VERIFYING_OTP_COMPLETED:
      return {
        ...state,
        show_otp_modal: false
      };
    case CHANGING_PROFILE_PIC_COMPLETED:
      return {
        ...state,
        show_profile_pic_modal: false
      };

    case RESET_MSG: {
      return {
        ...state,
        profile_error: null,
        is_profile_error: false,
        success_msg: null,
        is_profile_saved: false
      };
    }
    case SHOW_OTP_MODAL:
      return { ...state, show_otp_modal: true };
    case SHOW_PROFILE_PIC_MODAL:
      return { ...state, show_profile_pic_modal: true };
    case CLOSE_OTP_MODAL:
      return { ...state, show_otp_modal: false };
    case CLOSE_PROFILE_PIC_MODAL:
      return { ...state, show_profile_pic_modal: false };
    default: {
      return state;
    }
  }
};
