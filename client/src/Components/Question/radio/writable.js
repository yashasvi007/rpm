import React, { Component, Fragment } from "react";
import { Radio } from "antd";

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class RadioWriteable extends Component {
  render() {
    const { data, questionIndex, index, onRadioChange } = this.props;
    const { options, _id: questionId } = data;
    return (
      <Fragment>
        <RadioGroup
          className="radio-group-tab"
          buttonStyle="solid"
          disabled={index > questionIndex}
        >
          {options &&
            options.map(singleOption => {
              const { id, value } = singleOption;
              return (
                <RadioButton
                  key={id}
                  className="full-width"
                  value={id}
                  onChange={e => onRadioChange(questionId, id, value)}
                >
                  {value}
                </RadioButton>
              );
            })}
        </RadioGroup>
      </Fragment>
    );
  }
}

export default RadioWriteable;
