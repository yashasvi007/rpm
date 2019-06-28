import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchUser } from "../../../../modules/page/EditProfile";
import {
  makeGetUserById,
  makeGetCareCoaches,
  makeGetCaseDoctors
} from "../../../../modules/user/selector";
import MyProfile from "../../../Components/page/MyProfile";
import {
  makeCitySelector,
  makeCountrySelector
} from "../../../../modules/countryCity/selector";
import { makeGetMedicalDataOfUser } from "../../../../modules/medical/selector";

import { open } from "../../../../modules/modals";

import { GLOBAL_MODALS } from "../../../../constant";

const mapStateToProps = state => {
  const {
    users,
    auth,
    countryCities,
    page: { editProfile },
    medicals,
    insuranceProviders,
    hospital,
    programs,
    clinicalTestTemplates
  } = state;
  const getUser = makeGetUserById();
  const getCountry = makeCountrySelector();
  const getCity = makeCitySelector();
  const getMedicalData = makeGetMedicalDataOfUser();
  const getDoctors = makeGetCaseDoctors();
  const getCareCoaches = makeGetCareCoaches();
  return {
    user_data: getUser(users, auth.authenticated_user),
    insurance_provider_data: insuranceProviders,
    hospital_data: hospital,
    medicals_data: getMedicalData(medicals, auth.authenticated_user),
    case_doctors: getDoctors(users, auth.authenticated_user),
    care_coaches: getCareCoaches(users, auth.authenticated_user),
    countrySelector: id => getCountry(countryCities, id),
    citySelector: (countryId, cityId) =>
      getCity(countryCities, countryId, cityId),
    isLoading: editProfile.isLoading,
    programs,
    clinicalTestTemplates_data: clinicalTestTemplates
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getData: () => dispatch(fetchUser()),
    openChangePassword: id => dispatch(open(GLOBAL_MODALS.CHANGE_PASSWORD, id)),
    openDocumentsVerification: (id, purpose) =>
      dispatch(open(GLOBAL_MODALS.DOCUMENTS_MODAL, id, purpose))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyProfile)
);
