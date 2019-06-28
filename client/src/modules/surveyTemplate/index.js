import { doRequest } from "../../Helper/network";
import { Survey } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";
const intialState = {};

const FETCHING_SURVEY_TEMPLATES = "FETCHING_SURVEY_TEMPLATES";
const FETCHING_SURVEY_TEMPLATES_COMPLETED =
  "FETCHING_SURVEY_TEMPLATES_COMPLETED";
export const FETCHING_SURVEY_TEMPLATES_COMPLETED_WITH_ERROR =
  "FETCHING_SURVEY_TEMPLATES_COMPLETED_WITH_ERROR";

function setSurveyTemplates(state, data) {
  const { templates } = data;
  if (templates) {
    const prevtemplates = { ...state };
    let newState = Object.assign({}, prevtemplates, templates);
    return newState;
  } else {
    return state;
  }
}

export const fetchSurveyTemplates = () => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_SURVEY_TEMPLATES });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Survey.getSurveyTemplateListURL()
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_SURVEY_TEMPLATES_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_SURVEY_TEMPLATES_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {
      throw error;
      //
    }
  };
};

export default (state = intialState, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case FETCHING_SURVEY_TEMPLATES_COMPLETED:
      return setSurveyTemplates(state, payload);
    default:
      return setSurveyTemplates(state, payload);
  }
};
