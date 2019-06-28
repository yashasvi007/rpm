import { connect } from "react-redux";
import AdverseEvent from "../../Components/Detail/patient/medicalDetails/adverseEvent/index";
import { withRouter } from "react-router-dom";

import { open } from "../../modules/modals";
import { GLOBAL_MODALS } from "../../constant";

const mapStateToProps = state => {
  const { auth, events, users } = state;
  return { auth: auth, events: events, users: users };
};

const mapDispatchToProps = dispatch => {
  return {
    openAdverseEventImageModal: (userId, adverseEventId) =>
      dispatch(
        open(
          GLOBAL_MODALS.ADVERSE_EVENT_IMAGE_MODAL,
          userId,
          null,
          adverseEventId
        )
      )
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AdverseEvent)
);
