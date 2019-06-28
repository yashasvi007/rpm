import React, { Component } from "react";
import { Button } from "antd";
import "./style.less";

class PatientSurveyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  render() {
    const { surveyData, handleOnClick } = this.props;
    const { template, _id: surveyId } = surveyData;

    return (
      <div className="patient-survey-card">
        <div className="patient-survey-card-head">
          <div className="patient-survey-card-head-left">
            <div>{template.title}</div>
            <div className="patient-survey-card-sub-heading">
              <div className="text">
                {template.questions.length} {" Questions"}
              </div>
              <div className="dot dark mr8" />
              <div className="text">
                {template.time_to_complete}
                {" to complete"}
              </div>
            </div>
          </div>
          <div className="patient-survey-card-head-right">
            <Button
              type="primary"
              ghost
              size={"small"}
              onClick={e => {
                e.stopPropagation();
                handleOnClick(surveyId);
              }}
            >
              {"Take Survey"}
            </Button>
          </div>
        </div>
        <div className="patient-survey-card-body">
          <div>{template.description}</div>
        </div>
      </div>
    );
  }
}

export default PatientSurveyCard;
