import React from "react";
import "./style.less";
import moment from "moment";
import LinesEllipsis from "react-lines-ellipsis";

const SurveyTemplateCard = ({ data, id, handleOnClick }) => {
  const { title, questions, description, time_to_complete, createdAt } = data;
  const checkIfNew = moment().diff(createdAt, "days", true);
  let isNew = false;
  if (checkIfNew >= 0 && checkIfNew <= 7) {
    isNew = true;
  }
  return (
    <div
      className="survey-card-mobile mr16 mb16 clickable "
      key={id}
      onClick={e => handleOnClick(id)}
    >
      <div className="card-content">
        <div className="flex align-items-center justify-content-space-between">
          <div className="fontsize14 bold dark mb8">{title}</div>
          {isNew && <div className={isNew ? "newSurvey" : ""}>New</div>}
        </div>
        <div className="fontsize14 dark medium mb4 flex align-itmes-center">
          <span className="fontsize14 dark medium mb4 ">
            {questions.length} Question
          </span>{" "}
          <span className="dot dark ml5 mr5 mt8" />{" "}
          <span className="fontsize14 dark medium mb4 ">
            {time_to_complete} to complete
          </span>
        </div>
        <div>
          <LinesEllipsis
            text={
              description
                ? description.length < 50
                  ? description
                  : description.substr(0, 50) + "..."
                : ""
            }
            maxLine="2"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        </div>
      </div>
    </div>
  );
};

export default SurveyTemplateCard;
