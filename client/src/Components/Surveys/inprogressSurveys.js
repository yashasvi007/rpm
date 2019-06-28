import React, { Component, Fragment } from "react";
import SurveyCard from "../Cards/surveyCard";
import { downloadReport } from "../Surveys/completedSurvey";

class InprogressSurveys extends Component {
  componentDidMount() {
    const { fetchSurveys } = this.props;
    fetchSurveys("inprogress");
  }

  render() {
    const {
      surveys_data,
      programs_data,
      handleOnClick,
      inprogressSurveyIds = []
    } = this.props;

    return (
      <Fragment>
        {inprogressSurveyIds.map(survey => {
          const { _id: id } = survey;
          return (
            <SurveyCard
              key={id}
              data={surveys_data[id]}
              id={id}
              programs_data={programs_data}
              handleOnClick={handleOnClick}
              handleOnDownload={downloadReport}
            />
          );
        })}
      </Fragment>
    );
  }
}

export default InprogressSurveys;
