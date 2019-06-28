import { connect } from "react-redux";
import ArticleShareWith from "../../Components/Modal/articleShareWith";
import { GLOBAL_MODALS } from "../../../constant";
import { close } from "../../../modules/modals";
import { fetchProgramsData } from "../../../modules/program";
import { fetchArticleParticipants } from "../../../modules/articles";
import { makeGetArticleById } from "../../../modules/articles/selector";
import { makeGetUserById } from "../../../modules/user/selector";

const mapStateToProps = state => {
  const {
    modal: { show, modalType, entityId },
    articles,
    programs,
    users,
    hospitals,
    auth
  } = state;
  const getArticle = makeGetArticleById();
  const getUser = makeGetUserById();
  return {
    show: show && modalType === GLOBAL_MODALS.ARTICLE_SHARE_WITH,
    article: getArticle(articles, entityId),
    programs,
    currentUser: getUser(users, auth.authenticated_user),
    users,
    hospitals,
    articleId: entityId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    fetchProgramsData: () => dispatch(fetchProgramsData()),
    fetchData: articleId => dispatch(fetchArticleParticipants(articleId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleShareWith);
