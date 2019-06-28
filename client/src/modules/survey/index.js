import { doRequest } from "../../Helper/network";
import { Survey, User } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";

const FETCHING_SURVEYS = "FETCHING_SURVEYS";
const FETCHING_SURVEYS_COMPLETED = "FETCHING_SURVEYS_COMPLETED";
const FETCHING_SURVEYS_COMPLETED_WITH_ERROR =
  "FETCHING_SURVEYS_COMPLETED_WITH_ERROR";
const CREATING_SURVEYS = "CREATING_SURVEYS";
export const CREATING_SURVEYS_COMPLETED = "CREATING_SURVEYS_COMPLETED";
const CREATING_SURVEYS_COMPLETED_WITH_ERROR =
  "CREATING_SURVEYS_COMPLETED_WITH_ERROR";
const ENDING_SURVEYS = "ENDING_SURVEYS";
const ENDING_SURVEYS_COMPLETED = "ENDING_SURVEYS_COMPLETED";
const ENDING_SURVEYS_COMPLETED_WITH_ERROR =
  "ENDING_SURVEYS_COMPLETED_WITH_ERROR";

const FETCHING_SURVEYS_BY_ID = "FETCHING_SURVEYS_BY_ID";
const FETCHING_SURVEYS_BY_ID_COMPLETED = "FETCHING_SURVEYS_BY_ID_COMPLETED";
export const FETCHING_SURVEYS_BY_ID_COMPLETED_WITH_ERROR =
  "FETCHING_SURVEYS_BY_ID_COMPLETED_WITH_ERROR";

const ADDING_RESPONSE = "ADDING_RESPONSE";
const ADDING_RESPONSE_COMPLETED = "ADDING_RESPONSE_COMPLETED";
const ADDING_RESPONSE_COMPLETED_WITH_ERROR =
  "ADDING_RESPONSE_COMPLETED_WITH_ERROR";

const FETCHING_PARTICIPANTS_BY_STATUS = "FETCHING_PARTICIPANTS_BY_STATUS";
const FETCHING_PARTICIPANTS_BY_STATUS_COMPLETED =
  "FETCHING_PARTICIPANTS_BY_STATUS_COMPLETED";
const FETCHING_PARTICIPANTS_BY_STATUS_COMPLETED_WITH_ERROR =
  "FETCHING_PARTICIPANTS_BY_STATUS_COMPLETED_WITH_ERROR";

const FETCHING_CARECOACH_SURVEYS = "FETCHING_CARECOACH_SURVEYS";
const FETCHING_CARECOACH_SURVEYS_COMPLETED =
  "FETCHING_CARECOACH_SURVEYS_COMPLETED";
const FETCHING_CARECOACH_SURVEYS_COMPLETED_WITH_ERROR =
  "FETCHING_CARECOACH_SURVEYS_COMPLETED_WITH_ERROR";

const FETCH_RECENTLY_SENT_SURVEYS = "FETCH_RECENTLY_SENT_SURVEYS";
const FETCH_RECENTLY_SENT_SURVEYS_COMPLETED =
  "FETCH_RECENTLY_SENT_SURVEYS_COMPLETED";
const FETCH_RECENTLY_SENT_SURVEYS_COMPLETED_WITH_ERROR =
  "FETCH_RECENTLY_SENT_SURVEYS_COMPLETED_WITH_ERROR";

function setSurvey(state, data) {
  const { surveys } = data;
  if (surveys) {
    const prevsurveys = { ...state };
    let newState = Object.assign({}, prevsurveys, surveys);
    return { ...newState };
  } else {
    return state;
  }
}

const setRecentSurveys = (state, data) => {
  const recentSurveys = Object.keys(data);
  return {
    ...state,
    ...data,
    recentlyAdded: recentSurveys
  };
};

