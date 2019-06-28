import React, { Component } from "react";
import DoctorCard from "../Cards/doctorCard";
import "./style.less";

class Doctors extends Component {
  render() {
    const { doctors, handleOnClick } = this.props;
    return doctors.map(doctor => {
      return (
        <DoctorCard
          data={doctor}
          key={doctor.id}
          handleOnClick={handleOnClick}
        />
      );
    });
  }
}

export default Doctors;
