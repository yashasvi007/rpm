import { connect } from "react-redux";
import TwilioChat from "../../Components/TwilioChat";

import { fetchChatAccessToken } from "../../modules/twilio";
import { fetchEventUsers } from "../../modules/events";

const mapStateToPros = state => {
  const { twilio, users } = state;
  return { twilio, users };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchChatAccessToken: userId => dispatch(fetchChatAccessToken(userId)),
    fetchEventUsers: eventId => dispatch(fetchEventUsers(eventId))
  };
};

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(TwilioChat);
