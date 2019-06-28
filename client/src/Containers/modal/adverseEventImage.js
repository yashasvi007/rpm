import { connect } from "react-redux";
import AdverseEventsImageModal from "../../Components/modal/adverseEventImage";
import { close } from "../../modules/modals";
import { GLOBAL_MODALS } from "../../constant";

const mapStateToProps = state => {
  const { modal, users, events } = state;
  return {
    show:
      modal.show && modal.modalType === GLOBAL_MODALS.ADVERSE_EVENT_IMAGE_MODAL,
    requesting: modal.requesting,
    purpose: modal.purpose,
    patientId: modal.entityId,
    users: users,
    adverseEventId: modal.data,
    events: events
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
)(AdverseEventsImageModal);
