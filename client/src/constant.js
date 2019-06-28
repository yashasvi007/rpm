export const HOST = "/api";
//user category

export const USER_CATEGORY = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  PROGRAM_ADMIN: "programAdmin",
  CARE_COACH: "careCoach"
};

//request type
export const REQUEST_TYPE = {
  POST: "post",
  GET: "get",
  PUT: "put",
  DELETE: "delete"
};

export const PROFILE_SETUP_STAGE = {
  UPLOAD_CONSENT_FORM: 0,
  UPLOAD_ID_PROOF: 1,
  SETUP_PROFILE: 2,
  DASHBOARD: 3
};

export const path = {
  CONSENT_FORM: "/consent-from",
  ID_PROOF: "/id-proof",
  EDIT_PROFILE: "/edit-profile",
  CALENDAR_SYNC: "/calendar-sync",
  MY_PROFILE: "/my-profile",
  CHANGE_PASSWORD: "/change-password",
  PROFILE_SETUP: "/profile-setup",
  SIGN_IN: "/sign-in",
  ARTICLES: "/articles",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:link",
  IDENTIFY: "/identify/:link",
  SIGN_UP: "/sign-up/:link",
  LANDING_PAGE: "/",
  DASHBOARD: {
    DASHBOARD: "/",
    HOME: "/dashboard",
    ONLY_CALENDAR: "/calendar",
    CALENDAR: "/calendar/:show",
    PROGRAMS: "/programs",
    ONLY_SURVEYS: "/surveys",
    SURVEYS: "/surveys/:show",
    ONLY_MEDICALS: "/medicals",
    MEDICALS: "/medicals/:show"
  },
  SEARCH: "/search",
  PROGRAM_DETAILS: "/program/:id",
  PROGRAM_SUMMARY: "/program/:id/summary",
  ENTITY: {
    ROOT: "/:entity",
    PROFILE: "/:entity/:id",
    EDIT_PROFILE: "/:entity/:id/edit"
  },
  CREATESURVEYDETAIL: "/create-survey/template/:templateId",
  PREVIEWQUESTIONNAIRE: "/survey/:templateId/questionnaire",
  SURVEYDETAIL: "/survey/:surveyId",
  PATIENT_RESPONSE: "/survey/:surveyId/participant/:participantId/response",
  REMOTE_CONSULTING: "/remoteConsulting/:roomId",
  ARTICLE: {
    ROOT: "/articles",
    DETAILS: "/articles/:articleId"
  },
  APPOINTMENT_HISTORY: "/appointment-history"
};

export const GLOBAL_MODALS = {
  EVENT_MODAL: "EVENT_MODAL",
  PATIENT_MODAL: "PATIENT_MODAL",
  DOCTOR_MODAL: "DOCTOR_MODAL",
  DISCHARGE_PATIENT: "DISCHARGE_PATIENT",
  HISTORICAL_CLINICAL_READING: "HISTORICAL_CLINICAL_READING",
  CANCEL_APPOINTMENT: "CANCEL_APPOINTMENT",
  CANCEL_REMINDER: "CANCEL_REMINDER",
  MEDICATION: "MEDICATION",
  CLINICALREADING: "CLINICALREADING",
  ADVERSE_EVENTS: "ADVERSE_EVENTS",
  HISTORICAL_VITALS_READING: "HISTORICAL_VITALS_READING",
  HISTORICAL_MEDICATION_DATA: "HISTORICAL_MEDICATION_DATA",
  DOCUMENTS_MODAL: "DOCUMENTS_MODAL",
  CHANGE_PASSWORD: "CHANGE_PASSWORD",
  PRESCRIPTION: "PRESCRIPTION",
  END_SURVEY: "END_SURVEY",
  ADVERSE_EVENT_IMAGE_MODAL: "ADVERSE_EVENT_IMAGE_MODAL",
  ARTICLE_SHARE_TO_PATIENTS: "ARTICLE_SHARE_TO_PATIENTS",
  ARTICLE_SHARE_WITH: "ARTICLE_SHARE_WITH"
};

export const APPOINTMENT_TYPE = {
  FOLLOWUP: "followup",
  MEDICATION: "medication",
  MATERIAL_DELIVERY: "material_delivery"
};

export const EVENT_TYPE = {
  ALL: "all",
  APPOINTMENT: "appointment",
  REMINDER: "reminder",
  APPOINTMENTS: "appointments",
  REMINDERS: "reminders"
};

export const REPEAT_TYPE = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly"
};

export const ACTIVITY_TYPE = {
  VISIT: "visit",
  CALL: "call",
  CHAT: "chat"
};

