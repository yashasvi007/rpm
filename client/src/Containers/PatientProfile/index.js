import PatientProfile from "../../Components/Detail/patient";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { fetchPatient } from "../../modules/page/Patientprofile";

import { addMedication } from "../../modules/medication";

import {
  fetchAdverseEvent,
  fetchAppointmentsHistory
} from "../../modules/events";

import {
  makeGetUserById,
  makeGetCareCoaches,
  makeGetCaseDoctors
} from "../../modules/user/selector";

import { makeAdverseEventSelector } from "../../modules/events/selector";

import {
  saveBasicConditionData,
  addVitalData,
  UpdateClinicalReadingData
} from "../../modules/medical";
import { makeGetMedicalDataOfUser } from "../../modules/medical/selector";
import {
  makeCitySelector,
  makeCountrySelector
} from "../../modules/countryCity/selector";

import { open } from "../../modules/modals";
import { GLOBAL_MODALS } from "../../constant";
const mapStateToProps = state => {
  const {
    users,
    events,
    medicals,
    insuranceProviders,
    hospitals,
    countryCities,
    products,
    medications,
    clinicalTestTemplates,
    auth,
    page: { patientProfile = {} } = {}
  } = state;
  const getUser = makeGetUserById();
  const getMedicalData = makeGetMedicalDataOfUser();
  const getDoctors = makeGetCaseDoctors();
  const getCareCoaches = makeGetCareCoaches();
  const getCity = makeCitySelector();
  const getCountry = makeCountrySelector();
  const getAdverseEvents = makeAdverseEventSelector();

  return {
    user_data: getUser(users, patientProfile.id),
    currentUser: getUser(users, auth.authenticated_user),
    insurance_provider_data: insuranceProviders,
    hospitals_data: hospitals,
    products_data: products,
    medications_data: medications,
    medicals_data: getMedicalData(medicals, patientProfile.id),
    case_doctors: getDoctors(users, patientProfile.id),
    care_coaches: getCareCoaches(users, patientProfile.id),
    countrySelector: id => getCountry(countryCities, id),
    citySelector: (countryId, cityId) =>
      getCity(countryCities, countryId, cityId),
    is_loading: patientProfile.is_loading,
    is_data_loaded: patientProfile.is_data_loaded,
    country_city: countryCities,
    clinicalTestTemplates_data: clinicalTestTemplates,
    adverseEvent: getAdverseEvents(events, patientProfile.id)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPatient: userId => dispatch(fetchPatient(userId)),
    saveBasicConditionData: (medicalConditionId, data, userId) =>
      dispatch(saveBasicConditionData(medicalConditionId, data, userId)),
    addVitalData: (medicalConditionId, data, userId) =>
      dispatch(addVitalData(medicalConditionId, data, userId)),
    addMedication: (data, userId) => dispatch(addMedication(data, userId)),
    UpdateClinicalReadingData: (medicalConditionId, data, userId) =>
      dispatch(UpdateClinicalReadingData(medicalConditionId, data, userId)),
    openDischargePatient: id =>
      dispatch(open(GLOBAL_MODALS.DISCHARGE_PATIENT, id)),
    openMedication: (id, purpose, product_Id) =>
      dispatch(open(GLOBAL_MODALS.MEDICATION, id, purpose, product_Id)),
    openClinicalReading: (id, purpose, testSelected) =>
      dispatch(open(GLOBAL_MODALS.CLINICALREADING, id, purpose, testSelected)),
    openDocumentsVerification: id =>
      dispatch(open(GLOBAL_MODALS.DOCUMENTS_MODAL, id)),
    openHistoricalClinicalData: id =>
      dispatch(open(GLOBAL_MODALS.HISTORICAL_CLINICAL_READING, id)),
    openVitalsData: id =>
      dispatch(open(GLOBAL_MODALS.HISTORICAL_VITALS_READING, id)),
    openMedicationData: id =>
      dispatch(open(GLOBAL_MODALS.HISTORICAL_MEDICATION_DATA, id)),
    addEditAppointmentReminder: (eventId, userId, purpose) =>
      dispatch(open(GLOBAL_MODALS.EVENT_MODAL, eventId, purpose, { userId })),
    reportAdverseEvent: userId =>
      dispatch(open(GLOBAL_MODALS.ADVERSE_EVENTS, null, null, userId)),
    fetchAdverseEvent: userId => {
      dispatch(fetchAdverseEvent(userId));
    },
    fetchAppointmentsHistory: userId =>
      dispatch(fetchAppointmentsHistory(userId))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientProfile)
);
