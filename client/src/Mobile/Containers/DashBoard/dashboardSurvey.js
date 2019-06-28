import { connect } from "react-redux";
import { fetchRecentlySentSurveys } from "../../../modules/survey";
import { fetchProgramsData } from "../../../modules/program";
import DashboardSurvey from "../../Components/DashBoard/common/DashboardSurvey";

const mapStateToProps = state => {
  const { surveys, users, auth, programs } = state;
  return {
    surveys: surveys,
    users: users,
    loggedInUser: auth.authenticated_user,
    programs: programs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchRecentlySentSurveys: (programIds, statuses) =>
      dispatch(fetchRecentlySentSurveys(programIds, statuses)),
    fetchProgramsData: () => dispatch(fetchProgramsData())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardSurvey);