export const createSurveys = data => {
  return async dispatch => {
    try {
      dispatch({ type: CREATING_SURVEYS });
      let response = await doRequest({
        data,
        method: REQUEST_TYPE.POST,
        url: Survey.getCreateSurveyURL()
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: CREATING_SURVEYS_COMPLETED,
          payload: { data: payload.data, message: payload.message }
        });
      } else if (response.status === false) {
        dispatch({
          type: CREATING_SURVEYS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
      return status;
    } catch (error) {
      throw error;
      //
    }
  };
};

export const updateSurveys = (data, surveyId) => {
  return async dispatch => {
    try {
      dispatch({ type: CREATING_SURVEYS });
      let response = await doRequest({
        data,
        method: REQUEST_TYPE.POST,
        url: Survey.getUpdateSurveyCompletedURL(surveyId)
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: CREATING_SURVEYS_COMPLETED,
          payload: { data: payload.data, message: payload.message }
        });
      } else if (response.status === false) {
        dispatch({
          type: CREATING_SURVEYS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
      return status;
    } catch (error) {
      throw error;
      //
    }
  };
};

export const fetchSurveys = Status => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_SURVEYS });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Survey.getFetchSurveyByStatusURL(Status)
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_SURVEYS_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_SURVEYS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {
      throw error;
      //
    }
  };
};

export const fetchCareCoachSurveys = () => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_CARECOACH_SURVEYS });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: User.fetchCareCoachSurveyURL()
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_CARECOACH_SURVEYS_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_CARECOACH_SURVEYS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {
      throw error;
      //
    }
  };
};

export const fetchSurveysById = surveyId => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_SURVEYS_BY_ID });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Survey.getSurveyByIdURL(surveyId)
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_SURVEYS_BY_ID_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_SURVEYS_BY_ID_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
      return response;
    } catch (error) {
      throw error;
      //
    }
  };
};

export const endSurveys = surveyId => {
  return async dispatch => {
    try {
      dispatch({ type: ENDING_SURVEYS });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Survey.getSurveyEndURL(surveyId)
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: ENDING_SURVEYS_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: ENDING_SURVEYS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {
      throw error;
      //
    }
  };
};

export const addResponse = (surveyId, data, completedOn) => {
  return async dispatch => {
    try {
      dispatch({ type: ADDING_RESPONSE });
      let response = await doRequest({
        data: { data, completedOn },
        method: REQUEST_TYPE.POST,
        url: Survey.getAddParticipantResponseURL(surveyId)
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: ADDING_RESPONSE_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: ADDING_RESPONSE_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {
      throw error;
      //
    }
  };
};

export const fetchPaticipantForSurveyBasedOnStatus = (surveyId, Status) => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_PARTICIPANTS_BY_STATUS });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Survey.getFetchParticicpantByStatusURL(surveyId, Status)
      });
      //
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_PARTICIPANTS_BY_STATUS_COMPLETED,
          payload: payload.data,
          surveyId: surveyId
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_PARTICIPANTS_BY_STATUS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {
      throw error;
      //
    }
  };
};

export const fetchRecentlySentSurveys = (programIds, statuses) => {
  return async dispatch => {
    try {
      dispatch({ type: FETCH_RECENTLY_SENT_SURVEYS });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Survey.getRecentlySentSurveysURL(),
        params: {
          programIds: JSON.stringify(programIds),
          statuses: statuses ? JSON.stringify(statuses) : []
        }
      });
      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: FETCH_RECENTLY_SENT_SURVEYS_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCH_RECENTLY_SENT_SURVEYS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

const intialState = {
  is_error: false,
  is_created: false,
  error: ""
};

export default (state = intialState, action) => {
  const { type, payload = {}, message, surveyId } = action;
  switch (type) {
    case FETCHING_SURVEYS_COMPLETED:
      return setSurvey(state, payload);
    case FETCHING_SURVEYS_BY_ID_COMPLETED:
      return setSurvey(state, payload);
    case FETCHING_SURVEYS_COMPLETED_WITH_ERROR:
      return {
        ...state
      };
    case FETCHING_PARTICIPANTS_BY_STATUS_COMPLETED: {
      const { participantsId } = payload;
      return {
        ...state,
        participantsId: { [surveyId]: participantsId }
      };
    }
    case FETCH_RECENTLY_SENT_SURVEYS_COMPLETED: {
      return setRecentSurveys(state, payload);
    }
    default:
      return setSurvey(state, payload, message);
  }
};
