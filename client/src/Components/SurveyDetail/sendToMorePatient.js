import React, { Component, Fragment } from "react";
import { Row, Col } from "antd";
import PatientPane from "../SurveyTabs/patientPane";
import SurveyPane from "../SurveyTabs/surveyPane";

class SendToMorePatient extends Component {
  render() {
    const {
      surveytemplateId,
      handleOnCheck,
      handleOnSelect,
      selectedProgram,
      handleSelectChange,
      handleSortByChange,
      selectedPatient,
      uncheckAll,
      showSendSurveyBarToggle,
      surveys,
      surveyId,
      endDate,
      startDate
    } = this.props;
    return (
      <Fragment>
        <Row className="row">
          <Col span={6} className="survey-pane p24">
            <SurveyPane {...this.props} surveytemplateId={surveytemplateId} />
          </Col>
          <Col span={6} className="patient-pane">
            <PatientPane
              handleOnCheck={handleOnCheck}
              handleOnSelect={handleOnSelect}
              {...this.props}
              selectedProgram={selectedProgram}
              handleSelectChange={handleSelectChange}
              handleSortByChange={handleSortByChange}
              selectedPatient={selectedPatient}
              uncheckAll={uncheckAll}
              showSendSurveyBarToggle={showSendSurveyBarToggle}
              handleRangeChange={showSendSurveyBarToggle}
              selectedsurvey={surveys[surveyId] ? surveys[surveyId] : {}}
              startDate={startDate}
              endDate={endDate}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default SendToMorePatient;
