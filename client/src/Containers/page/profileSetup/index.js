import ProfileSetup from "../../../Components/ProfileSetup";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import {
  saveUserConsentForm,
  saveUserIdProof
} from "../../../modules/page/profileSetup";

import { fetchUser } from "../../../modules/page/EditProfile";

import { makeGetUserById } from "../../../modules/user/selector";

const mapStateToProps = state => {
  const {
    page: { profileSetUp },
    users,
    auth
  } = state;

  const getUser = makeGetUserById();
  return {
    user_data: getUser(users, auth.authenticated_user),
    profileSetupData: profileSetUp
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uploadIdProof: data => {
      dispatch(saveUserIdProof(data));
    },
    uploadConsentForm: data => {
      dispatch(saveUserConsentForm(data));
    },
    fetchUser: () => dispatch(fetchUser)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProfileSetup)
);
