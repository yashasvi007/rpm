import { connect } from "react-redux";
import CancelModal from "../../Components/modal/event/cancel";
import { GLOBAL_MODALS } from "../../constant";
import {
  cancelAppointment,
  fetchEventsData,
  cancelReminder
} from "../../modules/events";
import { close } from "../../modules/modals";

const mapStateToProps = state => {
  const {
    modal: { show, modalType, entityId: eventId, requesting, subentity },
    events: { events = {} } = {},
    auth: { authenticated_user: currentUserId },
    users
  } = state;
  return {
    show:
      (show && modalType === GLOBAL_MODALS.CANCEL_APPOINTMENT) ||
      modalType === GLOBAL_MODALS.CANCEL_REMINDER,
    eventDetails: events[eventId],
    requesting: requesting,
    currentUserId: currentUserId,
    users: users,
    subentity: subentity
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cancelAppointment: (event, all, reason) =>
      dispatch(cancelAppointment(event, all, reason)),
    cancelReminder: (event, all) => dispatch(cancelReminder(event, all)),
    close: () => dispatch(close()),
    fetchEventsData: (userId, startDate, endDate) =>
      dispatch(fetchEventsData(userId, startDate, endDate))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CancelModal);
