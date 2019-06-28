import Footer from "../../Components/Footer";
import { connect } from "react-redux";

const mapStateToProps = state => {
  const { auth } = state;
  return {
    unauthorizedError: auth.unauthorizedError
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
