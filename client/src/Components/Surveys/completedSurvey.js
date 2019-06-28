import React, { Component, Fragment } from "react";
import SurveyCard from "../Cards/surveyCard";
import { REQUEST_TYPE } from "../../constant";
import { doRequest } from "../../Helper/network";
import { Survey } from "../../Helper/urls";
const Json2csvParser = require("json2csv").Parser;
const fileDownload = require("js-file-download");

export const downloadReport = surveyId => {
  // const { match: { params: { surveyId } = {} } = {} } = this.props;
  if (surveyId) {
    // eslint-disable-next-line no-unused-vars
    const response = doRequest({
      method: REQUEST_TYPE.GET,
      url: Survey.downloadSurveyReport(surveyId)
    }).then(response => {
      const { payload: { data = {} } = {} } = response;
      let dataSource = [];
      let columns = [];
      for (const user in data) {
        const response = data[user];
        columns = [];
        columns.push("Patient Name");
        let row = [];
        row.push(user);
        for (let i = 0; i < response.length; i++) {
          columns.push("Q" + (i + 1));
          const answer = response[i].response;
          if (answer.id && answer.value) {
            row.push(answer.value);
          } else {
            row.push(answer);
          }
        }
        dataSource.push({ ...row });
      }
      const columnKeys = columns.map(column => {
        return column;
      });
      const csvHeader = new Json2csvParser({
        fields: columnKeys
      }).parse();
      const csvBody = new Json2csvParser({ header: false }).parse(dataSource);
      const csv = csvHeader + "\n" + csvBody;
      fileDownload(csv, `${surveyId}_survey_report.csv`);
    });
  }
};

class CompletedSurveys extends Component {
  componentDidMount() {
    const { fetchSurveys } = this.props;
    fetchSurveys("completed");
  }

  render() {
    const {
      surveys_data,
      programs_data,
      handleOnClick,
      completeSurveyIds = []
    } = this.props;
    //const { downloadReport } = this;
    return (
      <Fragment>
        {completeSurveyIds.map(survey => {
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

export default CompletedSurveys;
