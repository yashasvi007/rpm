import { connect } from "react-redux";
import EventModal from "../../Components/modal/event/modal";
import {
  open,
  close,
  addAppointment, //it should be goes into eventModules which is not build yet.
  addReminder,
  clearMsg
} from "../../modules/modals";

import {
  reschedule,
  editNotes,
  editReminder,
  editNotesReminder
} from "../../modules/events";
import { makeGetUserById } from "../../modules/user/selector";

import { GLOBAL_MODALS, EVENT_ACTION } from "../../constant";

const mapStateToProps = state => {
  const {
    modal: {
      show,
      modalType,
      requesting,
      purpose,
      entityId,
      data: { userId, series = false } = {},
      error
    },
    events: { events = {} },
    users,
    auth
  } = state;
  const getUserById = makeGetUserById();
  return {
    show: show && modalType === GLOBAL_MODALS.EVENT_MODAL,
    requesting,
    purpose,
    event: events[entityId],
    userId: userId,
    currentUser: getUserById(users, auth.authenticated_user),
    users: users,
    showRepeating: purpose ? series : true,
    series,
    disabledDateAndTime: purpose === EVENT_ACTION.EDIT_NOTES,
    disabledStartDate:
      (purpose === EVENT_ACTION.RESCHEDULE ||
        purpose === EVENT_ACTION.EDIT_REMINDER) &&
      series,
    error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    open: data => dispatch(open(data)),
    close: () => dispatch(close()),
    addAppointment: data => dispatch(addAppointment(data)),
    addReminder: data => dispatch(addReminder(data)),
    reschedule: data => dispatch(reschedule(data)),
    editNotes: data => dispatch(editNotes(data)),
    editReminder: data => dispatch(editReminder(data)),
    editNotesReminder: data => dispatch(editNotesReminder(data)),
    clearMsg: () => dispatch(clearMsg())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventModal);
