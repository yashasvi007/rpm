import React, { Component, Fragment } from "react";

class CheckBoxResponse extends Component {
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
    const { response = [] } = questionResponse;

    return (
      <Fragment>
        {response &&
          response.map(singleOption => {
            const { id, value } = singleOption;
            return (
              <div key={id}>
                {id}. {value}
              </div>
            );
          })}
      </Fragment>
    );
  }
}

export default CheckBoxResponse;
