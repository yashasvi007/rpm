import { combineReducers } from "redux";
import users from "../modules/user";
import phone from "../modules/phone";
import countryCities from "../modules/countryCity";
import auth from "../modules/auth";
import editProfile from "../modules/page/EditProfile";
import changePassword from "../modules/page/changePassword";
import medicals from "../modules/medical";
import programs from "../modules/program";
import products from "../modules/product";
import medications from "../modules/medication";
import profileSetUp from "../modules/page/profileSetup";
import insuranceProviders from "../modules/insuarnceProvider";
import hospitals from "../modules/hospital";
import modal from "../modules/modals";
import events from "../modules/events";
import surveytemplates from "../modules/surveyTemplate";
import surveys from "../modules/survey";
import articles from "../modules/article";
import patientProfile from "../modules/page/Patientprofile";
import patientResponse from "../modules/page/patientResponse";
import doctorProfile from "../modules/page/doctorProfile";
import clinicalTestTemplates from "../modules/clinicalTestTemplates";
import createSurvey from "../modules/page/createSurvey";
import successMsg from "../modules/successMsg";
import programDetails from "../modules/page/programDetails";
import twilio from "../modules/twilio";
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
