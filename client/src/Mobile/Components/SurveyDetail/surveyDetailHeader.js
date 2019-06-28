/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, Fragment } from "react";
import { Button, Menu, Dropdown, Icon } from "antd";
import { injectIntl } from "react-intl";
import GoBack from "../../../Assets//images/ico-back.svg";
import multi_select from "../../../Assets/images/ico-multiselect.png";
import More from "../../../Assets/images/more_options.svg";
import "./style.less";
import { doRequest } from "../../../Helper/network";
import messages from "./message";
import { Survey } from "../../../Helper/urls";
import { REQUEST_TYPE, SURVEY_STATUS } from "../../../constant";
const Json2csvParser = require("json2csv").Parser;
const fileDownload = require("js-file-download");

class SurveyDetailHeader extends Component {
  downloadReport = () => {
    const { match: { params: { surveyId } = {} } = {} } = this.props;
    if (surveyId) {
      // eslint-disable-next-line no-unused-vars
      const response = doRequest({
        method: REQUEST_TYPE.GET,
        url: Survey.downloadSurveyReport(surveyId)
      }).then(response => {
        const { payload: { data = {} } = {} } = response;

        let dataSource = [];
        let csvHeader = "";
        for (const user in data) {
          const response = data[user];
          let columns = [];

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

          const columnKeys = columns.map(column => {
            return column;
          });
          csvHeader = new Json2csvParser({
            fields: columnKeys
          }).parse();
        }
        const csvBody = new Json2csvParser({ header: false }).parse(dataSource);
        const csv = csvHeader + "\n" + csvBody;
        fileDownload(csv, `${surveyId}_survey_report.csv`);
      });
    }
  };

  render() {
    const {
      handleGoBack,
      selectedPatient,
      showSendSurveyBarToggle,
      handleOnSentSurvey,
      handleEndSurvey,
      status = "",
      changeContent,
      intl: { formatMessage },
      surveys = {}
    } = this.props;

    const surveyId = this.props.match.params.surveyId;
    const { participantsId = {} } = surveys;
    const completedParticipant = participantsId[surveyId]
      ? participantsId[surveyId]["completed"]
      : [];
    const isDownloadValid = completedParticipant.length <= 0 ? true : false;
    const patientCount = selectedPatient.length;

    const menu =
      status !== SURVEY_STATUS.COMPLETED ? (
        <Menu>
          <Menu.Item
            key="1"
            onClick={e => {
              handleEndSurvey();
            }}
          >
            {formatMessage(messages.endSurvey)}
          </Menu.Item>
          <Menu.Item
            key="2"
            onClick={this.downloadReport}
            disabled={isDownloadValid}
          >
            {formatMessage(messages.downloadReport)}
          </Menu.Item>
        </Menu>
      ) : (
        <Menu>
          <Menu.Item
            key="2"
            onClick={this.downloadReport}
            disabled={isDownloadValid}
          >
            {formatMessage(messages.downloadReport)}
          </Menu.Item>
        </Menu>
      );
    console.log("menu", menu);
    return (
      <div className="profileHead">
        <div className="MenuOption">
          <Menu
            mode="horizontal"
            defaultSelectedKeys={["Result"]}
            className="menu-options"
          >
            <Menu.Item className="fontsize14 bold" key="Result">
              <a onClick={e => changeContent("Result")}>
                {formatMessage(messages.result)}
              </a>
            </Menu.Item>
            {status !== SURVEY_STATUS.COMPLETED && (
              <Menu.Item
                className="fontsize14  bold"
                key="Send to more patients"
              >
                <a onClick={e => changeContent("Send to more patients")}>
                  {formatMessage(messages.sendToMorePatients)}
                </a>
              </Menu.Item>
            )}
          </Menu>
        </div>
        {patientCount > 0 ? (
          <div className="flex align-items-center justify-content-space-between mt16">
            <div className="flex align-items-center">
              <div
                className="mr10 ml24"
                onClick={e => {
                  showSendSurveyBarToggle(false);
                }}
              >
                <img alt="" src={multi_select} className="multiselect" />
              </div>
              <div className="mt1">
                {patientCount} {formatMessage(messages.patientSelected)}
              </div>
            </div>
            <div className="mr24">
              <Button
                type="primary"
                className="iqvia-btn"
                onClick={handleOnSentSurvey}
              >
                {formatMessage(messages.sendSurvey)}
              </Button>
            </div>
          </div>
        ) : (
          <Fragment>
            <div className="flex justify-content-space-between h100">
              <div className="flex align-items-center ml24">
                <img
                  alt=""
                  src={GoBack}
                  className="backButton clickable mr8"
                  onClick={handleGoBack}
                />
                <span className="previousLocation">
                  {formatMessage(messages.allSurveys)}
                </span>
              </div>

              <Dropdown
                overlay={menu}
                trigger={["click"]}
                placement={"topRight"}
              >
                <div className="flex align-items-center justify-content-center mr16 more_options">
                  <img src={More} alt={"moreOptions"} />
                </div>
              </Dropdown>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default injectIntl(SurveyDetailHeader);
