import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ArticleCard from "../../Components/Cards/articleCard";
import { makeFavouriteUnfavourite } from "../../modules/articles";

const mapStateToProps = state => {
  const { articles } = state;
  return {
    articles
  };
};

const mapDispatchToProps = dispatch => {
  return {
    makeFavouriteUnfavourite: data => () =>
      dispatch(makeFavouriteUnfavourite(data))
  };
};

const mergePropsToState = (stateProps, dispatchProps, ownProps) => {
  const { id } = ownProps;
  const { articles } = stateProps;
  const articleData = articles[id];
  const toggledFavourite = !articles[id].isFavourite;
  const {
    makeFavouriteUnfavourite: makeFavouriteUnfavouriteDispatch
  } = dispatchProps;

  const makeFavouriteUnfavourite = makeFavouriteUnfavouriteDispatch({
    articleId: id,
    isFavourite: toggledFavourite
  });
  return {
    articleData,
    makeFavouriteUnfavourite
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergePropsToState
  )(ArticleCard)
);
