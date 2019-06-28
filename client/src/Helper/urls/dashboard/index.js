// import HOST from "../../../constant";

export const getDashBoardUrl = user_id => {
  return "/user/dashboard";
};

export const goToDashBoardHome = () => {
  return "/dashboard/home";
};

export const goToCalendar = show => {
  return `/dashboard/calendar/${show}`;
};

export const goToPrograms = () => {
  return "dashboard/programs";
};

export const goToSurveys = show => {
  return `dashboard/surveys/${show}`;
};
