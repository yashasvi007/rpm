import { REQUEST_TYPE } from "../../../constant";
import { Survey } from "../../../Helper/urls";
import { doRequest } from "../../../Helper/network";
import intersection from "lodash-es/intersection";

const FETCHING_SURVEY_QUESTIONS = "FETCHING_SURVEY_QUESTIONS";
const FETCHING_SURVEY_QUESTIONS_COMPLETED =
  "FETCHING_SURVEY_QUESTIONS_COMPLETED";
const FETCHING_SURVEY_QUESTIONS_COMPLETED_WITH_ERROR =
  "FETCHING_SURVEY_QUESTIONS_COMPLETED_WITH_ERROR";

const FETCHING_SURVEY_TEMPLATE_PROGRAM = "FETCHING_SURVEY_TEMPLATE_PROGRAM";
const FETCHING_SURVEY_TEMPLATE_PROGRAM_COMPLETED =
  "FETCHING_SURVEY_TEMPLATE_PROGRAM_COMPLETED";
export const FETCHING_SURVEY_TEMPLATE_PROGRAM_COMPLETED_WITH_ERROR =
  "FETCHING_SURVEY_TEMPLATE_PROGRAM_COMPLETED_WITH_ERROR";

const setProgramPatients = (state, data = {}, programId) => {
  const { patients } = data;

  if (patients) {
    // console.log("patiuentsssss ====> ", JSON.stringify(patients))
    let newState = { ...state };
    newState[programId] = patients;
    return { ...newState };
  } else {
    return state;
  }
};

const setAvailableProgramForSurvey = (state, data = {}) => {
  let newState = { ...state };
  newState.availableProgram = data;
  return { ...newState };
};

const setQuestions = (state, data = {}) => {
  const { questions } = data;
  if (questions) {
    const newState = state;
    newState.questions = questions;
    return { ...newState };
  } else {
    return state;
  }
};

export const fetchQuestions = surveyTemplateId => {
  return async dispatch => {
    try {
      if (surveyTemplateId) {
        dispatch({ type: FETCHING_SURVEY_QUESTIONS });
        let response = await doRequest({
          method: REQUEST_TYPE.GET,
          url: Survey.getTemplatesQuestionURL(surveyTemplateId)
        });
        const { status, payload } = response;
        if (status === true) {
          dispatch({
            type: FETCHING_SURVEY_QUESTIONS_COMPLETED,
            payload: payload.data
          });
        } else if (response.status === false) {
          dispatch({
            type: FETCHING_SURVEY_QUESTIONS_COMPLETED_WITH_ERROR,
            payload: payload.error
          });
        }
      }
    } catch (error) {
      throw error;
      //
    }
  };
};

export const getValidProgramForSurvey = surveyTemplateId => {
  return async (dispatch, getState) => {
    try {
      const store = getState();
      const { programs, surveytemplates } = store;
      const careCoachPrograms = Object.keys(programs);
      const selectedTemplate = surveytemplates[surveyTemplateId]
        ? surveytemplates[surveyTemplateId]
        : {};
      const { programs: selectedTemplateProgram = [] } = selectedTemplate;
      const intersectionOfProgram = intersection(
        careCoachPrograms,
        selectedTemplateProgram
      );
      dispatch({ type: FETCHING_SURVEY_TEMPLATE_PROGRAM });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Survey.getSurveyTemplateProgramURL(surveyTemplateId)
      });
      const { status, payload = {} } = response;
      if (status) {
        const { surveyDetail = [] } = payload.data;
        const surveyProgram = surveyDetail.map(singleSurvey => {
          return singleSurvey.program;
        });
        const availableProgram = intersectionOfProgram.filter(program => {
          if (surveyProgram.includes(program)) {
            return false;
          }
          return true;
        });
        dispatch({
          type: FETCHING_SURVEY_TEMPLATE_PROGRAM_COMPLETED,
          payload: availableProgram
        });
      } else if (status === false) {
        dispatch({
          type: FETCHING_SURVEY_TEMPLATE_PROGRAM_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {
      throw error;
    }
  };
};

const initialState = {
  questions: [],
  availableProgram: []
};

export default (state = initialState, action) => {
  const { type, payload = {}, programId = "" } = action;
  switch (type) {
    case FETCHING_SURVEY_QUESTIONS_COMPLETED: {
      return setQuestions(state, payload);
    }
    case FETCHING_SURVEY_TEMPLATE_PROGRAM_COMPLETED: {
      return setAvailableProgramForSurvey(state, payload);
    }
    default: {
      return setProgramPatients(state, payload, programId);
    }
  }
};