export const REPEAT_OPTION = [
  { label: "Does not repeat", key: REPEAT_TYPE.NONE },
  { label: "Repeats Daily", key: REPEAT_TYPE.DAILY },
  { label: "Repeats Weekly", key: REPEAT_TYPE.WEEKLY },
  { label: "Repeats Monthly", key: REPEAT_TYPE.MONTHLY },
  { label: "Repeats Yearly", key: REPEAT_TYPE.YEARLY }
];

export const ENTITY = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  PROGRAM: "program"
};

export const EVENT_ACTION = {
  EDIT_NOTES: "EDIT_NOTES",
  RESCHEDULE: "RESCHEDULE",
  EDIT_REMINDER: "EDIT_REMINDER",
  ADD_NOTES: "ADD_NOTES",
  DELETE_REMINDER: "DELETE_REMINDER"
};

export const SEVERITY = {
  MILD: "MILD",
  MODERATE: "MODERATE",
  SEVERE: "SEVERE",
  VERY_SEVERE: "VERY_SEVERE",
  FATAL: "FATAL"
};

export const DASHBOARD_MENU = {
  HOME: "dashboard",
  PROGRAMS: "programs",
  CALENDAR: "calendar",
  SURVEYS: "surveys",
  MEDICALS: "medicals"
};

export const USER_STATUS = {
  ENROLLED: "ENROLLED",
  DISCHARGED: "DISCHARGED",
  INACTIVE: "INACTIVE"
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//style
export const GRID_GUTTER = { xs: 0, sm: 16, md: 24, lg: 24, xl: 24, xxl: 24 };

export const DISPLAY_TYPE = {
  READONLY: "readonly",
  WRITABLE: "writable",
  RESPONSE: "response"
};

export const OPTION_TYPE = {
  TEXT: "TEXT",
  STAR: "STAR",
  RADIO: "RADIO",
  CHECKBOX: "CHECKBOX"
};

export const SURVEY_STATUS = {
  COMPLETED: "COMPLETED",
  INPROGRESS: "INPROGRESS"
};

export const EVENT = {
  ACTIVITY_MODE: {
    CALL: "call",
    VISIT: "visit",
    VIDEO: "video",
    CHAT: "chat"
  },
  STATUS: {
    PENDING: "pending",
    PASSED: "passed",
    COMPLETED: "completed",
    STARTED: "started"
  }
};

export const MEDICALS_OPTIONS = {
  BASIC: "Basic",
  VITAL: "Vital",
  CLINICAL_READING: "Clinical Reading",
  CLINICALREADING: "Clinical-Reading",
  MEDICATION: "Medication",
  ADVERSE_EVENTS: "Adverse Event",
  ADVERSEEVENTS: "Adverse-Event"
};

export const PATIENT_PROFILE_TAB = {
  CALENDAR: "Calendar",
  MEDICAL_DETAILS: "Medical-Details"
};

export const MODE = {
  READ: "read",
  WRITE: "write"
};

export const PATIENTDASHBOARD = "patient-dashboard";

export const BASICFIELD = {
  CHIEF_COMPLAINT: "chiefComplaint",
  ALLERGIES: "allergies",
  SURGERIES_OR_FRACTURE: "surgeriesOrFracture",
  OTHERS: "others"
};

export const VITALFIELD = {
  TEMPERATURE_UNIT: "temperatureUnit",
  TEMPERATURE: "temperature",
  RESPIRATION_RATE: "respirationRate",
  PULSE: "pulse",
  BLOOD_PRESSURE: "bloodPressure",
  TEMPERATURE_UNIT_C: "c",
  TEMPERATURE_UNIT_F: "f"
};

export const ALL_SORT_BY = {
  NAME: "Name",
  RECENTLY_UPDATED: "Recently Updated",
  LOCATION: "Location",
  DATE_ADDED: "Date Added",
  DATE_SENT: "Date Sent",
  MOST_POPULAR: "Most Popular"
};

export const DOCUMENT_FILTER_TYPE = {
  ALL: "All",
  NOT_CONSENTED: "Not Consented",
  NOT_VERIFIED: "Not Verified"
};

export const SURVEYS = {
  INPROGRESS: "Inprogress",
  COMPLETED: "Completed",
  ALL_TEMPLATES: "AllTemplates"
};

export const ARTICLES = {
  RECOMMENDED: "Recommended",
  FAVOURITES: "Favourites"
};

export const VALIDITY = {
  ACTIVE: "Active",
  EXPIRE: "Expire"
};

export const SEARCH_RESULT_TAB = {
  Program: "Program",
  Patient: "Patient",
  Doctor: "Doctor"
};
