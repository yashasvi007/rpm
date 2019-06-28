import React, { Component, Fragment } from "react";
import { Checkbox } from "antd";

class CheckBoxWritable extends Component {
  render() {
    const { data, index, questionIndex, onCheckboxChange } = this.props;
    const { options, _id: questionId } = data;
    return (
      <Fragment>
        {options &&
          options.map(singleOption => {
            const { id, value } = singleOption;
            return (
              <div key={id} className="flex align-items-center ml16  mt16 mb16">
                <Checkbox
                  className="mr16"
                  disabled={index > questionIndex}
                  onChange={e => onCheckboxChange(questionId, id, value)}
                />
                <div className="fontsize16 dark">{value}</div>
              </div>
            );
          })}
      </Fragment>
    );
  }
}

export default CheckBoxWritable;
