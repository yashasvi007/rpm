import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import RemoteConsulting from "../../Components/RemoteConsulting";

const mapStateToProps = state => {
  const { auth, users } = state;
  return {
    loggedInUser: auth.authenticated_user,
    users
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(RemoteConsulting)
);
