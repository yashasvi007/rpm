import React, { Component } from "react";
// import PatientSurveyResponse from "../PatientSurvey";
import ParticularSurveyDetail from "./surveyDetail";
import { ENTITY } from "../../../constant";
import "./style.less";

class SurveyDetail extends Component {
  componentDidMount() {
    const { fetchSurveysById } = this.props;
    const surveyId = this.props.match.params.surveyId;
    fetchSurveysById(surveyId);
  }

  handleGoBack = e => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { user_data } = this.props;
    const { basicInfo: { category } = {} } = user_data;
    const { handleGoBack } = this;
    // if (category === ENTITY.PATIENT) {
    //   return (
    //     <PatientSurveyResponse {...this.props} handleGoBack={handleGoBack} />
    //   );
    // }

    return (
      <ParticularSurveyDetail {...this.props} handleGoBack={handleGoBack} />
    );
  }
}

export default SurveyDetail;
