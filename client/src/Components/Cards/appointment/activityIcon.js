import React from "react";

import { APPOINTMENT_TYPE } from "../../../constant";

import medic from "../../../Assets/images/calendar/ico-apt-type-line.png";
import followup from "../../../Assets/images/calendar/ico-apt-type-line.png";
import material from "../../../Assets/images/calendar/ico-apt-type-line.png";

const medicationIcon = (
  <img className="icon-activity-modes" alt="" src={medic} />
);

const followupIcon = (
  <img className="icon-activity-modes" alt="" src={followup} />
);

const materialIcon = (
  <img className="icon-activity-modes" alt="" src={material} />
);

export default props => {
  const { event: { data: { activityType: type } = {} } = {} } = props;

  switch (type) {
    case APPOINTMENT_TYPE.MEDICATION:
      return medicationIcon;
    case APPOINTMENT_TYPE.MATERIAL_DELIVERY:
      return materialIcon;
    case APPOINTMENT_TYPE.FOLLOWUP:
      return followupIcon;
    default:
      return null;
  }
};
