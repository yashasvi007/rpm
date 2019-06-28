import React, { Component } from "react";
import { Button } from "antd";
import { injectIntl } from "react-intl";
import moment from "moment";
import GoBack from "../../Assets/images/ico-back.svg";
import multiselect from "../../Assets/images/ico-multiselect.png";
import "./style.less";
import messages from "./message";

class SurveyDetailHeader extends Component {
  render() {
    const {
      handleGoBack,
      selectedPatient,
      showSendSurveyBarToggle,
      handleOnSentSurvey,
      surveytemplateId,
      surveytemplates = [],
      intl: { formatMessage },
      endDate
    } = this.props;
    let name = "";
    let isNew = false;
    let checkIfNew;

    if (surveytemplates[surveytemplateId]) {
      const { title, createdAt } = surveytemplates[surveytemplateId];
      name = title;
      checkIfNew = moment().diff(createdAt, "days", true);
    }
    if (checkIfNew >= 0 && checkIfNew <= 7) {
      isNew = true;
    }
    const patientCount = selectedPatient.length;
    return (
      <div className="profileHead">
        {patientCount > 0 ? (
          <div className="flex align-items-center justify-content-space-between mt16">
            <div className="flex align-items-center">
              <div
                className="mr10 ml24 radioBox-19-20  clickable"
                onClick={e => {
                  showSendSurveyBarToggle();
                }}
              >
                <img alt="" src={multiselect} />
              </div>
              <div className="mt1">
                {patientCount} {formatMessage(messages.patientsSelected)}
              </div>
            </div>
            <div className="mr24">
              <Button
                type="primary"
                className="iqvia-btn"
                onClick={handleOnSentSurvey}
                disabled={endDate === ""}
                // ghost={endDate === ""}
              >
                {formatMessage(messages.sendSurvey)}
              </Button>
            </div>
          </div>
        ) : (
          <div className="back-location flex align-items-center">
            <img
              alt=""
              src={GoBack}
              className="backButton clickable mr16"
              onClick={handleGoBack}
            />
            <span className="ml16">All Surveys</span>
            <span className="previousLocation ml16">{name}</span>
            {isNew && <span className={isNew ? "newSurvey" : ""}>New</span>}
          </div>
        )}
        {/* <div className="flex justify-content-space-between">
          <div className="flex align-items-center">
            <img alt="" src={GoBack} className="backButton clickable" />
            <span className="previousLocation">
              All Programs • Micro Labs research program at borDubai • Patient
              Details
            </span>
          </div>
        </div> */}
      </div>
    );
  }
}

export default injectIntl(SurveyDetailHeader);
