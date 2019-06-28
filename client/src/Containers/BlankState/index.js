import BlankState from "../../Components/BlankState";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { resetUnauthorizedError } from "../../modules/auth";

const mapStateToProps = state => {
  const { users, auth } = state;
  return {
    users: users,
    auth: auth,
    unauthorizedError: auth.unauthorizedError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetUnauthorizedError: () => {
      dispatch(resetUnauthorizedError());
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BlankState)
);
