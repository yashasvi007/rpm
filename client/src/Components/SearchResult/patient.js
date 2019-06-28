import React, { Component } from "react";
import PatientCard from "../Cards/patientCard";
import "./style.less";

class Patients extends Component {
  render() {
    const { patients, handleOnClick } = this.props;
    return patients.map(patient => {
      return (
        <PatientCard
          data={patient}
          key={patient.id}
          handleOnClick={handleOnClick}
        />
      );
    });
  }
}

export default Patients;
