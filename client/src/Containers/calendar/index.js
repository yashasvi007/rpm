import Calendar from "../../Components/Calendar";
import { connect } from "react-redux";
import { fetchEventsData, pollEventsData } from "../../modules/events";

const mapStateToProps = state => {
  const { events, users, auth } = state;
  return {
    events: events,
    users: users,
    auth: auth.authenticated_user
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
)(Calendar);
