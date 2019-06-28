import ProgramSummary from "../../Components/ProgramDetails/summary";
import { connect } from "react-redux";
import { fetchCurrentProgram } from "../../../modules/program";
import withRouter from "react-router/es/withRouter";

const mapStateToProps = state => {
  const { auth, programs, products } = state;
  return {
    auth,
    programs,
    products
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCurrentProgram: pid => () => dispatch(fetchCurrentProgram(pid))
  };
};

const mergePropsToState = (stateProps, dispatchProps, ownProps) => {
  const { match: { params: { id } = {} } = {} } = ownProps;
  const { auth, programs, products } = stateProps;
  const { getCurrentProgram: getCurrentProgramDispatch } = dispatchProps;
  const getCurrentProgram = getCurrentProgramDispatch(id);

  return {
    programId: id,
    ...ownProps,
    getCurrentProgram,
    auth,
    programs,
    products
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergePropsToState
  )(ProgramSummary)
);
