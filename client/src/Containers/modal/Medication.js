import { connect } from "react-redux";
import AddMedicationModal from "../../Components/modal/Medication";
import { close } from "../../modules/modals";

import { addMedication, removeMedication } from "../../modules/medication";
import { makeGetPatientProgramProduct } from "../../modules/program/selector";

import { GLOBAL_MODALS } from "../../constant";

const mapStateToProps = state => {
  const { modal, products, medications, users, programs } = state;
  const getPatientProgramProducts = makeGetPatientProgramProduct();
  return {
    show: modal.show && modal.modalType === GLOBAL_MODALS.MEDICATION,
    requesting: modal.requesting,
    patientId: modal.entityId,
    purpose: modal.purpose,
    productId: modal.data,
    productIds: getPatientProgramProducts(users, modal.entityId, programs),
    products_data: products,
    medications_data: medications
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    addMedication: (data, userId) => dispatch(addMedication(data, userId)),
    removeMedication: (productID, userId) =>
      dispatch(removeMedication(productID, userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMedicationModal);
