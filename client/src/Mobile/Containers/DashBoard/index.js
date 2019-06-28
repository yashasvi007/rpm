import Dashboard from "../../Components/DashBoard";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../../modules/auth";
import { makeGetUserById } from "../../../modules/user/selector";
import {
  fetchProgramsData,
  fetchProgramPatients
} from "../../../modules/program";
import { fetchAppointmentsHistory } from "../../../modules/events";
import { makeGetUserPrograms } from "../../../modules/program/selector";
import { fetchUser } from "../../../modules/page/EditProfile";
import { GLOBAL_MODALS, USER_CATEGORY, USER_STATUS } from "../../../constant";
import { open } from "../../../modules/modals";

const mapStateToProps = state => {
  const {
    page: { profileSetUp },
    users,
    auth,
    programs
  } = state;
  const getUser = makeGetUserById();
  const getUserPrograms = makeGetUserPrograms();
  return {
    user_data: getUser(users, auth.authenticated_user),
    profileSetupData: profileSetUp,
    auth_data: auth,
    authenticated: auth.authenticated,
    program_data: getUserPrograms(programs)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => {
      dispatch(signOut());
    },
    getMyPrograms: () => {
      dispatch(fetchProgramsData());
    },
    getProgramPatients: () => {
      dispatch(fetchProgramPatients());
    },
    openModal: data => dispatch(open(data)),
    fetchAppointmentsHistory: (userId, startDate) =>
      dispatch(fetchAppointmentsHistory(userId, startDate)),
    getDataOfCurrentUser: id => {
      dispatch(fetchUser(id));
    }
  };
};

const mergeProps = (propsFromState, propsFromDispatch, ownProps) => {
  const { auth_data: { authenticated_user } = {} } = propsFromState;
  const { getDataOfCurrentUser, ...rest } = propsFromDispatch;
  return {
    ...propsFromState,
    ...rest,
    getData: () => propsFromDispatch.getDataOfCurrentUser(authenticated_user),
    ...ownProps
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Dashboard)
);
