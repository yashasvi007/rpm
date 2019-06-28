import AppHeader from "../../Components/Header/index";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { open } from "../../../modules/modals";
import { signOut } from "../../../modules/auth";

import { GLOBAL_MODALS, USER_CATEGORY, USER_STATUS } from "../../../constant";

import { makeGetUserById } from "../../../modules/user/selector";
const mapStateToProps = state => {
  const { users, auth, programs } = state;
  const getUser = makeGetUserById();
  return {
    user_data: getUser(users, auth.authenticated_user),
    program_data: programs,
    authenticated: auth.authenticated,
    unauthorizedError: auth.unauthorizedError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openModal: data => dispatch(open(data)),
    reportAdverseEvent: userId =>
      dispatch(open(GLOBAL_MODALS.ADVERSE_EVENTS, null, null, userId)),
    signOut: () => dispatch(signOut())
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    user_data = {},
    program_data,
    authenticated,
    unauthorizedError
  } = stateProps;
  const { basicInfo: { category } = {}, status } = user_data;
  return {
    showSearch:
      category === USER_CATEGORY.CARE_COACH ||
      category === USER_CATEGORY.DOCTOR,
    showAddButton:
      category === USER_CATEGORY.CARE_COACH ||
      (category === USER_CATEGORY.PATIENT && status === USER_STATUS.ENROLLED),
    user_data,
    program_data,
    authenticated,
    unauthorizedError,
    ...dispatchProps,
    ...ownProps
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(AppHeader)
);
