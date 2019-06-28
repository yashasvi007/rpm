import React, { Component } from "react";
import { Button } from "antd";
import multiselect from "../../../Assets/images/ico-multiselect.png";
import "./style.less";

class DischargeBar extends Component {
  dischargePatient = e => {
    e.preventDefault();
    const {
      dischargePatient,
      patientSelectedForDischarge,
      showDischargeBarToggle
    } = this.props;
    let ids = [];
    for (const key in patientSelectedForDischarge) {
      ids.push(key);
    }
    dischargePatient(ids);
    showDischargeBarToggle(false);
  };

  render() {
    let { showDischargeBarToggle, patientSelectedForDischarge } = this.props;
    const { dischargePatient } = this;

    return (
      <div className="flex row align-items-center w100 navBarContainer pr24 pl25">
        <div className={"flex flex row w50"}>
          <div
            className="radioBox-19-20 clickable"
            onClick={() => {
              showDischargeBarToggle(false);
            }}
          >
            <img alt="minus" src={multiselect} />
          </div>
          <div>
            {(patientSelectedForDischarge &&
              Object.keys(patientSelectedForDischarge).length) ||
              0}
            Patients(s) selected
          </div>
        </div>
        <div className={"flex flex row w50 justify-content-end"}>
          <Button className="orange-outlined-button" onClick={dischargePatient}>
            Discharge
          </Button>
        </div>
      </div>
    );
  }
}

export default DischargeBar;
