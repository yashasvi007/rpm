import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import messages from "../message";
import "./style.less";
import { USER_CATEGORY, DASHBOARD_MENU } from "../../../constant";
import SurveyCard from "../../Cards/surveyCard";
import PatientSurveyCard from "../../Cards/patientSurveyCard";
import { downloadReport } from "../../Surveys/completedSurvey";

class DashboardSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  componentDidMount() {
    const {
      fetchRecentlySentSurveys,
      users,
      loggedInUser,
      fetchProgramsData
    } = this.props;
    const {
      programId: programIds = {},
      basicInfo: { category }
    } = users[loggedInUser] || {};
    if (category === USER_CATEGORY.PATIENT) {
      const status = ["INPROGRESS"];
      fetchRecentlySentSurveys(programIds, status);
    } else if (category === USER_CATEGORY.CARE_COACH) {
      fetchProgramsData();
      fetchRecentlySentSurveys(programIds);
    }
  }

  goToSurveyDashboard = () => {
    const { setTabDashboard } = this.props;
    setTabDashboard(DASHBOARD_MENU.SURVEYS);
  };

  renderHeader() {
    const { formatMessage } = this;
    const { users, loggedInUser } = this.props;
    const { basicInfo: { category } = {} } = users[loggedInUser] || {};
    return (
      <div className="appointment-header">
        <div className="header-title">
          {category === USER_CATEGORY.CARE_COACH
            ? formatMessage(messages.dashboardSurveys)
            : formatMessage(messages.dashboardPatientSurveys)}
        </div>
      </div>
    );
  }

  handleOnClick = id => {
    this.props.history.replace(`/survey/${id}`);
  };

  renderSurveysForCareCoach() {
    const { handleOnClick } = this;
    const { surveys, programs } = this.props;
    const { recentlyAdded } = surveys;
    const surveyData = [];
    if (recentlyAdded) {
      recentlyAdded.forEach(id => {
        surveyData.push(
          <SurveyCard
            key={id}
            data={surveys[id]}
            id={id}
            programs_data={programs}
            handleOnClick={() => handleOnClick(id)}
            isDashboard={true}
            handleOnDownload={downloadReport}
          />
        );
      });
    }

    return <div className="survey-body">{surveyData}</div>;
  }

  renderSurveysForPatient() {
    const { handleOnClick } = this;
    const { surveys, loggedInUser } = this.props;
    const { recentlyAdded } = surveys;
    const surveyData = [];
    if (recentlyAdded) {
      recentlyAdded.forEach(id => {
        const survey = surveys[id] || {};
        const participantCompletedSurvey =
          survey.participantCompletedSurvey || [];
        if (participantCompletedSurvey.indexOf(loggedInUser.toString()) < 0) {
          surveyData.push(
            <PatientSurveyCard
              key={id}
              surveyData={surveys[id]}
              id={id}
              handleOnClick={() => handleOnClick(id)}
            />
          );
        }
      });
    }

    return <div className="survey-body">{surveyData}</div>;
  }

  render() {
    const { users, loggedInUser } = this.props;
    const { basicInfo: { category } = {} } = users[loggedInUser] || {};
    const { formatMessage, goToSurveyDashboard } = this;

    return (
      <Fragment>
        {this.renderHeader()}
        {category === USER_CATEGORY.CARE_COACH
          ? this.renderSurveysForCareCoach()
          : ""}
        {category === USER_CATEGORY.PATIENT
          ? this.renderSurveysForPatient()
          : ""}
        <div className="flex align-items-center justify-content-end">
          <div
            className={`header-sub-title ${
              category === USER_CATEGORY.PATIENT ? "invisible" : "clickable"
            }`}
            onClick={goToSurveyDashboard}
          >
            {formatMessage(messages.dashboardViewAll)}
          </div>
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(DashboardSurvey);
