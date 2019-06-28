import React, { Component, Fragment } from "react";
import moment from "moment";
import AppHeader from "../../Containers/Header";
import SurveyResponseHeader from "./surveyResponseHeader";
import SurveyQuestions from "./surveyQuestions";
import SurveyComplete from "./surveyComplete";

import "./style.less";

class PatientSurveyResponse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percent: 0,
      percentages: [0],
      totalQuestion: 0,
      templateId: "",
      surveyId: "",
      questionIndex: 0,
      prevDisable: true,
      nextDisable: true,
      response: {},
      isComplete: false
    };
  }
  componentDidMount() {
    const { fetchSurveysById } = this.props;
    const surveyId = this.props.match.params.surveyId;
    fetchSurveysById(surveyId).then(response => {
      const { statusCode } = response;
      if (statusCode === 402) {
        this.props.history.push("");
      }
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.surveys !== prevProps.surveys) {
      const surveyId = this.props.match.params.surveyId;
      const { surveys, fetchQuestions, fetchSurveyTemplates } = this.props;

      const { template = {} } = surveys[surveyId];
      const { templateId } = template;
      this.setState({
        templateId: templateId,
        surveyId: surveyId
      });
      fetchQuestions(templateId);
      fetchSurveyTemplates();
    } else if (this.props.questions !== prevProps.questions) {
      const { questions } = this.props;

      this.setState({
        totalQuestion: questions.length
      });
    }
  }

  increase = () => {
    const { totalQuestion, percentages } = this.state;
    let attemptedQuestions = this.state.questionIndex + 1;
    let percent = Math.round((attemptedQuestions / totalQuestion) * 100);

    if (percent > 100) {
      percent = 100;
    }

    if (percentages.includes(percent)) {
      this.setState((prevState, props) => {
        return {
          nextDisable: false,
          percent: percent,
          prevDisable: false,
          questionIndex: prevState.questionIndex + 1
        };
      });
    } else {
      this.setState((prevState, props) => {
        const { percentages } = prevState;
        return {
          nextDisable: true,
          percentages: [...percentages, percent],
          percent: percent,
          prevDisable: false,
          questionIndex: prevState.questionIndex + 1
        };
      });
    }
  };

  decline = () => {
    const { totalQuestion, percentages } = this.state;
    let attemptedQuestions = this.state.questionIndex - 1;
    let percent = Math.round((attemptedQuestions / totalQuestion) * 100);

    if (percent > 0) {
      this.setState({ prevDisable: false });
    }

    if (percent <= 0) {
      percent = 0;
      this.setState({ prevDisable: true });
    }

    if (percentages.includes(percent)) {
      this.setState((prevState, props) => {
        return {
          nextDisable: false,
          percent: percent,
          questionIndex: prevState.questionIndex - 1
        };
      });
    } else {
      this.setState((prevState, props) => {
        const { percentages } = prevState;
        return {
          nextDisable: true,
          percentages: [...percentages, percent],
          percent: percent,
          questionIndex: prevState.questionIndex - 1
        };
      });
    }
  };

  handleOnSubmit = () => {
    const { questions, addResponse } = this.props;
    const { surveyId } = this.state;
    const allQuestionId = questions.map(questions => {
      return questions._id;
    });
    const response = [];
    allQuestionId.forEach(questionId => {
      const questionResponse = this.state[questionId];
      const data = {};
      data.questionId = questionId;
      data.response = questionResponse;
      response.push(data);
    });
    const completedOn = moment();
    addResponse(surveyId, response, completedOn);
    this.setState({ isComplete: true });
  };

  onTextChange = (questionId, value) => {
    this.setState({ nextDisable: false });
    this.setState({ [questionId]: value });
  };
  onRadioChange = (questionId, id, value) => {
    this.setState({
      [questionId]: { id: id, value: value },
      nextDisable: false
    });
  };
  onCheckboxChange = (questionId, id, value) => {
    if (this.state.hasOwnProperty([questionId])) {
      const responses = this.state[questionId];
      const index = responses.findIndex(response => response.id === id);
      if (index !== -1) {
        this.setState((prevState, props) => {
          const questionResponse = prevState[questionId];
          questionResponse.splice(index, 1);
          if (questionResponse.length < 1) {
            return { nextDisable: true };
          }
          return { [questionId]: questionResponse, nextDisable: false };
        });
      } else {
        this.setState((prevState, props) => {
          const questions = prevState[questionId] || [];
          return {
            [questionId]: [...questions, { id: id, value: value }],
            nextDisable: false
          };
        });
      }
    } else {
      this.setState({
        [questionId]: [{ id: id, value: value }],
        nextDisable: false
      });
    }
  };

  render() {
    const {
      percent,
      surveyId,
      templateId,
      prevDisable,
      nextDisable,
      questionIndex,
      totalQuestion,
      isComplete
    } = this.state;
    const {
      increase,
      decline,
      onTextChange,
      onRadioChange,
      onCheckboxChange,
      handleOnSubmit
    } = this;
    const { handleGoBack } = this.props;
    if (!isComplete) {
      return (
        <Fragment>
          <AppHeader {...this.props} />
          <div className="patient-response">
            <div className="response-header-of-patient">
              <SurveyResponseHeader
                percent={percent}
                increase={increase}
                decline={decline}
                prevDisable={prevDisable}
                nextDisable={nextDisable}
                questionIndex={questionIndex}
                totalQuestion={totalQuestion}
                handleOnSubmit={handleOnSubmit}
                handleGoBack={handleGoBack}
              />
            </div>
            <div className="survey-questions">
              <SurveyQuestions
                {...this.props}
                surveyId={surveyId}
                templateId={templateId}
                questionIndex={questionIndex}
                onTextChange={onTextChange}
                onRadioChange={onRadioChange}
                onCheckboxChange={onCheckboxChange}
              />
            </div>
          </div>
        </Fragment>
      );
    }
    return <SurveyComplete {...this.props} />;
  }
}

export default PatientSurveyResponse;
