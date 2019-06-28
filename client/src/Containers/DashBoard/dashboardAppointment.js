import { connect } from "react-redux";
import { fetchEventsData, pollEventsData } from "../../modules/events";
import DashboardAppointment from "../../Components/DashBoard/common/DashboardAppointment";

const mapStateToProps = state => {
  const { events, users, auth } = state;
  return {
    events: events,
    users: users,
    auth: auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchEventsData: (userId, startDate, endDate) =>
      dispatch(fetchEventsData(userId, startDate, endDate)),
    pollEventsData: () => dispatch(pollEventsData())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardAppointment);
