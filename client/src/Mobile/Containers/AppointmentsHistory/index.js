import AppointmentsHistory from "../../Components/AppointmentsHistory";
import { connect } from "react-redux";

import { fetchAppointmentsHistory } from "../../../modules/events";

const mapStateToProps = state => {
  const { events, users } = state;
  return {
    events,
    users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAppointmentsHistory: userId => startDate =>
      dispatch(fetchAppointmentsHistory(userId, startDate))
  };
};

const mergePropsToState = (stateProps, dispatchProps, ownProps) => {
  const { userId } = ownProps;
  const { users, events } = stateProps;
  const {
    fetchAppointmentsHistory: fetchAppointmentsHistoryDispatch
  } = dispatchProps;
  const fetchAppointmentsHistory = fetchAppointmentsHistoryDispatch(userId);

  return {
    fetchAppointmentsHistory,
    events,
    users,
    userId
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergePropsToState
)(AppointmentsHistory);
