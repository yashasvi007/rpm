import IdProofViewer from "../../../Components/page/idProof";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { reUploadIdProofs } from "../../../modules/user";

import { makeGetUserById } from "../../../modules/user/selector";

const mapStateToProps = state => {
  const { users, auth } = state;
  const getUser = makeGetUserById();
  return {
    user_data: getUser(users, auth.authenticated_user)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    reUploadIdProofs: (id, fileList) => dispatch(reUploadIdProofs(id, fileList))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(IdProofViewer)
);
