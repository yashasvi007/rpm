import { connect } from "react-redux";
import TwilioVideo from "../../Components/TwilioVideo";

import { fetchVideoAccessToken } from "../../modules/twilio";
import {
  fetchEventUsers,
  addVideoRoomParticipantsInEvent
} from "../../modules/events";

const mapStateToPros = state => {
  const { twilio, users, events } = state;
  return { twilio, users, events };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchVideoAccessToken: userId => dispatch(fetchVideoAccessToken(userId)),
    fetchEventUsers: eventId => dispatch(fetchEventUsers(eventId)),
    addVideoRoomParticipantsInEvent: (eventId, userOne, userTwo) =>
      dispatch(addVideoRoomParticipantsInEvent(eventId, userOne, userTwo))
  };
};

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(TwilioVideo);
