import SearchResult from "../../Components/SearchResult";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { makeGetUserById } from "../../modules/user/selector";
const mapStateToProps = state => {
  const { users, auth } = state;
  const getUser = makeGetUserById();
  return {
    user_data: getUser(users, auth.authenticated_user)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchResult)
);
