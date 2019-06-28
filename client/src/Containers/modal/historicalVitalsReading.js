import { connect } from "react-redux";
import HistoricalVitalsReading from "../../Components/modal/historicalVitalsReading";
import { close } from "../../modules/modals";

import { GLOBAL_MODALS } from "../../constant";

const mapStateToProps = state => {
  const { modal } = state;
  // ("in vitals cont", modal)
  return {
    show:
      modal.show && modal.modalType === GLOBAL_MODALS.HISTORICAL_VITALS_READING,
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
)(HistoricalVitalsReading);
