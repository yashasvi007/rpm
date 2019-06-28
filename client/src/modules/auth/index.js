import { doRequest } from "../../Helper/network";
import { Auth } from "../../Helper/urls";
import { REQUEST_TYPE, path, USER_CATEGORY } from "../../constant";
import config from "../../config";
import {
  FETCHING_PROGRAMS_DATA_COMPLETED_WITH_ERROR,
  FETCHING_CURRENT_PROGRAM_DETAILS_COMPLETED_WITH_ERROR
} from "../program";
import { FETCHING_SURVEY_TEMPLATE_PROGRAM_COMPLETED_WITH_ERROR } from "../page/createSurvey";
import { FETCHING_SURVEY_TEMPLATES_COMPLETED_WITH_ERROR } from "../surveyTemplate";
import { FETCHING_SURVEYS_BY_ID_COMPLETED_WITH_ERROR } from "../survey";
import { FETCHING_ARTICLE_BY_ID_COMPLETED_WITH_ERROR } from "../articles";

const SIGNING = "SIGNING";
export const SIGNING_COMPLETED = "SIGNING_COMPLETED";
const SIGNING_COMPLETED_WITH_ERROR = "SIGNING_COMPLETED_WITH_ERROR";

const SIGNING_UP = "SIGNING_UP";
export const SIGNING_UP_COMPLETED = "SIGNING_UP_COMPLETED";
const SIGNING_UP_COMPLETED_WITH_ERROR = "SIGNING_UP_COMPLETED_WITH_ERROR";

const VALIDATING_LINK = "VALIDATING_LINK";
const VALIDATING_LINK_COMPLETED = "VALIDATING_LINK_COMPLETED";
const VALIDATING_LINK_COMPLETED_WITH_ERROR =
  "VALIDATING_LINK_COMPLETED_WITH_ERROR";

const SIGNING_OUT = "SIGNING_OUT";
const SIGNING_OUT_COMPLETED = "SIGNING_OUT_COMPLETED";
// const SIGNING_OUT_COMPLETED_WITH_ERROR = "SIGNING_OUT_COMPLETED_WITH_ERROR";

const GETTING_INITIAL_DATA = "GETTING_INITIAL_DATA";
export const GETTING_INITIAL_DATA_COMPLETED = "GETTING_INITIAL_DATA_COMPLETED";
const GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR =
  "GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR";

const RESET_ERROR = "RESET_ERROR";

export const RESET_UNAUTHORIZED_ERROR = "RESET_UNAUTHORIZED_ERROR";

const intial_state = {};

const getRedirectLink = user => {
  const {
    isIdProofUploaded,
    isConsentFormUploaded,
    isProfileCompleted,
    settings: { isCalendarSynced },
    basicInfo: { category }
  } = user;
  let redirectTo = "";
  if (!isCalendarSynced && config.CALENDAR_SYNC === true) {
    redirectTo = path.CALENDAR_SYNC;
  } else if (
    category === USER_CATEGORY.PATIENT &&
    (!isConsentFormUploaded || !isIdProofUploaded)
  ) {
    redirectTo = path.PROFILE_SETUP;
  } else if (!isProfileCompleted) {
    redirectTo = path.EDIT_PROFILE;
  }
  return redirectTo;
};

export const setUnauthorizedError = state => {
  return { ...state, unauthorizedError: true };
};

export const resetUnauthorizedError = state => {
  return { type: RESET_UNAUTHORIZED_ERROR };
};

export const clearError = () => {
  return { type: RESET_ERROR };
};

export const signIn = (data = {}) => {
  return async (dispatch, getState) => {
    try {
      const { auth = {} } = getState();
      dispatch({ type: SIGNING });
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: Auth.getSignInURL()
      });

      if (response.status === false) {
        dispatch({
          type: SIGNING_COMPLETED_WITH_ERROR,
          payload: { error: response.payload.error }
        });
      } else if (response.status === true) {
        const { lastUrl = false } = data;
        const { _id, users } = response.payload.data;
        let authRedirection = getRedirectLink(users[_id]);
        if (authRedirection.length === 0) {
          if (lastUrl && auth.unauthorizedError !== undefined) {
            authRedirection = lastUrl;
          } else {
            authRedirection = "/";
          }
        }
        dispatch({
          type: SIGNING_COMPLETED,
          payload: {
            users: response.payload.data.users,
            authenticatedUser: _id,
            authRedirection
          }
        });
      }
    } catch (err) {
      throw err;
    }
  };
};

export const signOut = (data = {}) => {
  return async dispatch => {
    try {
      dispatch({ type: SIGNING_OUT });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Auth.getSignOutURL()
      });

      const { status } = response;
      if (status === true) {
        dispatch({ type: SIGNING_OUT_COMPLETED });
        //window.location.href = "/";
      } //think and right for other cases
      return status;
    } catch (err) {
      throw err;
    }
  };
};

