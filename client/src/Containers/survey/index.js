import Survey from "../../Components/DashBoard/CareCoach/DashboardSurvey";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { fetchSurveyTemplates } from "../../modules/surveyTemplate";
import { fetchProgramsData } from "../../modules/program";
import { fetchSurveys, fetchCareCoachSurveys } from "../../modules/survey";

const mapStateToProps = state => {
  const { programs, users, hospitals, surveytemplates, surveys } = state;

  return {
    users,
    programs_data: programs,
    hospitals_data: hospitals,
    surveytemplates,
    surveys_data: surveys,
    is_survey_error: surveys.is_survey_error,
    is_survey_saved: surveys.is_survey_saved,
    survey_error: surveys.survey_error,
    success_msg: surveys.success_msg,
    completeSurvey: surveys.completed,
    inprogressSurvey: surveys.inprogress
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSurveyTemplates: () => dispatch(fetchSurveyTemplates()),
    fetchCareCoachSurveys: () => dispatch(fetchCareCoachSurveys()),
    fetchSurveys: status => dispatch(fetchSurveys(status)),
    fetchProgramsData: () => dispatch(fetchProgramsData())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Survey)
);
