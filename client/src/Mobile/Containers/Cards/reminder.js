import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReminderCard from "../../Components/Cards/reminder";
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
    viewer_id: authenticated_user
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
      )
  };
};

const mergePropsToState = (stateProps, dispatchProps, ownProps) => {
  const { id, calendarUserId, hideAction, modal } = ownProps;
  const { users, events, viewer_id } = stateProps;
  const event = events[id] || {};
  const {
    data: {
      participantOne: participantOneId,
      participantTwo: participantTwoId
    } = {}
  } = event;
  const viewer = users[viewer_id] || {};
  const participantOne = users[participantOneId] || {};
  const participantTwo = users[participantTwoId] || {};
  const calendarUser = users[calendarUserId] || {};

  const {
    editNotes: editNotesDispatch,
    openCancelModal: openCancelModalDispatch,
    rescheduleEvent: rescheduleEventDispatch
  } = dispatchProps;

  const editNotes = editNotesDispatch(id);
  const openCancelModal = openCancelModalDispatch(id, calendarUserId);
  const rescheduleEvent = rescheduleEventDispatch(id);

  return {
    viewer,
    participantOne,
    participantTwo,
    calendarUser,
    hideAction,
    modal,
    event,
    openCancelModal,
    rescheduleEvent,
    editNotes
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergePropsToState
  )(ReminderCard)
);
