import { doRequest } from "../../Helper/network";
import { Article } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";

const FETCHING_ARTICLES = "FETCHING_ARTICLES";
const FETCHING_ARTICLES_COMPLETED = "FETCHING_ARTICLES_COMPLETED";
const FETCHING_ARTICLES_COMPLETED_WITH_ERROR =
  "FETCHING_ARTICLES_COMPLETED_WITH_ERROR";
export const MAKE_FAVOURITE_UNFAVOURITE = "MAKE_FAVOURITE_UNFAVOURITE";
export const MAKE_FAVOURITE_UNFAVOURITE_COMPLETE =
  "MAKE_FAVOURITE_UNFAVOURITE_COMPLETE";
export const MAKE_FAVOURITE_UNFAVOURITE_COMPLETE_WITH_ERROR =
  "MAKE_FAVOURITE_UNFAVOURITE_COMPLETED_WITH_ERROR";

export const FETCHING_ARTICLE_BY_ID = "FETCHING_ARTICLE_BY_ID";
export const FETCHING_ARTICLE_BY_ID_COMPLETED =
  "FETCHING_ARTICLE_BY_ID_COMPLETED";
export const FETCHING_ARTICLE_BY_ID_COMPLETED_WITH_ERROR =
  "FETCHING_ARTICLE_BY_ID_COMPLETED_WITH_ERROR";

export const SHARING_ARTICLE = "SHARING_ARTICLE";
export const SHARING_ARTICLE_COMPLETED = "SHARING_ARTICLE_COMPLETED";
export const SHARING_ARTICLE_COMPLETED_WITH_ERROR =
  "SHARING_ARTICLE_COMPLETED_WITH_ERROR";

export const ARTICLE_PARTICIPANTS = "ARTICLE_PARTICIPANTS";
export const ARTICLE_PARTICIPANTS_COMPLETED = "ARTICLE_PARTICIPANTS_COMPLETED";
export const ARTICLE_PARTICIPANTS_COMPLETED_WITH_ERROR =
  "ARTICLE_PARTICIPANTS_COMPLETED_WITH_ERROR";

export const fetchArticleParticipants = articleId => {
  return async dispatch => {
    let response = {};
    try {
      dispatch({ type: ARTICLE_PARTICIPANTS });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Article.getArticleParticipantsURL(articleId)
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: ARTICLE_PARTICIPANTS_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: ARTICLE_PARTICIPANTS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
    return response;
  };
};

export const fetchArticlesById = articleId => {
  return async dispatch => {
    let response = {};
    try {
      dispatch({ type: FETCHING_ARTICLE_BY_ID });
      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Article.getArticleByIdURL(articleId)
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_ARTICLE_BY_ID_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_ARTICLE_BY_ID_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
    return response;
  };
};

export const shareArticle = data => {
  return async dispatch => {
    let response = {};
    try {
      const { participants, articleId } = data;
      dispatch({ type: SHARING_ARTICLE });
      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Article.getShareArticleURL(articleId),
        data: { participants }
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: SHARING_ARTICLE_COMPLETED,
          payload: { ...payload.data, message: payload.message }
        });
      } else if (response.status === false) {
        dispatch({
          type: SHARING_ARTICLE_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
    return response;
  };
};

export const makeFavouriteUnfavourite = data => {
  return async (dispatch, getState) => {
    try {
      const { articleId, isFavourite } = data;

      dispatch({ type: MAKE_FAVOURITE_UNFAVOURITE });
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: { isFavourite },
        url: Article.makeFavouriteUnfavouriteURL(articleId)
      });
      const { status, payload } = response;
      if (status === true) {
        let { articles } = getState();
        dispatch({
          type: MAKE_FAVOURITE_UNFAVOURITE_COMPLETE,
          payload: {
            articleId,
            isFavourite,
            articles,
            message: payload.message
          }
        });
      } else if (status === false) {
        dispatch({
          type: MAKE_FAVOURITE_UNFAVOURITE_COMPLETE_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {
      console.log("ERROR", error);
      throw error;
    }
  };
};

export const fetchArticles = () => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_ARTICLES });
      const response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Article.getArticlesURL()
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_ARTICLES_COMPLETED,
          payload: payload.data
        });
      } else if (status === false) {
        dispatch({
          type: FETCHING_ARTICLES_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {
      console.log("ERROR", error);
      throw error;
    }
  };
};

function setArticles(state = {}, data = {}) {
  const { articles } = data;
  if (articles) {
    return { ...state, ...articles };
  }
  return state;
}

function setArticleStateOnfavouriteUnfavourite(state, data) {
  let { articleId, isFavourite, articles } = data;
  let newArticles = { ...articles };
  newArticles[articleId].isFavourite = isFavourite;
  return { ...state, ...newArticles };
}

export default (state = {}, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case MAKE_FAVOURITE_UNFAVOURITE_COMPLETE:
      return setArticleStateOnfavouriteUnfavourite(state, payload);
    default:
      return setArticles(state, payload);
  }
};
