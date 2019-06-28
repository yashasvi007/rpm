export const getArticleEmailTemplateData = data => {
  const { participantName, title, articleId } = data;
  let mailData = {};
  mailData.host = process.config.APP_URL;
  mailData.userName = participantName;
  mailData.articleTitle = title;
  mailData.buttonText = "View in App";
  mailData.link = `${process.config.WEB_URL}/article/${articleId}`;
  return mailData;
};
