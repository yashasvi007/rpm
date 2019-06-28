import { connect } from "react-redux";
import EndSurveyModal from "../../Components/modal/endSurvey";
import { close } from "../../modules/modals";

import { GLOBAL_MODALS } from "../../constant";
import { endSurveys } from "../../modules/survey";

const mapStateToProps = state => {
  const { modal, programs } = state;
  return {
    show: modal.show && modal.modalType === GLOBAL_MODALS.END_SURVEY,
    requesting: modal.requesting,
    surveyId: modal.entityId,
    programId: modal.data,
    programs_data: programs
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    endSurveys: surveyId => dispatch(endSurveys(surveyId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EndSurveyModal);
