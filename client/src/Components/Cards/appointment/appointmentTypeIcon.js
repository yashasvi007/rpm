import React from "react";

import { EVENT } from "../../../constant";

import cardVisit from "../../../Assets/images/calendar/ico-visit-activity-flat-clr.png";
import cardVisitMissed from "../../../Assets/images/calendar/ico-visit-activity-missed-flat-clr.svg";
import cardCall from "../../../Assets/images/calendar/ico-mobile-activity-flat-clr.svg";
import cardCallMissed from "../../../Assets/images/calendar/ico-mobile-activity-missed-flat-clr.svg";
import cardVideoCall from "../../../Assets/images/calendar/ico-call-activity-flat-clr.svg";
import cardVideoCallMissed from "../../../Assets/images/calendar/ico-video-activity-missed-flat-clr.svg";

const cardVisitIcon = <img className="icons" alt="" src={cardVisit} />;
const cardVisitIconMissed = (
  <img className="icons" alt="" src={cardVisitMissed} />
);
const cardCallIcon = <img className="icons" alt="" src={cardCall} />;
const cardCallIconMissed = (
  <img className="icons" alt="" src={cardCallMissed} />
);
const cardVideoCallIcon = <img className="icons" alt="" src={cardVideoCall} />;
const cardVideoCallIconMissed = (
  <img className="icons" alt="" src={cardVideoCallMissed} />
);

export default props => {
  const { event: { status, data: { activityMode: mode } = {} } = {} } = props;
  switch (mode) {
    case EVENT.ACTIVITY_MODE.CALL:
      return status === EVENT.STATUS.PASSED ? cardCallIconMissed : cardCallIcon;
    case EVENT.ACTIVITY_MODE.VISIT:
      return status === EVENT.STATUS.PASSED
        ? cardVisitIconMissed
        : cardVisitIcon;
    case EVENT.ACTIVITY_MODE.CHAT:
      return status === EVENT.STATUS.PASSED
        ? cardVideoCallIconMissed
        : cardVideoCallIcon;
    default:
      return null;
  }
};
