import { createSelector } from "reselect";

const getArticle = (articles = {}, id) => {
  if (!id) {
    return {};
  }
  return articles[id] || {};
};

export const makeGetArticleById = () =>
  createSelector(
    [getArticle],
    article => {
      return article;
    }
  );
