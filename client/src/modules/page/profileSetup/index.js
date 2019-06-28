import { doRequest } from "../../../Helper/network";
import { User } from "../../../Helper/urls";
import {
  REQUEST_TYPE,
  PROFILE_SETUP_STAGE,
  USER_CATEGORY
} from "../../../constant";

import {
  SIGNING_COMPLETED,
  SIGNING_UP_COMPLETED,
  GETTING_INITIAL_DATA_COMPLETED
} from "../../auth";

const SAVING_USER_CONSENT_FORM = "SAVING_USER_CONSENT_FORM";
const SAVING_USER_CONSENT_FORM_COMPLETED = "SAVING_USER_CONSENT_FORM_COMPLETED";
const SAVING_USER_CONSENT_FORM_COMPLETED_WITH_ERROR =
  "SAVING_USER_CONSENT_FORM_COMPLETED_WITH_ERROR";

const SAVING_USER_ID_PROOF = "SAVING_USER_ID_PROOF";
const SAVING_USER_ID_PROOF_COMPLETED = "SAVING_USER_ID_PROOF_COMPLETED";
const SAVING_USER_ID_PROOF_COMPLETED_WITH_ERROR =
  "SAVING_USER_ID_PROOF_COMPLETED_WITH_ERROR";

const intial_state = {
  current: PROFILE_SETUP_STAGE.UPLOAD_CONSENT_FORM
};

export const saveUserConsentForm = ({ data, onUploadProgress }) => {
  return async dispatch => {
    try {
      dispatch({ type: SAVING_USER_CONSENT_FORM });
      const response = await doRequest({
        onUploadProgress: onUploadProgress,
        method: REQUEST_TYPE.POST,
        data: data,
        url: User.getUploadConsentFormURL()
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({ type: SAVING_USER_CONSENT_FORM_COMPLETED, payload });
      } else if (status === false) {
        dispatch({
          type: SAVING_USER_CONSENT_FORM_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

export const saveUserIdProof = ({ data, onUploadProgress }) => {
  return async dispatch => {
    try {
      dispatch({ type: SAVING_USER_ID_PROOF });
      let response = await doRequest({
        onUploadProgress: onUploadProgress,
        method: REQUEST_TYPE.POST,
        data: data,
        url: User.getUploadIdProofURL()
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({ type: SAVING_USER_ID_PROOF_COMPLETED, payload });
      } else if (status === false) {
        dispatch({
          type: SAVING_USER_ID_PROOF_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

export default (state = intial_state, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case SAVING_USER_CONSENT_FORM:
      return {
        ...state,
        is_saving: true,
        is_saved: false,
        is_error: false,
        current: PROFILE_SETUP_STAGE.UPLOAD_CONSENT_FORM,
        error: {}
      };
    case SAVING_USER_CONSENT_FORM_COMPLETED:
      return {
        ...state,
        is_saving: false,
        is_saved: true,
        is_error: false,
        current: PROFILE_SETUP_STAGE.UPLOAD_ID_PROOF,
        msg: payload.message,
        error: {}
      };
    case SAVING_USER_CONSENT_FORM_COMPLETED_WITH_ERROR:
      return {
        ...state,
        is_saving: false,
        is_saved: false,
        is_error: true,
        current: PROFILE_SETUP_STAGE.UPLOAD_CONSENT_FORM,
        error: payload
      };
    case SAVING_USER_ID_PROOF:
      return {
        ...state,
        is_saving: true,
        is_saved: false,
        is_error: false,
        current: PROFILE_SETUP_STAGE.UPLOAD_ID_PROOF,
        error: {}
      };
    case SAVING_USER_ID_PROOF_COMPLETED:
      return {
        ...state,
        is_saving: false,
        is_saved: true,
        is_error: false,
        current: PROFILE_SETUP_STAGE.SETUP_PROFILE,
        msg: payload.message,
        error: {}
      };
    case SAVING_USER_ID_PROOF_COMPLETED_WITH_ERROR:
      return {
        ...state,
        is_saving: false,
        is_saved: false,
        is_error: true,
        current: PROFILE_SETUP_STAGE.UPLOAD_ID_PROOF,
        error: payload
      };
    case GETTING_INITIAL_DATA_COMPLETED:
    case SIGNING_COMPLETED:
    case SIGNING_UP_COMPLETED: {
      const { users = {}, authenticatedUser } = payload;
      const {
        isConsentFormUploaded,
        isIdProofUploaded,
        isProfileCompleted,
        basicInfo: { category } = {}
      } = users[authenticatedUser] || {};
      let current = PROFILE_SETUP_STAGE.DASHBOARD;
      if (!isConsentFormUploaded && category === USER_CATEGORY.PATIENT)
        current = PROFILE_SETUP_STAGE.UPLOAD_CONSENT_FORM;
      else if (!isIdProofUploaded && category === USER_CATEGORY.PATIENT)
        current = PROFILE_SETUP_STAGE.UPLOAD_ID_PROOF;
      else if (!isProfileCompleted) current = PROFILE_SETUP_STAGE.SETUP_PROFILE;
      return { ...state, current };
    }
    default:
      return state;
  }
};
