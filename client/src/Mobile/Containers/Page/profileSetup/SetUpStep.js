import SetupStep from "../../../Components/ProfileSetup/SetUpStep";
import { connect } from "react-redux";

const mapStateToProps = state => {
  const {
    page: { profileSetUp }
  } = state;
  return {
    current: profileSetUp.current
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetupStep);
