import CreateSurvey from "../../../Components/CreateSurvey";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import {
  fetchProgramsData,
  fetchProgramPatient
} from "../../../../modules/program";
import { makeGetUserById } from "../../../../modules/user/selector";
import {
  fetchQuestions,
  getValidProgramForSurvey
} from "../../../../modules/page/createSurvey";
import { fetchSurveyTemplates } from "../../../../modules/surveyTemplate";
import survey, { createSurveys } from "../../../../modules/survey";
import { USER_STATUS } from "../../../../constant";
const mapStateToProps = state => {
  const {
    programs,
    users,
    auth,
    hospitals,
    surveytemplates,
    page: { createSurvey = {} } = {},
    surveys
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
    availableProgram: createSurvey.availableProgram,
    is_error: surveys.is_error,
    error: survey.error
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
    fetchSurveyTemplates: () => dispatch(fetchSurveyTemplates()),
    createSurveys: data => dispatch(createSurveys(data)),
    getValidProgramForSurvey: templateId =>
      dispatch(getValidProgramForSurvey(templateId))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateSurvey)
);
