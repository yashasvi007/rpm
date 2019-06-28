import { connect } from "react-redux";
import CalendarCard from "../../Components/Calendar/calendarCard";
import { withRouter } from "react-router-dom";

import { setAppointmentStatus } from "../../modules/events";
import { open } from "../../modules/modals";
import { GLOBAL_MODALS, EVENT_ACTION } from "../../constant";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    openCancelModal: (entityId, subentity) =>
      dispatch(
        open(GLOBAL_MODALS.CANCEL_APPOINTMENT, entityId, null, subentity)
      ), //replace your modal type here
    rescheduleEvent: (entityId, series) =>
      dispatch(
        open(GLOBAL_MODALS.EVENT_MODAL, entityId, EVENT_ACTION.RESCHEDULE, {
          series
        })
      ),
    editNotes: entityId =>
      dispatch(
        open(GLOBAL_MODALS.EVENT_MODAL, entityId, EVENT_ACTION.EDIT_NOTES)
      ),
    setAppointmentStatus: details => dispatch(setAppointmentStatus(details))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CalendarCard)
);
