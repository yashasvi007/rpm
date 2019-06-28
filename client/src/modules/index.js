import { combineReducers } from "redux";
import users from "./user";
import phone from "./phone";
import countryCities from "./countryCity";
import auth from "./auth";
import editProfile from "./page/EditProfile";
import changePassword from "./page/changePassword";
import medicals from "./medical";
import programs from "./program";
import products from "./product";
import medications from "./medication";
import profileSetUp from "./page/profileSetup";
import insuranceProviders from "./insuarnceProvider";
import hospitals from "./hospital";
import modal from "./modals";
import events from "./events";
import surveytemplates from "./surveyTemplate";
import surveys from "./survey";
import patientProfile from "./page/Patientprofile";
import patientResponse from "./page/patientResponse";
import doctorProfile from "./page/doctorProfile";
import clinicalTestTemplates from "./clinicalTestTemplates";
import createSurvey from "./page/createSurvey";
import successMsg from "./successMsg";
import programDetails from "./page/programDetails";
import twilio from "./twilio";
import articles from "./articles";
const page = combineReducers({
  editProfile,
  changePassword,
  profileSetUp,
  patientProfile,
  doctorProfile,
  createSurvey,
  programDetails,
  patientResponse
});

export default combineReducers({
  users,
  phone,
  countryCities,
  auth,
  medicals,
  programs,
  medications,
  products,
  insuranceProviders,
  page,
  modal,
  hospitals,
  twilio,
  events,
  clinicalTestTemplates,
  successMsg,
  surveytemplates,
  surveys,
  articles
});
