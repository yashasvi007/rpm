import React, { Component, Fragment } from "react";
import TextReadOnly from "./text/readOnly";
import RadioReadOnly from "./radio/readOnly";
import CheckBoxReadOnly from "./checkbox/readOnly";
import TextWriteable from "./text/writable";
import RadioWriteable from "./radio/writable";
import CheckBoxWriteable from "./checkbox/writable";
import TestResposne from "./text/response";
import RadioResponse from "./radio/response";
import ChechboxResposne from "./checkbox/response";
import { DISPLAY_TYPE, OPTION_TYPE } from "../../constant";

class Questions extends Component {
  getOptionComponent = (data, displayType) => {
    const { type: opitionType } = data;
    const {
      index,
      questionIndex,
      onTextChange,
      onCheckboxChange,
      onRadioChange,
      patientResponse = {}
    } = this.props;

    switch (opitionType) {
      case OPTION_TYPE.TEXT:
        if (displayType === DISPLAY_TYPE.READONLY) {
          return <TextReadOnly />;
        } else if (displayType === DISPLAY_TYPE.WRITABLE) {
          return <TextWriteable data={data} onTextChange={onTextChange} />;
        } else {
          return <TestResposne data={data} patientResponse={patientResponse} />;
        }

      case OPTION_TYPE.RADIO:
        if (displayType === DISPLAY_TYPE.READONLY) {
          return <RadioReadOnly data={data} />;
        } else if (displayType === DISPLAY_TYPE.WRITABLE) {
          return (
            <RadioWriteable
              data={data}
              index={index}
              questionIndex={questionIndex}
              onRadioChange={onRadioChange}
            />
          );
        } else {
          return (
            <RadioResponse data={data} patientResponse={patientResponse} />
          );
        }

      case OPTION_TYPE.CHECKBOX:
        if (displayType === DISPLAY_TYPE.READONLY) {
          return <CheckBoxReadOnly data={data} />;
        } else if (displayType === DISPLAY_TYPE.WRITABLE) {
          return (
            <CheckBoxWriteable
              data={data}
              index={index}
              questionIndex={questionIndex}
              onCheckboxChange={onCheckboxChange}
            />
          );
        } else {
          return (
            <ChechboxResposne data={data} patientResponse={patientResponse} />
          );
        }

      default:
        break;
    }
  };

  render() {
    const { data = {}, index, displayType } = this.props;
    const { getOptionComponent } = this;
    const { statement, type } = data;
    const OptionComponent = getOptionComponent(data, displayType);
    return (
      <Fragment>
        <div className="flex align-items-center mt24">
          <div
            className={
              displayType === DISPLAY_TYPE.WRITABLE
                ? `fontsize22 dark mb8`
                : `fontsize14 dark bold`
            }
          >
            Q{index + 1}. {statement}{" "}
          </div>
          <span>
            {type === OPTION_TYPE.CHECKBOX &&
              displayType === DISPLAY_TYPE.READONLY &&
              "Check all that apply"}
            {type === OPTION_TYPE.CHECKBOX &&
              displayType === DISPLAY_TYPE.RESPONSE &&
              "Check all that apply"}
          </span>
        </div>
        <div className="fontsize16 label-color">
          {type === OPTION_TYPE.CHECKBOX &&
            displayType === DISPLAY_TYPE.WRITABLE &&
            "You can select multiple choices"}
        </div>
        <div
          className={
            displayType === DISPLAY_TYPE.RESPONSE ? `mb16  mt24` : ` mb16`
          }
        >
          {OptionComponent}
        </div>
      </Fragment>
    );
  }
}

export default Questions;
