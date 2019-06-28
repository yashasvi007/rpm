import { connect } from "react-redux";
import { fetchEventsData } from "../../../modules/events";
import DashboardReminder from "../../Components/DashBoard/common/DashboardReminder";

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
      dispatch(fetchEventsData(userId, startDate, endDate))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardReminder);
