import { connect } from "react-redux";
import DischargePatientModal from "../../Components/Modal/dischargePatient";
import { close } from "../../../modules/modals";

import { GLOBAL_MODALS } from "../../../constant";
import { discharge } from "../../../modules/user";

const mapStateToProps = state => {
  const { modal } = state;
  return {
    show: modal.show && modal.modalType === GLOBAL_MODALS.DISCHARGE_PATIENT,
    requesting: modal.requesting,
    patientId: modal.entityId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    dischargePatient: id => dispatch(discharge(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DischargePatientModal);
