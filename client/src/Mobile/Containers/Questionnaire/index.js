import Questionnaire from "../../Components/Questionnaire";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { makeGetUserById } from "../../../modules/user/selector";
import { fetchQuestions } from "../../../modules/page/createSurvey";
import { fetchSurveyTemplates } from "../../../modules/surveyTemplate";

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
    fetchQuestions: templateId => dispatch(fetchQuestions(templateId)),
    fetchSurveyTemplates: () => dispatch(fetchSurveyTemplates())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Questionnaire)
);
