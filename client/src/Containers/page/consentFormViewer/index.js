import ConsentFormViewer from "../../../Components/page/consentDocument";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { reUploadConsentDocs } from "../../../modules/user";

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
    reUploadConsentDocs: (id, fileList) =>
      dispatch(reUploadConsentDocs(id, fileList))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConsentFormViewer)
);
