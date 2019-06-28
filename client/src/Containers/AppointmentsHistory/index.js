import AppointmentsHistory from "../../Components/AppointmentsHistory";
import { connect } from "react-redux";

import { fetchAppointmentsHistory } from "../../modules/events";

const mapStateToProps = state => {
  const { events, users } = state;
  return {
    events: events,
    users: users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAppointmentsHistory: (userId, startDate) =>
      dispatch(fetchAppointmentsHistory(userId, startDate))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentsHistory);
