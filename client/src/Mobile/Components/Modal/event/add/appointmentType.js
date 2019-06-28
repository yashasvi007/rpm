import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Radio } from "antd";

import messages from "../message";

const { Group: RadioGroup, Button: RadioButton } = Radio;

class AppointmentType extends Component {
  componentDidMount() {
    const {
      activityType,
      onChangeActivityType,
      data: { mode = {} } = {}
    } = this.props;
    const activityModeOption = mode[activityType] || [];
    for (const modeData of activityModeOption) {
      const { value, disable } = modeData;
      if (disable === false) {
        onChangeActivityType({ activityMode: value });
        break;
      }
    }
  }

  onChangeActivityType = e => {
    e.preventDefault();
    const activityType = e.target.value;
    const {
      onChangeActivityType,
      data: { mode = {} } = {},
      activityMode: prevActivityMode
    } = this.props;
    let data = { activityType };
    const activityModeOption = mode[activityType] || [];

    for (const modeData of activityModeOption) {
      const { value, disable } = modeData;
      if (disable === false) {
        data = { ...data, activityMode: value };
        break;
      }
    }

    for (const modeData of activityModeOption) {
      const { value, disable } = modeData;
      if (disable === false && prevActivityMode === value) {
        data = { ...data, activityMode: value };
        break;
      }
    }

    onChangeActivityType(data);
  };

  formatMessage = data => this.props.intl.formatMessage(data);
  render() {
    const { disabledForEdit, data: { activity } = {} } = this.props;
    const { activityType } = this.props;
    const { formatMessage, onChangeActivityType } = this;

    // if (activity.length === 1) {
    //   return (
    //     <div className="flex justify-content-start align-items-start mb24">
    //       <div className="label-color fontsize12 mr8">
    //         {formatMessage(messages.appointmentType)}
    //       </div>
    //       <div>{formatMessage(messages.forPatientApptType)}</div>
    //     </div>
    //   );
    // } else {
    return (
      <Fragment>
        <div className="label-color pb5 fontsize12">
          {formatMessage(messages.appointmentType)}
        </div>
        <RadioGroup
          className="radio-group-tab mb24"
          buttonStyle="solid"
          disabled={disabledForEdit}
          onChange={onChangeActivityType}
          defaultValue={activityType}
          value={activityType}
        >
          {activity.map(option => {
            return (
              <RadioButton
                key={option.value}
                className="full-width"
                disabled={option.disable}
                value={option.value}
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

export default injectIntl(AppointmentType);
