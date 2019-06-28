import React from "react";
import { Button } from "antd";
import { SURVEY_STATUS } from "../../../constant";
import "./style.less";
import moment from "moment";

const SurveyCard = ({
  data = {},
  handleOnClick,
  programs_data,
  handleOnDownload,
  isDashboard
}) => {
  const {
    endDate,
    startDate,
    participants = [],
    status = "",
    program,
    template = {},
    participantCompletedSurvey = [],
    surveyId = ""
  } = data;
  const header = () => {
    return (
      <div
        className={` flex align-items-center justify-content-space-between mb8 ${
          status === SURVEY_STATUS.COMPLETED ? "inprogress" : "completed"
        }`}
      >
        <div
          className={`fontsize12 dark ml10 Inprogressnow  flex align-items-center justify-content-center`}
        >
          {status.toLowerCase()}
        </div>
        <div>
          {(status === SURVEY_STATUS.COMPLETED ||
            status === SURVEY_STATUS.INPROGRESS) &&
          participantCompletedSurvey.length > 0 ? (
            <Button
              type="primary"
              className={
                isDashboard ? "download-report-btn" : `download-report-btn ml40`
              }
              ghost
              onClick={e => {
                e.stopPropagation();
                handleOnDownload(surveyId);
              }}
            >
              Download Report
            </Button>
          ) : (
            <Button
              className={
                isDashboard ? "download-report-btn" : `download-report-btn ml40`
              }
              onClick={e => {
                e.stopPropagation();
                return false;
              }}
              style={{
                backgroundColor: "rgba(212, 215, 217, 0.3)",
                color: "black"
              }}
              disabled
            >
              Download Report
            </Button>
          )}
        </div>
      </div>
    );
  };

  const newHeader = () => {
    return (
      <div className="survey-card-header-right">
        <div
          className={`in-progress-container ${
            status === SURVEY_STATUS.COMPLETED ||
            status === SURVEY_STATUS.INPROGRESS
              ? "inprogress"
              : "completed"
          }`}
        >
          {status.toLowerCase()}
        </div>
        <div className="survey-header-button">
          {(status === SURVEY_STATUS.COMPLETED ||
            status === SURVEY_STATUS.INPROGRESS) &&
          participantCompletedSurvey.length > 0 ? (
            <Button
              type="primary"
              ghost
              onClick={e => {
                e.stopPropagation();
                const { _id: surveyId = {} } = data || {};
                if (surveyId) {
                  handleOnDownload(surveyId);
                }
              }}
            >
              Download Report
            </Button>
          ) : (
            <Button
              onClick={e => {
                e.stopPropagation();
                return false;
              }}
              style={{
                backgroundColor: "rgba(212, 215, 217, 0.3)",
                color: "black"
              }}
              disabled
            >
              Download Report
            </Button>
          )}
        </div>
      </div>
    );
  };

  const { title } = template;
  const TotalParticipants = participants.length;
  const { name } = programs_data[program] ? programs_data[program] : {};
  const startingDate = moment(startDate).format("DD/MM/YYYY");
  const endingDate = moment(endDate).format("DD/MM/YYYY");
  return (
    <div
      className="survey-card-mobile mr16 mb16 clickable"
      onClick={e => handleOnClick(surveyId)}
    >
      <div className="card-content">
        {isDashboard ? "" : header()}

        <div className={`${isDashboard ? "survey-card-header" : ""}`}>
          {isDashboard ? newHeader() : ""}
          <span className="fontsize14 mr8 bold dark">{title}</span>
        </div>
        <span className="fontsize14 dark medium mb4 ">
          {participantCompletedSurvey.length} of {TotalParticipants} recipients
          completed
        </span>
        <div>Sent to {name} at Dubai program’s patients</div>
        <div className="fontsize12 label-color mt8">
          {startingDate}-{endingDate}
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;
