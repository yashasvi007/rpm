import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Articles from "../../../Components/page/article/list";
import { fetchArticles } from "../../../modules/articles";

const mapStateToProps = state => {
  const { articles } = state;
  return {
    articles
  };
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
