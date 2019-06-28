import { connect } from "react-redux";
import DocumentVerificationModal from "../../Components/modal/documentVerification";
import { close } from "../../modules/modals";
import { GLOBAL_MODALS } from "../../constant";
import {
  verify,
  reUploadIdProofs,
  reUploadConsentDocs
} from "../../modules/user";
import { makeGetUserById } from "../../modules/user/selector";

const mapStateToProps = state => {
  const { modal, users, auth } = state;
  const getUserById = makeGetUserById();
  return {
    show: modal.show && modal.modalType === GLOBAL_MODALS.DOCUMENTS_MODAL,
    requesting: modal.requesting,
    purpose: modal.purpose,
    patientId: modal.entityId,
    users: users,
    currentUser: getUserById(users, auth.authenticated_user)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    verifyDocuments: (id, proofs) => dispatch(verify(id, proofs)),
    reUploadIdProofs: (id, fileList) =>
      dispatch(reUploadIdProofs(id, fileList)),
    reUploadConsentDocs: (id, fileList) =>
      dispatch(reUploadConsentDocs(id, fileList))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentVerificationModal);
