import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import ArticleDetails from "../../../Components/page/article/details";
import {
  fetchArticlesById,
  makeFavouriteUnfavourite
} from "../../../../modules/articles";
import { makeGetArticleById } from "../../../../modules/articles/selector";
import { makeGetUserById } from "../../../../modules/user/selector";

import { open } from "../../../../modules/modals";
import { GLOBAL_MODALS } from "../../../../constant";

const mapStateToProps = state => {
  const { articles, users, auth } = state;
  return {
    articles,
    users,
    auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: articleId => () => dispatch(fetchArticlesById(articleId)),
    shareArticle: articleId => () =>
      dispatch(
        open(GLOBAL_MODALS.ARTICLE_SHARE_TO_PATIENTS, articleId, null, {})
      ),
    shareWith: articleId => () =>
      dispatch(open(GLOBAL_MODALS.ARTICLE_SHARE_WITH, articleId, null, {})),

    makeFavouriteUnfavourite: data => () =>
      dispatch(makeFavouriteUnfavourite(data))
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { articleId } = ownProps;
  const { articles, users, auth } = stateProps;
  const { authenticated_user } = auth;
  const {
    fetchData,
    shareArticle,
    shareWith,
    makeFavouriteUnfavourite: makeFavouriteUnfavouriteDispatch
  } = dispatchProps;
  const getArticle = makeGetArticleById();
  const getUser = makeGetUserById();

  const article = getArticle(articles, articleId);
  const { isFavourite } = article;

  const makeFavouriteUnfavourite = makeFavouriteUnfavouriteDispatch({
    articleId,
    isFavourite: !isFavourite
  });

  return {
    article,
    fetchData: fetchData(articleId),
    shareArticle: shareArticle(articleId),
    shareWith: shareWith(articleId),
    users,
    currentUser: getUser(users, authenticated_user),
    makeFavouriteUnfavourite,
    ...ownProps
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ArticleDetails)
);
