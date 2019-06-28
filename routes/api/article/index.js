const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator/check");
const articleController = require("../../../app/controllers/article/article.controller");
import Authenticate from "../middleware/auth";

router.post(
  "/articles",
  Authenticate,
  [
    check("title")
      .isString()
      .not()
      .isEmpty(),
    check("description").isString(),
    check("createdBy")
      .isString()
      .not()
      .isEmpty(),
    check("participants"),
    check("timeToRead").isString(),
    check("url").isURL()
  ],
  articleController.createArticle
);

router.get("/articles", Authenticate, articleController.getArticles);

router.post(
  "/articles/:articleId/favourite",
  Authenticate,
  [
    check("articleId")
      .isString()
      .not()
      .isEmpty(),
    check("isFavourite")
      .isBoolean()
      .not()
      .isEmpty()
  ],
  articleController.makeFavouriteUnfavourite
);

router.get(
  "/articles/:articleId",
  Authenticate,
  articleController.getArticleById
);

router.get(
  "/articles/:articleId/participants",
  Authenticate,
  articleController.getParticipants
);

router.post(
  "/articles/:articleId/share",
  Authenticate,
  [
    check("articleId")
      .isString()
      .not()
      .isEmpty(),
    check("participants")
      .isArray()
      .not()
      .isEmpty()
  ],
  articleController.shareArticle
);

router.post(
  "/articles/viewed",
  Authenticate,
  [
    check("articleId")
      .isString()
      .not()
      .isEmpty()
  ],
  articleController.hasViewed
);

module.exports = router;
