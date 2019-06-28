import { connect } from "react-redux";
import HistoricalMedicationData from "../../Components/modal/historicalMedicationData";
import { close } from "../../modules/modals";

import { GLOBAL_MODALS } from "../../constant";

const mapStateToProps = state => {
  const { modal } = state;
  // ("in medication cont", modal)
  return {
    show:
      modal.show &&
      modal.modalType === GLOBAL_MODALS.HISTORICAL_MEDICATION_DATA,
    requesting: modal.requesting,
    patientId: modal.entityId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoricalMedicationData);
