import { connect } from "react-redux";
import HistoricalClinicalReading from "../../Components/modal/historicalClinicalReading";
import { close } from "../../modules/modals";

import { GLOBAL_MODALS } from "../../constant";

const mapStateToProps = state => {
  const { modal } = state;
  return {
    show:
      modal.show &&
      modal.modalType === GLOBAL_MODALS.HISTORICAL_CLINICAL_READING,
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
)(HistoricalClinicalReading);
