import React from "react";
import CareCoach from "./careCoachMenu";
import Doctor from "./doctorsMenu";
import Patient from "./patientsMenu";

import { USER_CATEGORY } from "../../../../constant";

export default props => {
  const { user: { basicInfo: { category } = {} } = {}, currentTab } = props;
  switch (category) {
    case USER_CATEGORY.DOCTOR:
      return <Doctor currentTab={currentTab} />;
    case USER_CATEGORY.CARE_COACH:
      return <CareCoach currentTab={currentTab} />;
    case USER_CATEGORY.PATIENT:
      return <Patient currentTab={currentTab} />;
    default:
      return null;
  }
};
