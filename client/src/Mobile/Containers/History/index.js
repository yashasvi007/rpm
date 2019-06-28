import History from "../../Components/History";
import withRouter from "react-router-dom/es/withRouter";
import { connect } from "react-redux";

const mapStateToProps = state => {
  const { auth: { authenticated_user } = {} } = state;
  return {
    userId: authenticated_user
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(History)
);
