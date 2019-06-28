import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PatientProfile from "../../../Components/Detail/patient";
import { fetchPatient } from "../../../../modules/page/Patientprofile";
import { makeGetUserById } from "../../../../modules/user/selector";
import { makeGetMedicalDataOfUser } from "../../../../modules/medical/selector";
import {
  makeCitySelector,
  makeCountrySelector
} from "../../../../modules/countryCity/selector";
import { GLOBAL_MODALS, USER_CATEGORY } from "../../../../constant";
import { fetchDoctor } from "../../../../modules/page/doctorProfile";
import { open } from "../../../../modules/modals";

const mapStateToProps = state => {
  const {
    users,
    medicals,
    countryCities,
    auth,
    page: { patientProfile = {} } = {}
  } = state;
  const getUser = makeGetUserById();
  const getMedicalData = makeGetMedicalDataOfUser();
  const getCity = makeCitySelector();
  const getCountry = makeCountrySelector();

  return {
    userData: getUser(users, patientProfile.id),
    medicalsData: getMedicalData(medicals, patientProfile.id),
    countrySelector: id => getCountry(countryCities, id),
    citySelector: (countryId, cityId) =>
      getCity(countryCities, countryId, cityId),
    is_loading: patientProfile.is_loading,
    is_data_loaded: patientProfile.is_data_loaded,
    country_city: countryCities,
    auth,
    users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: userId => dispatch(fetchPatient(userId)),
    fetchDoctor: userId => dispatch(fetchDoctor(userId)),
    addEditAppointmentReminder: (eventId, userId, purpose) =>
      dispatch(open(GLOBAL_MODALS.EVENT_MODAL, eventId, purpose, { userId })),
    openDocumentsVerification: id =>
      dispatch(open(GLOBAL_MODALS.DOCUMENTS_MODAL, id))
  };
};

const mergePropsToState = (stateProps, dispatchProps, ownProps) => {
  const { id: userId, history, match } = ownProps;
  const {
    users,
    auth: { authenticated_user: viewerId },
    citySelector,
    countrySelector
  } = stateProps;
  const viewer = users[viewerId];
  const userData = users[userId];
  const {
    basicInfo: { category: viewerCategory }
  } = viewer;
  const showCalendar = viewerCategory === USER_CATEGORY.CARE_COACH;

  return {
    userId,
    viewer,
    history,
    match,
    users,
    userData,
    citySelector,
    countrySelector,
    showCalendar,
    ...dispatchProps
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergePropsToState
  )(PatientProfile)
);
