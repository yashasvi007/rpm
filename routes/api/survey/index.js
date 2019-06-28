const express = require("express");
const router = express.Router();
const surveyController = require("../../../app/controllers/survey/survey.controller");
const { check, body } = require("express-validator/check");
const rbac = require("../../../app/helper/rbac");
import Authenticate from "../middleware/auth";
import { USER_CATEGORY } from "../../../constant";
const Response = require("../../../app/helper/responseFormat");

router.use(function(req, res, next) {
  const category = req.userDetails.userData.category;
  if (USER_CATEGORY.DOCTOR === category) {
    const response = new Response(false, 403);
    response.setError({ error: "Page not accessible" });
    return res.status(403).json(response.getResponse());
  } else {
    next();
  }
});

router.post(
  "/surveyTemplate/create",
  Authenticate,
  [
    check("title")
      .isString()
      .not()
      .isEmpty(),
    check("description")
      .isString()
      .not()
      .isEmpty(),
    check("questions")
      .not()
      .isEmpty(),
    check("programs")
      .not()
      .isEmpty(),
    check("time_to_complete")
      .not()
      .isEmpty()
  ],
  surveyController.createSurveyTemplate
);

router.get(
  "/surveyTemplate/list",
  Authenticate,
  surveyController.listUserSurveyTemplates
);

router.post(
  "/survey/create",
  Authenticate,
  [
    check("startDate")
      .not()
      .isEmpty(),
    check("endDate")
      .not()
      .isEmpty(),
    check("participants")
      .not()
      .isEmpty()
  ],
  surveyController.createSurvey
);

router.get(
  "/survey/status/:status",
  Authenticate,
  surveyController.listSurveyByStatus
);

router.get(
  "/survey/recentlySentSurveys",
  surveyController.getRecentlySentSurveys
);

router.get(
  "/survey/:surveyId/participants/status/:status",
  Authenticate,
  surveyController.getSurveyParticipantsByStatus
);

router.post(
  "/survey/:surveyId/addPatients",
  Authenticate,
  [
    check("participants")
      .not()
      .isEmpty(),
    check("participants.*.participantId")
      .not()
      .isEmpty(),
    check("participants.*.participantCategory")
      .not()
      .isEmpty()
  ],
  surveyController.addSurveyParticipants
);
router.post(
  "/survey/:surveyId/updateDate",
  Authenticate,
  [
    check("endDate")
      .not()
      .isEmpty()
  ],
  surveyController.updateSurveyDate
);

router.post(
  "/survey/:surveyId/update",
  Authenticate,
  surveyController.updateSurvey
);

router.get("/survey/:surveyId/end", Authenticate, surveyController.endSurvey);
router.get(
  "/survey/:surveyId/participant/:participantId/response",
  Authenticate,
  surveyController.getSurveyParicipantsResponse
);
router.get(
  "/survey/:surveyId/allResponse",
  Authenticate,
  surveyController.getSurveyAllParicipantsResponse
);
router.get("/survey/:id/questions", Authenticate, surveyController.getquestion);
router.get(
  "/surveyTemplate/:templateId/surveyprogram",
  Authenticate,
  surveyController.getSurveyTemplatesSurveyProgram
);
router.get("/survey/:surveyId", Authenticate, surveyController.getSurveyById);
router.post(
  "/survey/:surveyId/response",
  Authenticate,
  surveyController.addParticipantResponse
);
router.get(
  "/survey/:surveyId/download",
  Authenticate,
  surveyController.downloadSurveyReport
);

module.exports = router;
