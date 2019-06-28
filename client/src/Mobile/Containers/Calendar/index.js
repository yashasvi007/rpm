import Calendar from "../../Components/Calendar";
import { connect } from "react-redux";
import { fetchEventsData, pollEventsData } from "../../../modules/events";

const mapStateToProps = state => {
  const { events, users, auth: { authenticated_user } = {} } = state;
  return {
    events: events,
    users: users,
    viewerId: authenticated_user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchEventsData: userId => (startDate, endDate) =>
      dispatch(fetchEventsData(userId, startDate, endDate)),
    pollEventsData: () => dispatch(pollEventsData())
  };
};

const mergePropsToState = (stateProps, dispatchProps, ownProps) => {
  const { calendarUserId, match } = ownProps;
  const { users, events, viewerId } = stateProps;
  const {
    fetchEventsData: fetchEventsDataDispatch,
    pollEventsData
  } = dispatchProps;
  const viewer = users[viewerId] || {};
  const fetchEventsData = fetchEventsDataDispatch(calendarUserId);
  const show = match.params ? match.params.show : "all";

  return {
    calendarUserId,
    viewer,
    events,
    fetchEventsData,
    pollEventsData,
    show,
    match
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergePropsToState
)(Calendar);
