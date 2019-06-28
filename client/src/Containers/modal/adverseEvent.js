import { connect } from "react-redux";
import AdverseEvent from "../../Components/modal/adverseEvent";
import { GLOBAL_MODALS } from "../../constant";
import { reportAdverseEvent } from "../../modules/modals";
import { close } from "../../modules/modals";
import { fetchAdverseEvent } from "../../modules/events";
import { getRecentMedication } from "../../modules/medication";
import { makeGetUserById } from "../../modules/user/selector";

const mapStateToProps = state => {
  const {
    modal: { show, modalType, data: userId, requesting },
    medications = {},
    products = {},
    auth = {},
    users
  } = state;
  const getUser = makeGetUserById();
  return {
    show: show && modalType === GLOBAL_MODALS.ADVERSE_EVENTS,
    userId: userId,
    requesting: requesting,
    medications,
    products,
    authUser: getUser(users, auth.authenticated_user)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    report: data => dispatch(reportAdverseEvent(data)),
    reFetchAdverseEvent: userId => dispatch(fetchAdverseEvent(userId)),
    close: () => dispatch(close()),
    fetchUserRecentMedication: userId => dispatch(getRecentMedication(userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdverseEvent);
