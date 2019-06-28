import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Element } from "react-scroll";
import isEmpty from "lodash-es/isEmpty";
import Questions from "../Question";
import messages from "./message";

class SurveyQuestions extends Component {
  render() {
    const {
      questions,
      templateId,
      surveytemplates = {},
      questionIndex,
      onTextChange,
      onRadioChange,
      onCheckboxChange,
      intl: { formatMessage }
    } = this.props;
    let surveyTitle = "";
    let surveyDescription = "";
    let time_to_completeSurvey = "";

    if (!isEmpty(surveytemplates)) {
      const { title, description, time_to_complete } =
        surveytemplates[templateId] || {};
      surveyTitle = title;
      surveyDescription = description;
      time_to_completeSurvey = time_to_complete;
    }
    return (
      <Fragment>
        <Element
          name={surveyTitle}
          className="element"
          id="containerElement"
          style={{
            position: "relative",
            height: "100%",
            marginBottom: "100px"
          }}
        >
          <div className="patient-survey-question">
            <div className="fontsize18 dark bold">{surveyTitle}</div>
            <div className="fontsize12 dark mb8">
              {`${questions.length} ${formatMessage(
                messages.questions
              )} • ${time_to_completeSurvey} ${formatMessage(
                messages.toComplete
              )}`}
            </div>
            <div className="fontsize14 dark surveyDescription">
              {surveyDescription}
            </div>
            {questions.map((question, index) => {
              return (
                <Element name={`${index}`} key={index}>
                  <div
                    className={
                      index <= questionIndex ? `mb48` : `mb48 disable-question`
                    }
                  >
                    <Questions
                      data={question}
                      displayType={"writable"}
                      index={index}
                      questionIndex={questionIndex}
                      onTextChange={onTextChange}
                      onRadioChange={onRadioChange}
                      onCheckboxChange={onCheckboxChange}
                    />
                  </div>
                </Element>
              );
            })}
          </div>
        </Element>
      </Fragment>
    );
  }
}

export default injectIntl(SurveyQuestions);
