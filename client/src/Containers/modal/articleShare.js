import { connect } from "react-redux";
import ArticleShare from "../../Components/modal/articleShare";
import { GLOBAL_MODALS } from "../../constant";
import { close } from "../../modules/modals";
import { fetchProgramsData, fetchProgramPatient } from "../../modules/program";
import { makeGetUserById } from "../../modules/user/selector";
import { makeGetArticleById } from "../../modules/articles/selector";
import { shareArticle, fetchArticlesById } from "../../modules/articles";

const mapStateToProps = state => {
  const {
    modal: { show, modalType, entityId },
    auth,
    programs,
    users,
    hospitals,
    articles
  } = state;

  const getUser = makeGetUserById();
  const getArticle = makeGetArticleById();
  return {
    show: show && modalType === GLOBAL_MODALS.ARTICLE_SHARE_TO_PATIENTS,
    programs,
    currentUser: getUser(users, auth.authenticated_user),
    users,
    hospitals,
    articleId: entityId,
    article: getArticle(articles, entityId)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch(close()),
    share: data => dispatch(shareArticle(data)),
    fetchProgramsData: () => dispatch(fetchProgramsData()),
    fetchPatient: (programId, query) =>
      dispatch(fetchProgramPatient(programId, null, null, { q: query })),
    fetchArticle: articleId => dispatch(fetchArticlesById(articleId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleShare);
