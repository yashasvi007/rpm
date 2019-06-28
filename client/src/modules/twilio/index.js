import { doRequest } from "../../Helper/network";
import { Twilio } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";
const intialState = {};

const FETCHING_TWILIO_VIDEO_ACCESS_TOKEN = "FETCHING_TWILIO_VIDEO_ACCESS_TOKEN";
const FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED =
  "FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED";
const FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED_WITH_ERROR =
  "FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED_WITH_ERROR";

const FETCHING_TWILIO_CHAT_ACCESS_TOKEN = "FETCHING_TWILIO_CHAT_ACCESS_TOKEN";
const FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED =
  "FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED";
const FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED_WITH_ERROR =
  "FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED_WITH_ERROR";

const setTwilioAccessToken = (state, data) => {
  const { identity = {}, token = {} } = data;
  return { ...state, identity: identity, videoToken: token };
};

const setTwilioChatAccessToken = (state, data) => {
  const { token = {} } = data;
  return { ...state, chatToken: token };
};

export const fetchVideoAccessToken = userId => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_TWILIO_VIDEO_ACCESS_TOKEN });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Twilio.getTwilioVideoAccessToken(),
        params: { userId: userId }
      });

      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const fetchChatAccessToken = userId => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_TWILIO_CHAT_ACCESS_TOKEN });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Twilio.getTwilioChatAccessToken(),
        params: { identity: userId, device: "browser" }
      });

      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export default (state = intialState, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case FETCHING_TWILIO_VIDEO_ACCESS_TOKEN_COMPLETED: {
      return setTwilioAccessToken(state, payload);
    }
    case FETCHING_TWILIO_CHAT_ACCESS_TOKEN_COMPLETED: {
      return setTwilioChatAccessToken(state, payload);
    }
    default: {
      return state;
    }
  }
};
