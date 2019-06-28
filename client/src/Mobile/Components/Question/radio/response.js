import React, { Component, Fragment } from "react";

class RadioResposne extends Component {
  render() {
    const { data, patientResponse = {} } = this.props;
    const { _id: QuestionId } = data;
    const responseId = Object.keys(patientResponse);
    const validResponseId = responseId.filter(id => {
      const Qresposne = patientResponse[id];
      const { questionId = "" } = Qresposne;
      if (questionId === QuestionId) {
        return true;
      }
      return false;
    });
    const questionResponse = patientResponse[validResponseId]
      ? patientResponse[validResponseId]
      : {};
    const { response = {} } = questionResponse;
    const { id, value } = response;
    return (
      <Fragment>
        {
          <div key={id}>
            {id}. {value}
          </div>
        }
      </Fragment>
    );
  }
}

export default RadioResposne;
