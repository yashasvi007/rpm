import React, { Component } from "react";
import { Button } from "antd";
import multiSelect from "../../../Assets/images/ico-multiselect.png";
import "./style.less";

class DischargeBar extends Component {
  dischargePatient = e => {
    e.preventDefault();
    const {
      dischargePatient,
      patientSelectedForDischarge,
      disableDischargeBar
    } = this.props;
    dischargePatient(patientSelectedForDischarge);
    disableDischargeBar();
  };

  render() {
    const { disableDischargeBar, patientSelectedForDischarge } = this.props;
    const { dischargePatient } = this;

    return (
      <div className="discharge-bar">
        <div className="discharge-text">
          <div
            className="image clickable"
            onClick={() => {
              disableDischargeBar();
            }}
          >
            <img alt="minus" src={multiSelect} />
          </div>
          <div className="text">
            {patientSelectedForDischarge.length} Patient
            {patientSelectedForDischarge.length > 1
              ? "s(s) selected"
              : " selected"}
          </div>
        </div>
        <Button className="warning" onClick={dischargePatient}>
          Discharge
        </Button>
      </div>
    );
  }
}

export default DischargeBar;
