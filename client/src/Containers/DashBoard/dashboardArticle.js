import Articles from "../../Components/Article";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchArticles } from "../../modules/article";

const mapStateToProps = state => {
  const {} = state;

  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    fetchArticles: () => dispatch(fetchArticles())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Articles)
);
