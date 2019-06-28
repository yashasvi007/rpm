export const getSurveyTemplateListURL = () => {
  return "/surveyTemplate/list";
};
export const getTemplatesQuestionURL = surveyID => {
  return `/survey/${surveyID}/questions`;
};
export const getCreateSurveyURL = userId => {
  return `/survey/create`;
};
export const getFetchSurveyByStatusURL = status => {
  return `/survey/status/${status}`;
};
export const getFetchSurveyPaticipantCompletedURL = surveyId => {
  return `/survey/${surveyId}/participants/status/completed`;
};
export const getUpdateSurveyCompletedURL = surveyId => {
  return `/survey/${surveyId}/update`;
};
export const getSurveyTemplateProgramURL = templateId => {
  return `/surveyTemplate/${templateId}/surveyprogram`;
};
export const getSurveyEndURL = surveyId => {
  return `/survey/${surveyId}/end`;
};
export const getSurveyByIdURL = surveyId => {
  return `/survey/${surveyId}`;
};
export const getAddParticipantResponseURL = surveyId => {
  return `/survey/${surveyId}/response`;
};
export const downloadSurveyReport = surveyId => {
  return `/survey/${surveyId}/download`;
};
export const getFetchParticicpantByStatusURL = (surveyId, status) => {
  return `/survey/${surveyId}/participants/status/${status}`;
};
export const getFetchPatientResponURL = (surveyId, pateintId) => {
  return `/survey/${surveyId}/participant/${pateintId}/response`;
};
export const getRecentlySentSurveysURL = () => {
  return `/survey/recentlySentSurveys`;
};
