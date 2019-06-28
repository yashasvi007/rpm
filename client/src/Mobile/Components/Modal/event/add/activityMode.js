import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Radio } from "antd";

import messages from "../message";

const { Group: RadioGroup, Button: RadioButton } = Radio;

class ActivityMode extends Component {
  onChangeActivityMode = e => {
    e.preventDefault();
    const { onChangeActivityMode } = this.props;
    onChangeActivityMode(e.target.value);
  };

  formatMessage = data => this.props.intl.formatMessage(data);
  render() {
    const { activityMode, activityType, data: { mode = {} } = {} } = this.props;
    const { disabledForEdit } = this.props;
    const activityModeOption = mode[activityType];
    console.log("act,", activityType, activityModeOption, activityMode);
    const { formatMessage, onChangeActivityMode } = this;

    return (
      <Fragment>
        <div className="label-color pb5 fontsize12">
          {formatMessage(messages.activity)}
        </div>
        <RadioGroup
          className="radio-group-tab mb24"
          buttonStyle="solid"
          disabled={disabledForEdit}
          value={activityMode}
          onChange={onChangeActivityMode}
          defaultValue={activityMode}
        >
          {activityModeOption.map(option => {
            return (
              <RadioButton
                key={option.value}
                className="full-width"
                value={option.value}
                disabled={option.disable}
              >
                {formatMessage(option.label)}
              </RadioButton>
            );
          })}
        </RadioGroup>
      </Fragment>
    );
    // }
  }
}

export default injectIntl(ActivityMode);
