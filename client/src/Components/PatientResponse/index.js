import React, { Component, Fragment } from "react";
import moment from "moment";
import { Button } from "antd";
import { injectIntl } from "react-intl";
import Questions from "../Question";
import AppHeader from "../../Containers/Header";
import profilePicPlaceHolder from "../../Assets/images/ico-placeholder-userdp.svg";
import messages from "./message";
import "./style.less";
import PatientResponseHeader from "./header";

class PatientResponse extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { fetchPatientresponse, fetchPatient, fetchSurveysById } = this.props;
    const surveyId = this.props.match.params.surveyId;
    const participantId = this.props.match.params.participantId;
    fetchPatient(participantId);
    fetchSurveysById(surveyId);
    fetchPatientresponse(surveyId, participantId);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.surveys !== prevProps.surveys) {
      const surveyId = this.props.match.params.surveyId;
      const participantId = this.props.match.params.participantId;
      const { surveys, fetchQuestions } = this.props;
      const { template = {} } = surveys[surveyId];
      const { templateId } = template;
      this.setState({
        surveyId: surveyId,
        participantId: participantId
      });
      fetchQuestions(templateId);
    }
  }

  handleGoBack = e => {
    e.preventDefault();
    const { history } = this.props;

    history.goBack();
  };

  handleViewProfile = () => {
    const { participantId } = this.state;
    this.props.history.push(`/patient/${participantId}`);
  };

  render() {
    const {
      users,
      medicals_data,
      questions,
      patientResponse,
      countrySelector,
      citySelector,
      surveys,
      intl: { formatMessage },
      match,
      completedOn = ""
    } = this.props;
    const { handleGoBack } = this;
    const { participantId, surveyId } = this.state;
    let participantData = {};
    let surveyData = {};
    if (users && participantId && users[participantId]) {
      const { basicInfo = {}, personalInfo = {} } = users[participantId];
      const { name, _id, profilePicLink } = basicInfo;
      const { dob, gender, homeAddress = {} } = personalInfo;
      participantData.id = _id;
      participantData.name = name;
      participantData.gender = gender;
      participantData.profilePicLink = profilePicLink
        ? profilePicLink
        : profilePicPlaceHolder;
      participantData.age = moment().diff(dob, "years", false);
      const {
        addressLine1,
        addressLine2,
        city = false,
        country = false
      } = homeAddress;
      participantData.addressLine1 = addressLine1;
      participantData.addressLine2 = addressLine2;
      const homeCountryName = country ? countrySelector(country) : "";
      participantData.country = homeCountryName;
      const homeCityName = city ? citySelector(country, city) : "";
      participantData.city = homeCityName;
    }
    if (medicals_data && participantId && medicals_data[participantId]) {
      const { basicCondition = {} } = medicals_data[participantId];
      const { chiefComplaint } = basicCondition;
      participantData.disease = chiefComplaint;
    }
    if (surveys && surveyId && surveys[surveyId]) {
      const { template = {} } = surveys[surveyId];
      const {
        title = "",
        questions = [],
        time_to_complete = "",
        description = ""
      } = template;
      surveyData.title = title;
      surveyData.TotalQuestions = questions.length;
      surveyData.time_to_complete = time_to_complete;
      surveyData.description = description;
    }

    const CompletedDate = moment(completedOn).format("L");
    const CompletedTime = moment(completedOn).format("LT");

    return (
      <Fragment>
        <AppHeader />
        <div className="patient-survey-response-container">
          <PatientResponseHeader
            questions={questions}
            response={patientResponse}
            match={match}
            users={users}
            medicalsData={medicals_data}
            handleGoBack={handleGoBack}
            surveyTitle={surveyData.title}
          />
          <div className="patient-survey-response">
            <div className="flex align-items-center pt40">
              <div className="mr36">
                <img
                  src={participantData.profilePicLink}
                  alt=""
                  className="patient-img"
                />
              </div>
              <div className="align-self-start">
                <div className="fontsize22 dark">
                  {participantData.name}({participantData.age}{" "}
                  {participantData.gender})
                </div>
                <div className="fontsize14 dark medium">
                  {participantData.disease}
                </div>
                <div className="fontsize12 label-color ">
                  {participantData.addressLine1 &&
                    participantData.addressLine1 + ","}
                  {participantData.addressLine2 &&
                    participantData.addressLine2 + ","}
                  {participantData.city + ","}
                  {participantData.country}
                </div>
              </div>
            </div>
            <div className="mt8">
              <Button
                className="view-profile "
                onClick={this.handleViewProfile}
              >
                {formatMessage(messages.viewProfile)}
              </Button>
            </div>
            <div className="mt30">
              Survey completed on {CompletedDate}, {CompletedTime}
            </div>
            <div className="mt8 fontsize18 dark bold">{surveyData.title}</div>
            <div className="fontsize12 dark">
              {surveyData.TotalQuestions} {formatMessage(messages.questions)} •{" "}
              {surveyData.time_to_complete} {formatMessage(messages.toComplete)}
            </div>
            <div className="fontsize14 dark mt8 mb24">
              {surveyData.description}
            </div>
            <div>
              {questions.map((question, index) => {
                return (
                  <Questions
                    key={index}
                    data={question}
                    displayType={"response"}
                    index={index}
                    patientResponse={patientResponse}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(PatientResponse);
