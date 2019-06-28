import { connect } from "react-redux";
import AppointmentCard from "../../Components/Cards/appointment";
import { setAppointmentStatus } from "../../../modules/events";
import { open } from "../../../modules/modals";
import { GLOBAL_MODALS, EVENT_ACTION } from "../../../constant";

const mapStateToProps = state => {
  const {
    events: { events } = {},
    users,
    auth: { authenticated_user } = {}
  } = state;
  return {
    events,
    users,
    viewerId: authenticated_user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openCancelModal: (eventId, calendarUserId) => () =>
      dispatch(
        open(GLOBAL_MODALS.CANCEL_APPOINTMENT, eventId, null, calendarUserId)
      ),
    rescheduleEvent: eventId => series =>
      dispatch(
        open(GLOBAL_MODALS.EVENT_MODAL, eventId, EVENT_ACTION.RESCHEDULE, {
          series
        })
      ),
    editNotes: eventId => () =>
      dispatch(
        open(GLOBAL_MODALS.EVENT_MODAL, eventId, EVENT_ACTION.EDIT_NOTES)
      ),
    setAppointmentStatus: eventId => status =>
      dispatch(setAppointmentStatus({ eventId: eventId, status: status }))
  };
};

const mergePropsToState = (stateProps, dispatchProps, ownProps) => {
  const { id, calendarUserId, hideAction, modal } = ownProps;
  const { users, events, viewerId } = stateProps;
  const event = events[id] || {};
  const {
    editNotes: editNotesDispatch,
    openCancelModal: openCancelModalDispatch,
    setAppointmentStatus: setAppointmentStatusDispatch,
    rescheduleEvent: rescheduleEventDispatch
  } = dispatchProps;
  const {
    data: {
      participantOne: participantOneId,
      participantTwo: participantTwoId
    } = {}
  } = event;
  const viewer = users[viewerId] || {};
  const participantOne = users[participantOneId] || {};
  const participantTwo = users[participantTwoId] || {};
  const calendarUser = users[calendarUserId] || {};
  const editNotes = editNotesDispatch(id);
  const openCancelModal = openCancelModalDispatch(id, calendarUserId);
  const setAppointmentStatus = setAppointmentStatusDispatch(id);
  const rescheduleEvent = rescheduleEventDispatch(id);

  return {
    viewer,
    participantOne,
    participantTwo,
    calendarUser,
    hideAction,
    modal,
    event,
    editNotes,
    openCancelModal,
    setAppointmentStatus,
    rescheduleEvent
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergePropsToState
)(AppointmentCard);
