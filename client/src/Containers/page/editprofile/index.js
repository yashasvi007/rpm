import EditProfile from "../../../Components/page/EditProfile";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { changeProfilePic } from "../../../modules/page/changeProfilePic";

import {
  openOtpModal,
  openProfilePicModal,
  closeOtpModal,
  closeProfilePicModal,
  saveUserData,
  clearMsg,
  fetchUser
} from "../../../modules/page/EditProfile";

import { open } from "../../../modules/modals";

import { GLOBAL_MODALS } from "../../../constant";

import {
  makeGetUserById,
  makeGetCareCoaches,
  makeGetCaseDoctors
} from "../../../modules/user/selector";
import { makeGetMedicalDataOfUser } from "../../../modules/medical/selector";

import { sendOtp, verifyOtp, reset } from "../../../modules/phone";
import { fetchInsuranceData } from "../../../modules/insuarnceProvider";
import { fetchHospitals } from "../../../modules/hospital";

const mapStateToProps = state => {
  const {
    users,
    auth: { authenticated_user: loggedInUser },
    page: { editProfile },
    medicals,
    insuranceProviders,
    hospitals,
    clinicalTestTemplates
  } = state;
  const getUser = makeGetUserById();
  const getMedicalData = makeGetMedicalDataOfUser();
  const getDoctors = makeGetCaseDoctors();
  const getCareCoaches = makeGetCareCoaches();
  return {
    user_data: getUser(users, editProfile.current_user_id),
    insurance_provider_data: insuranceProviders,
    hospitals_data: hospitals,
    medicals_data: getMedicalData(medicals, editProfile.current_user_id),
    show_otp_modal: editProfile.show_otp_modal,
    case_doctors: getDoctors(users, editProfile.current_user_id),
    care_coaches: getCareCoaches(users, editProfile.current_user_id),
    show_profile_pic_modal: editProfile.show_profile_pic_modal,
    is_profile_error: editProfile.is_profile_error,
    is_profile_saved: editProfile.is_profile_saved,
    profile_error: editProfile.profile_error,
    success_msg: editProfile.success_msg,
    isLoading: editProfile.isLoading,
    clinical_test_templates: clinicalTestTemplates,
    showPassword: editProfile.current_user_id === loggedInUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearMsg: () => dispatch(clearMsg()),
    openOtpModal: () => dispatch(openOtpModal()),
    openProfilePicModal: () => dispatch(openProfilePicModal()),
    closeOtpModal: () => dispatch(closeOtpModal()),
    closeProfilePicModal: () => dispatch(closeProfilePicModal()),
    changeProfilePic: (data, id) => dispatch(changeProfilePic(data, id)),
    getData: id => dispatch(fetchUser(id)),
    updateUser: data => dispatch(saveUserData(data)),
    sendOtp: (data, id) => dispatch(sendOtp(data, id)),
    verifyOtp: (data, id) => dispatch(verifyOtp(data, id)),
    getInsuranceProvider: () => dispatch(fetchInsuranceData()),
    getHospital: (countryId, cityId) =>
      dispatch(fetchHospitals(countryId, cityId)),
    cleanOtpState: data => dispatch(reset()),
    openChangePassword: id => dispatch(open(GLOBAL_MODALS.CHANGE_PASSWORD, id)),
    openDocumentsVerification: (id, purpose) =>
      dispatch(open(GLOBAL_MODALS.DOCUMENTS_MODAL, id, purpose))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditProfile)
);
