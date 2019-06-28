import React from "react";

import ProgramDetailsBar from "./programDetailBar";
import DischargeBar from "./dischargeBar";

const NavBar = props => {
  return props.showDischarge &&
    Object.keys(props.patientSelectedForDischarge).length > 0 ? (
    <DischargeBar {...props} />
  ) : (
    <ProgramDetailsBar {...props} />
  );
};

export default NavBar;
