import React, { Component } from "react";
import { Button } from "antd";
import isEmpty from "lodash-es/isEmpty";
import { injectIntl } from "react-intl";
import GoBack from "../../../Assets/images/ico-back.svg";
import messages from "./message";

class ProfileHeader extends Component {
  onAddAppointment = e => {
    e.preventDefault();
    const {
      user_data: {
        basicInfo: { _id }
      },
      addEditAppointmentReminder
    } = this.props;
    addEditAppointmentReminder(null, _id, null);
  };

  render() {
    const {
      intl: { formatMessage },
      handleGoBack,
      user_data: { basicInfo }
    } = this.props;

    let name = "";
    if (!isEmpty(basicInfo)) {
      const { name: doctorName = "" } = basicInfo;
      name = doctorName;
    }
    const { onAddAppointment } = this;

    return (
      <div className=" profileHead ">
        <div className="flex justify-content-space-between">
          <div className="flex align-items-center">
            <img
              alt=""
              src={GoBack}
              className="backButton clickable"
              onClick={handleGoBack}
            />
            <span className="previousLocation">
              {name} {formatMessage(messages.details)}
            </span>
          </div>

          <div className="UpdateBasics">
            <Button type="primary" onClick={onAddAppointment}>
              Add Appointment/ Reminder
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(ProfileHeader);
