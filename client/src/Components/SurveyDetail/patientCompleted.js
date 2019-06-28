import React, { Component } from "react";
import isEmpty from "lodash-es/isEmpty";
import getPatientCardData from "../../Helper/dataFormater/patientCard";
import PatientCard from "../Cards/patientCard";

class PatientCompletedSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { fetchPaticipantForSurveyBasedOnStatus } = this.props;
    const surveyId = this.props.match.params.surveyId;
    this.setState({ surveyId: surveyId });
    fetchPaticipantForSurveyBasedOnStatus(surveyId, "COMPLETED");
  }

  render() {
    const {
      users,
      completedParticipant,
      user_data: currentUser,
      hospital: hospitals_data,
      handleOnClick
    } = this.props;
    const { surveyId } = this.state;
    let data = [];
    if (users && !isEmpty(users) && completedParticipant) {
      completedParticipant.forEach(participant => {
        let obj = {};
        obj = getPatientCardData({
          users,
          hospitals_data,
          currentUser,
          patient: users[participant]
        });
        data.push(obj);
      });
    }
    return (
      <div className="flex align-items-center flex-wrap inprogress-participants">
        {data.map(patient => {
          return (
            <PatientCard
              key={patient.id}
              data={patient}
              surveyId={surveyId}
              handleOnClick={handleOnClick}
              wantCheckBox={false}
            />
          );
        })}{" "}
      </div>
    );
  }
}

export default PatientCompletedSurvey;