export const validateLink = (data = {}) => {
  return async dispatch => {
    try {
      dispatch({ type: VALIDATING_LINK });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: Auth.getValidateLinkURL()
      });
      if (response.status === false) {
        dispatch({
          type: VALIDATING_LINK_COMPLETED_WITH_ERROR,
          payload: { error: response.payload.error }
        });
      } else {
        dispatch({
          type: VALIDATING_LINK_COMPLETED,
          payload: {
            email: response.payload.data.email,
            category: response.payload.data.category,
            invitationLink: data.link
          }
        });
      }
    } catch (err) {
      throw err;
    }
  };
};

export const onAppStart = () => {
  return async dispatch => {
    try {
      const countries = await doRequest({
        method: REQUEST_TYPE.GET,
        url: "/getCountries"
      });
      dispatch({ type: GETTING_INITIAL_DATA });
      const response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Auth.getOnAppStartURl()
      });
      if (response.status === false) {
        dispatch({
          type: GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR,
          payload: {
            countryCities: { countries: countries.payload.data.country }
          }
        });
      }
      if (response.status === true) {
        const { data } = response.payload;
        const { users, _id } = data;
        const redirectTo = getRedirectLink(users[_id]);

        dispatch({
          type: GETTING_INITIAL_DATA_COMPLETED,
          payload: {
            authenticatedUser: data._id,
            users: data.users,
            countryCities: { countries: countries.payload.data.country },
            authRedirection: redirectTo
          }
        });
      }
    } catch (err) {
      dispatch({
        type: GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR
      });
    }
  };
};

export const signUp = (data = {}) => {
  return async dispatch => {
    try {
      dispatch({ type: SIGNING_UP });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: Auth.getSignUpURL()
      });

      if (response.status === false) {
        dispatch({
          type: SIGNING_UP_COMPLETED_WITH_ERROR,
          payload: { error: response.payload.error }
        });
      } else if (response.status === true) {
        const { data } = response.payload;
        const { users, _id } = data;
        const redirectTo = getRedirectLink(users[_id]);
        dispatch({
          type: SIGNING_UP_COMPLETED,
          payload: {
            authRedirection: redirectTo,
            authenticatedUser: response.payload.data._id,
            users: response.payload.data.users
          }
        });
      }
    } catch (err) {
      throw err;
    }
  };
};

function unsetUnathorizedError(state) {
  const { unauthorizedError } = state;
  if (unauthorizedError) {
    return {
      ...state,
      unauthorizedError: false
    };
  }
  return state;
}

export default (state = intial_state, action = {}) => {
  const { type, payload } = action;
  //
  switch (type) {
    case GETTING_INITIAL_DATA_COMPLETED: {
      return {
        authenticated: true,
        authenticated_user: payload.authenticatedUser,
        authRedirection: payload.authRedirection
      };
    }
    case GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR:
      return {
        authenticated: false,
        unauthorizedError: true
      };

    case SIGNING_COMPLETED_WITH_ERROR:
      return {
        authenticated: false,
        error: payload.error
      };

    case SIGNING_COMPLETED:
      return {
        authenticated: true,
        isProfileCompleted: payload.isProfileCompleted,
        isCalendarSynced: payload.isCalendarSynced,
        authenticated_user: payload.authenticatedUser,
        authRedirection: payload.authRedirection
      };

    case SIGNING_OUT_COMPLETED:
      return {
        authenticated: false,
        authRedirection: "/"
      };

    case VALIDATING_LINK_COMPLETED_WITH_ERROR:
      return {
        ...state,
        validLink: false,
        error: payload.error
      };

    case VALIDATING_LINK_COMPLETED:
      return {
        ...state,
        validLink: true,
        email: payload.email,
        category: payload.category,
        invitationLink: payload.invitationLink
      };

    case SIGNING_UP_COMPLETED_WITH_ERROR:
      return {
        authenticated: false,
        error: payload.error
      };

    case SIGNING_UP_COMPLETED:
      return {
        ...state,
        authenticated: true,
        authenticated_user: payload.authenticatedUser,
        authRedirection: payload.authRedirection,
        unauthorizedError: false
      };

    case FETCHING_PROGRAMS_DATA_COMPLETED_WITH_ERROR:
    case FETCHING_CURRENT_PROGRAM_DETAILS_COMPLETED_WITH_ERROR:
    case FETCHING_SURVEY_TEMPLATE_PROGRAM_COMPLETED_WITH_ERROR:
    case FETCHING_SURVEY_TEMPLATES_COMPLETED_WITH_ERROR:
    case FETCHING_SURVEYS_BY_ID_COMPLETED_WITH_ERROR:
    case FETCHING_ARTICLE_BY_ID_COMPLETED_WITH_ERROR:
      return setUnauthorizedError(state);

    case RESET_ERROR:
      return {
        ...state,
        error: null
      };

    case RESET_UNAUTHORIZED_ERROR:
      return unsetUnathorizedError(state);

    default: {
      //attach redirect logic here when user is not authenticated and try to do task as an authorized user
      return state;
    }
  }
};
