import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import isEmpty from "lodash-es/isEmpty";
import Questions from "../Question";
import messages from "./message";

class SurveyPane extends Component {
  componentDidMount() {
    const { fetchSurveyTemplates } = this.props;
    fetchSurveyTemplates();
  }

  render() {
    const {
      surveytemplateId,
      questions: surveyQuestion,
      surveytemplates = [],
      intl: { formatMessage }
    } = this.props;
    let questionsId = [];
    let surveyDescription = "";
    let timeToComplete = 0;
    if (surveytemplates[surveytemplateId]) {
      const { questions, description, time_to_complete } = surveytemplates[
        surveytemplateId
      ];
      questionsId = questions;
      surveyDescription = description;
      timeToComplete = time_to_complete;
    }
    return (
      <Fragment>
        <div className="survey-content">
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
      </Fragment>
    );
  }
}

export default injectIntl(SurveyPane);
