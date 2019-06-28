import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import LinesEllipsis from "react-lines-ellipsis";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import AppHeader from "../../Containers/Header";
import QuestionnaireHeader from "./questionnaireHeader";
import Questions from "../Question";
import messages from "./message";
import "./style.less";

class Questinnaire extends Component {
  componentDidMount() {
    const { fetchQuestions, fetchSurveyTemplates } = this.props;
    fetchSurveyTemplates();
    const templateId = this.props.match.params.templateId;
    if (!isEmpty(templateId)) {
      this.setState({ templateId: templateId }, this.updateBrowserhistory);
      fetchQuestions(templateId);
    }
  }

  handleGoBack = e => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const {
      questions: surveyQuestion,
      surveytemplates = [],
      intl: { formatMessage }
    } = this.props;
    const { templateId } = this.props.match.params;

    let questionsId = [];
    let surveyDescription = "";
    let SurveyTitle = "";
    let timeToComplete = 0;
    let isNew = false;

    if (surveytemplates[templateId]) {
      const {
        questions,
        description,
        time_to_complete,
        title,
        createdAt
      } = surveytemplates[templateId];
      SurveyTitle = title;
      questionsId = questions;
      surveyDescription = description;
      timeToComplete = time_to_complete;
      const checkIfNew = moment().diff(createdAt, "days", true);

      if (checkIfNew >= 0 && checkIfNew <= 7) {
        isNew = true;
      }
    }

    return (
      <Fragment>
        <AppHeader />
        <div className="survey-content-wrapper">
          <div className="survey-content mt24">
            <LinesEllipsis
              text={
                SurveyTitle
                  ? SurveyTitle.length < 100
                    ? SurveyTitle
                    : SurveyTitle.substr(0, 100) + "..."
                  : ""
              }
              maxLine="2"
              className="fontsize18 dark medium mb8"
              ellipsis="..."
              trimRight
              basedOn="letters"
            />
            {isNew && <div className={isNew ? "newSurvey mb16" : ""}>New</div>}
            <div className="fontsize18 bold dark ">
              {formatMessage(messages.questionnairePreview)}
            </div>
            <div className="fonstsize12 dark mb8">
              {questionsId.length} {formatMessage(messages.questions)} •{" "}
              {timeToComplete} {formatMessage(messages.toComplete)}
            </div>
            <div className="fontsize14 dark mb24">{surveyDescription}</div>
            {!isEmpty(surveyQuestion) &&
              surveyQuestion.map((question, index) => {
                const { _id } = question;
                return (
                  <Fragment key={_id}>
                    <Questions
                      data={question}
                      displayType={"readonly"}
                      index={index}
                    />
                  </Fragment>
                );
              })}
          </div>
          <QuestionnaireHeader
            handleGoBack={this.handleGoBack}
            {...this.props}
          />
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(Questinnaire);
