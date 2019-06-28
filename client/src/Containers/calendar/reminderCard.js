import { connect } from "react-redux";
import ReminderCard from "../../Components/Calendar/reminderCard";

import { open } from "../../modules/modals";
import { GLOBAL_MODALS, EVENT_ACTION } from "../../constant";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    addNotes: entityId =>
      dispatch(
        open(GLOBAL_MODALS.EVENT_MODAL, entityId, EVENT_ACTION.EDIT_NOTES)
      ),
    editReminder: (entityId, series) =>
      dispatch(
        open(GLOBAL_MODALS.EVENT_MODAL, entityId, EVENT_ACTION.EDIT_REMINDER, {
          series
        })
      ),
    deleteReminder: (entityId, subentity) =>
      dispatch(open(GLOBAL_MODALS.CANCEL_REMINDER, entityId, null, subentity))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReminderCard);
