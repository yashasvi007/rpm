import PatientMedicals from "../../Components/DashBoard/Patient/medicalDetails";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../modules/auth";
import { makeGetUserById } from "../../modules/user/selector";
import { fetchPatient } from "../../modules/page/Patientprofile";
import { fetchAdverseEvent } from "../../modules/events";
import { makeGetUserPrograms } from "../../modules/program/selector";
import { makeGetMedicalDataOfUser } from "../../modules/medical/selector";
import { makeAdverseEventSelector } from "../../modules/events/selector";

import {
  saveBasicConditionData,
  addVitalData,
  UpdateClinicalReadingData
} from "../../modules/medical";
import { open } from "../../modules/modals";
import { GLOBAL_MODALS } from "../../constant";

const mapStateToProps = state => {
  const {
    page: { profileSetUp, patientProfile = {} },
    users,
    auth,
    programs,
    medicals,
    medications,
    products,
    clinicalTestTemplates,
    events
  } = state;
  const getUser = makeGetUserById();
  const getUserPrograms = makeGetUserPrograms();
  const getMedicalData = makeGetMedicalDataOfUser();
  const getAdverseEvents = makeAdverseEventSelector();

  return {
    user_data: getUser(users, auth.authenticated_user),
    id: auth.authenticated_user,
    medications_data: medications,
    medicals_data: getMedicalData(medicals, auth.authenticated_user),
    profileSetupData: profileSetUp,
    auth_data: auth,
    authenticated: auth.authenticated,
    program_data: getUserPrograms(programs),
    clinicalTestTemplates_data: clinicalTestTemplates,
    is_loading: patientProfile.is_loading,
    adverseEvent: getAdverseEvents(events, auth.authenticated_user),
    products_data: products,
    events: events.events
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => {
      dispatch(signOut());
    },
    fetchPatient: userId => dispatch(fetchPatient(userId)),
    fetchAdverseEvent: userId => {
      dispatch(fetchAdverseEvent(userId));
    },
    openHistoricalClinicalData: id =>
      dispatch(open(GLOBAL_MODALS.HISTORICAL_CLINICAL_READING, id)),
    openVitalsData: id =>
      dispatch(open(GLOBAL_MODALS.HISTORICAL_VITALS_READING, id)),
    openMedicationData: id =>
      dispatch(open(GLOBAL_MODALS.HISTORICAL_MEDICATION_DATA, id)),
    openPrescription: (userId, medication_data) =>
      dispatch(open(GLOBAL_MODALS.PRESCRIPTION, userId, null, medication_data)),
    saveBasicConditionData: (medicalConditionId, data, userId) =>
      dispatch(saveBasicConditionData(medicalConditionId, data, userId)),
    addVitalData: (medicalConditionId, data, userId) =>
      dispatch(addVitalData(medicalConditionId, data, userId)),
    UpdateClinicalReadingData: (medicalConditionId, data, userId) =>
      dispatch(UpdateClinicalReadingData(medicalConditionId, data, userId)),
    openClinicalReading: (id, purpose, testSelected) =>
      dispatch(open(GLOBAL_MODALS.CLINICALREADING, id, purpose, testSelected)),
    reportAdverseEvent: userId =>
      dispatch(open(GLOBAL_MODALS.ADVERSE_EVENTS, null, null, userId))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientMedicals)
);
