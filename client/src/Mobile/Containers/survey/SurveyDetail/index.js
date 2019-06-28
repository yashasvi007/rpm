import SurveyDetail from "../../../Components/SurveyDetail";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { USER_STATUS, GLOBAL_MODALS } from "../../../../constant";

import {
  fetchProgramsData,
  fetchProgramPatient
} from "../../../../modules/program";
import { makeGetUserById } from "../../../../modules/user/selector";
import { fetchQuestions } from "../../../../modules/page/createSurvey";
import { fetchSurveyTemplates } from "../../../../modules/surveyTemplate";
import {
  fetchSurveys,
  updateSurveys,
  endSurveys,
  fetchSurveysById,
  addResponse,
  fetchPaticipantForSurveyBasedOnStatus
} from "../../../../modules/survey";

import { open } from "../../../../modules/modals";

const mapStateToProps = state => {
  const {
    programs,
    users,
    auth,
    hospitals,
    surveytemplates,
    surveys,
    page: { createSurvey = {} } = {}
  } = state;

  const getUser = makeGetUserById();
  return {
    user_data: getUser(users, auth.authenticated_user),
    users,
    programs_data: programs,
    hospitals_data: hospitals,
    surveytemplates_data: surveytemplates,
    questions: createSurvey.questions,
    surveytemplates,
    surveys
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProgramPatient: (programId, filterBy, sortBy, query) =>
      dispatch(
        fetchProgramPatient(programId, filterBy, sortBy, {
          q: query,
          status: `!${USER_STATUS.INACTIVE}`
        })
      ),
    fetchProgramsData: () => dispatch(fetchProgramsData()),
    fetchQuestions: templateId => dispatch(fetchQuestions(templateId)),
    fetchSurveys: status => dispatch(fetchSurveys(status)),
    fetchSurveyTemplates: () => dispatch(fetchSurveyTemplates()),
    updateSurveys: (data, surveyId) => dispatch(updateSurveys(data, surveyId)),
    endSurveys: surveyId => dispatch(endSurveys(surveyId)),
    fetchSurveysById: surveyId => dispatch(fetchSurveysById(surveyId)),
    addResponse: (surveyId, data, completedOn) =>
      dispatch(addResponse(surveyId, data, completedOn)),
    fetchPaticipantForSurveyBasedOnStatus: (surveyId, status) =>
      dispatch(fetchPaticipantForSurveyBasedOnStatus(surveyId, status)),
    openEndSurveyModal: (surveyId, programId) =>
      dispatch(open(GLOBAL_MODALS.END_SURVEY, surveyId, null, programId))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SurveyDetail)
);
