export const ACTIVITY_TYPE = {
  FOLLOWUP: "followup",
  MEDICATION: "medication",
  MATERIAL_DELIVERY: "material_delivery"
};

export const EVENT_TYPE = {
  INVITATION: "invitation",
  APPOINTMENT: "appointment",
  FORGOT_PASSWORD: "forgotPassword",
  REMINDER: "reminder",
  ADVERSE_EVENT: "adverse"
};

export const ACTIVITY_MODE = {
  CALL: "call",
  VISIT: "visit",
  CHAT: "chat"
};

export const REPEAT_TYPE = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly"
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const USER_STATUS = {
  ENROLLED: "ENROLLED",
  DISCHARGED: "DISCHARGED",
  INACTIVE: "INACTIVE"
};

export const SEVERITY = {
  MILD: "MILD",
  MODERATE: "MODERATE",
  SEVERE: "SEVERE",
  VERY_SEVERE: "VERY_SEVERE",
  FATAL: "FATAL"
};

export const USER_CATEGORY = {
  DOCTOR: "doctor",
  PATIENT: "patient",
  PROGRAM_ADMIN: "programAdmin",
  CARE_COACH: "careCoach"
};

export const REQUEST_TYPE = {
  POST: "post",
  GET: "get",
  PUT: "put",
  DELETE: "delete"
};

export const EVENT_IS = {
  CREATED: "CREATED",
  CANCEL: "CANCEL",
  RESCHEDULED: "RESCHEDULED",
  START: "START",
  PASSED: "PASSED",
  COMPLETE: "COMPLETE",
  MARKINCOMPLETE: "MARKINCOMPLETE",
  UPDATED: "UPDATED"
};

export const ACTIVITY_LOG_STATUS = {
  PENDING: "pending",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  EXPIRED: "expired"
};

export const DEFAULT = "default";

export const PARTICIPANTS_SURVEY_STATUS = {
  COMPLETED: "COMPLETED"
};

export const RESOURCE = {
  DOCTORS: "doctors",
  PATIENTS: "patients",
  CARE_COACHS: "careCoachs",
  PROGRAM_ADMINS: "programAdmins",
  EVENTS: "events",
  PROGRAMS: "programs",
  SURVEYS: "surveyS"
};

export const PERMISSIONS = {
  CREATE: "create",
  UPDATE: "update",
  VIEW: "view",
  INVITE: "invite",
  CANCEL: "cancel",
  VERIFY: "verify",
  SEND: "send",
  END: "end",
  DISCHARGE: "discharge"
};

export const GRANTS = {
  PROGRAM: {
    CREATE: "create_programs",
    UPDATE: "update_programs",
    VIEW: "view_programs",
    INVITE: "invite_programs"
  },
  EVENT: {
    CREATE: "create_events",
    UPDATE: "update_events",
    VIEW: "view_events",
    CANCEL: "cancel_events"
  },
  PASSWORD: {
    UPDATE: "update_passwords"
    //VIEW: "view_password",
  },
  USERS: {
    VIEW_PATIENT: "view_patients",
    UPDATE_PATIENT: "update_patients",
    VIEW_DOCTOR: "view_doctors",
    UPDATE_DOCTOR: "update_doctors",
    UPDATE_CARE_COACH: "update_careCoaches",
    VERIFY_PATIENT: "verify_patients",
    DISCHARGE_PATIENT: "discharge_patients"
  },
  MEDICATION: {
    CREATE: "create_medications",
    UPDATE: "update_medications",
    VIEW: "view_medications"
  },
  ADVERSE_EVENT: {
    CREATE: "create_adverseEvents",
    VIEW: "view_adverseEvents"
  },
  PRODUCT: {
    CREATE: "create_products",
    UPDATE: "update_products",
    VIEW: "view_products"
  },
  INSURANCE_PROVIDER: {
    VIEW: "view_insuranceProviders",
    UPDATE: "update_insuranceProviders"
  },
  HOSPITAL: {
    VIEW: "view_hospitals",
    UPDATE: "update_hospitals"
  },
  TWILIO: {
    CREATE: "create_twilios", //Create API gives us token no need for View Permission
    UPDATE: "update_twilios"
  },
  SURVEY: {
    CREATE: "create_surveys",
    UPDATE: "update_surveys",
    VIEW: "view_surveys",
    END: "end_surveys"
  },
  OTP: {
    SEND: "send_otps",
    VERIFY: "verify_otps"
  }
};
