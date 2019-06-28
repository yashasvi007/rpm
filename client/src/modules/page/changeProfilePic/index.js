import { doRequest } from "../../../Helper/network";
import { User } from "../../../Helper/urls";
import { REQUEST_TYPE } from "../../../constant";

const CHANGING_PROFILE_PIC = "CHANGING_PROFILE_PIC";
export const CHANGING_PROFILE_PIC_COMPLETED = "CHANGING_PROFILE_PIC_COMPLETED";
const CHANGING_PROFILE_PIC_COMPLETED_WITH_ERROR =
  "CHANGING_PROFILE_PIC_COMPLETED_WITH_ERROR";

const intial_state = {};

export const changeProfilePic = (data, id) => {
  return async dispatch => {
    try {
      dispatch({ type: CHANGING_PROFILE_PIC });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        headers: { "Content-Type": "multipart/form-data" },
        url: User.getChangeProfilePicURL(id),
        params: { id: id }
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: CHANGING_PROFILE_PIC_COMPLETED,
          payload: { id: id, profilePicUrl: payload.data.pic_url }
        });
      } else if (status === false) {
        dispatch({
          type: CHANGING_PROFILE_PIC_COMPLETED_WITH_ERROR,
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
    case CHANGING_PROFILE_PIC:
      return {
        ...state,
        is_profile_pic_changing: true,
        is_profile_pic_changed: false,
        is_profile_pic_changing_error: false,
        profile_pic_changing_error: {}
      };
    case CHANGING_PROFILE_PIC_COMPLETED:
      return {
        ...state,
        is_profile_pic_changing: false,
        is_profile_pic_changed: true,
        is_profile_pic_changing_error: false,
        profile_pic_changing_error: {}
      };
    case CHANGING_PROFILE_PIC_COMPLETED_WITH_ERROR:
      return {
        ...state,
        is_profile_pic_changing: false,
        is_profile_pic_changed: false,
        is_profile_pic_changing_error: true,
        profile_pic_changing_error: payload
      };
    default:
      return state;
  }
};
