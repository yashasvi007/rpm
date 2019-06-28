import { connect } from "react-redux";
import ClinicalReadingModal from "../../Components/modal/clinicalReading";
import { close } from "../../modules/modals";

import { UpdateClinicalReadingData } from "../../modules/medical";
import { makeGetMedicalDataOfUser } from "../../modules/medical/selector";

import { makeGetUserById } from "../../modules/user/selector";

import { GLOBAL_MODALS } from "../../constant";

const mapStateToProps = state => {
  const { modal, medicals, clinicalTestTemplates, users } = state;
  const getMedicalData = makeGetMedicalDataOfUser();
  const getUser = makeGetUserById();
  const user_data = getUser(users, modal.entityId);
  let programId = "";
  let testTemplates = [];
  if (user_data) {
    const { programIds } = user_data;
    if (programIds) {
      programId = programIds[0].id;
      testTemplates = clinicalTestTemplates[programId];
    }
  }

  return {
    show: modal.show && modal.modalType === GLOBAL_MODALS.CLINICALREADING,
    requesting: modal.requesting,
    patient_id: modal.entityId,
    purpose: modal.purpose,
    test_selected: modal.data,
    clinicalTestTemplates_data: testTemplates,
    medicals_data: getMedicalData(medicals, modal.entityId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    UpdateClinicalReadingData: (medicalConditionId, data, userId) =>
      dispatch(UpdateClinicalReadingData(medicalConditionId, data, userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClinicalReadingModal);
