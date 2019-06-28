export const getArticleByIdURL = articleId => {
  return `/articles/${articleId}`;
};

export const getShareArticleURL = articleId => {
  return `/articles/${articleId}/share`;
};

export const getArticleParticipantsURL = articleId => {
  return `/articles/${articleId}/participants`;
};
export const getArticlesURL = () => {
  return "/articles";
};

export const makeFavouriteUnfavouriteURL = articleId => {
  return `/articles/${articleId}/favourite`;
};
