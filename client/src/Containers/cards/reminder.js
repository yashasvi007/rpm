import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReminderCard from "../../Components/Cards/reminder";
import { open } from "../../modules/modals";
import { GLOBAL_MODALS, EVENT_ACTION, USER_STATUS } from "../../constant";

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
  const { id, calendarUserId, hideAction = false, modal } = ownProps;
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
  const { status } = calendarUser;
  let actionable = hideAction || status === USER_STATUS.DISCHARGED;

  return {
    viewer,
    participantOne,
    participantTwo,
    calendarUser,
    hideAction: actionable,
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
