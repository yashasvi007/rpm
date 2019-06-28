import { doRequest } from "../../Helper/network";
import { User } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";
import { CHANGING_PROFILE_PIC_COMPLETED } from "../page/changeProfilePic";
import { SENDING_OTP_COMPLETED, VERIFYING_OTP_COMPLETED } from "../phone";
import { SAVING_USER_COMPLETED } from "../page/EditProfile";
import config from "../../config";

export const DISCHARGE_PATIENT_REQUEST = "DISCHARGE_PATIENT_REQUEST";
export const DISCHARGE_PATIENT_REQUEST_COMPLETED =
  "DISCHARGE_PATIENT_REQUEST_COMPLETED";
export const DISCHARGE_PATIENT_REQUEST_COMPLETED_WITH_ERROR =
  "DISCHARGE_PATIENT_REQUEST_COMPLETED_WITH_ERROR";

export const VERIFY_DOCUMENT_REQUEST = "VERIFY_DOCUMENT_REQUEST";
export const VERIFY_DOCUMENT_REQUEST_COMPLETED =
  "VERIFY_DOCUMENT_REQUEST_COMPLETED";
export const VERIFY_DOCUMENT_REQUEST_COMPLETED_WITH_ERROR =
  "VERIFY_DOCUMENT_REQUEST_COMPLETED_WITH_ERROR";

export const REUPLOAD_IDPROOF_REQUEST = "REUPLOAD_IDPROOF_REQUEST";
export const REUPLOAD_IDPROOF_REQUEST_COMPLETED =
  "REUPLOAD_IDPROOF_REQUEST_COMPLETED";
export const REUPLOAD_IDPROOF_REQUEST_COMPLETED_WITH_ERROR =
  "REUPLOAD_IDPROOF_REQUEST_COMPLETED_WITH_ERROR";

export const REUPLOAD_CONSENTFORM_REQUEST = "REUPLOAD_CONSENTFORM_REQUEST";
export const REUPLOAD_CONSENTFORM_REQUEST_COMPLETED =
  "REUPLOAD_CONSENTFORM_REQUEST_COMPLETED";
export const REUPLOAD_CONSENTFORM_REQUEST_COMPLETED_WITH_ERROR =
  "REUPLOAD_CONSENTFORM_REQUEST_COMPLETED_WITH_ERROR";

const initialState = {};

function setUsersData(state, data = {}) {
  const { users } = data;

  if (users) {
    // ("=+++++++++++++++++++user data------------", Object.keys(users))
    const userIds = Object.keys(users);
    const prevUsers = { ...state };
    let newState = Object.assign({}, prevUsers);

    userIds.forEach(id => {
      newState = Object.assign(
        newState,
        setIndividualUser(prevUsers, users, id)
      );
    });
    //
    return newState;
  } else return state;
}

function setIndividualUser(state, users, id) {
  const user = Object.assign({}, state[id], users[id]);
  return { [id]: { ...user, baseDocUrl: config.BASE_DOC_URL } }; //addded quick fix need to remove
}

// function updateDataReducer(state, data) {
//   return Object.assign({}, state, data);
// }

// function updateUserDataReducer(state, data) {
//   return Object.assign({}, state, {
//     userData: updateDataReducer(state.userData, data)
//   });
// }

function changeCurrentUserProfilePic(state, data) {
  try {
    const { id, profilePicUrl } = data;
    const allUsers = state;
    const currentUsers = Object.assign({}, allUsers[id]);
    const { basicInfo } = currentUsers;
    const newBasicInfo = { ...basicInfo, profilePicLink: profilePicUrl };
    const updatedData = { ...currentUsers, basicInfo: newBasicInfo };
    const updatedUsers = { ...allUsers, [id]: updatedData };
    return updatedUsers;
  } catch (err) {
    throw err;
  }
}

function changeContactNo(state, data) {
  const { id, contactNo = {} } = data;
  const allUsers = state;
  const currentUsers = Object.assign({}, allUsers[id]);
  const { personalInfo } = currentUsers;
  const newContact = Object.assign(personalInfo.contactNo, contactNo);
  const newPerSonalInfo = { ...personalInfo, contactNo: newContact };
  return {
    ...allUsers,
    [id]: { ...currentUsers, personalInfo: newPerSonalInfo }
  };
}

function setUserProfileComPleted(user) {
  return { ...user, isProfileCompleted: true };
}

function changeDocumentVerificationStatus(state, payload, userId) {
  const allUsers = state;
  const currentUser = Object.assign({}, allUsers[userId]);
  const { documents } = currentUser;
  const newDocuments = {
    ...documents,
    consentFormVerified: payload.consentFormVerified,
    idProofVerified: payload.idProofVerified
  };
  const status =
    payload.consentFormVerified && payload.idProofVerified
      ? "ENROLLED"
      : "INACTIVE";
  return {
    ...allUsers,
    [userId]: { ...currentUser, documents: newDocuments, status: status }
  };
}

function updateUserDocuments(state, payload) {
  const { data, userId } = payload;
  const allUsers = state;
  const currentUser = Object.assign({}, allUsers[userId]);
  return {
    ...allUsers,
    [userId]: { ...currentUser, status: "INACTIVE", ...data }
  };
}

function updateUserStatusToDischarged(state, payload) {
  const { ids: userIds } = payload;
  const allUsers = state;
  let updatedUsers = { ...allUsers };
  userIds.forEach(id => {
    const currentUser = Object.assign({}, allUsers[id]);
    updatedUsers = {
      ...updatedUsers,
      [id]: { ...currentUser, status: "DISCHARGED" }
    };
  });
  return updatedUsers;
}

export const discharge = ids => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: DISCHARGE_PATIENT_REQUEST });
      const url = User.getDischargePatientURL();
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: { ids: ids },
        url: url
      });
      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: DISCHARGE_PATIENT_REQUEST_COMPLETED,
          payload: {
            ids: ids,
            message: payload.message
          }
        });
      } else if (response.status === false) {
        dispatch({
          type: DISCHARGE_PATIENT_REQUEST_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
      return status;
    } catch (error) {}
  };
};

export const verify = (id, proofs) => {
  return async dispatch => {
    try {
      dispatch({ type: VERIFY_DOCUMENT_REQUEST });
      const url = User.verifyDocumentURL(id);
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: proofs,
        url: url
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: VERIFY_DOCUMENT_REQUEST_COMPLETED,
          payload: payload.data,
          userId: id
        });
      } else if (response.status === false) {
        dispatch({
          type: VERIFY_DOCUMENT_REQUEST_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const reUploadIdProofs = (id, idProofs) => {
  return async dispatch => {
    try {
      const docs = { docs: idProofs };
      dispatch({ type: REUPLOAD_IDPROOF_REQUEST });
      const url = User.reUploadIdProofsURL(id);
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: docs,
        url: url
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: REUPLOAD_IDPROOF_REQUEST_COMPLETED,
          payload: { data: payload.data, userId: id }
        });
      } else if (response.status === false) {
        dispatch({
          type: REUPLOAD_IDPROOF_REQUEST_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const reUploadConsentDocs = (id, consentDocs) => {
  return async dispatch => {
    try {
      const docs = { docs: consentDocs };
      dispatch({ type: REUPLOAD_CONSENTFORM_REQUEST });
      const url = User.reUploadConsentDocsURL(id);
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: docs,
        url: url
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: REUPLOAD_CONSENTFORM_REQUEST_COMPLETED,
          payload: { data: payload.data, userId: id }
        });
      } else if (response.status === false) {
        dispatch({
          type: REUPLOAD_CONSENTFORM_REQUEST_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export default (state = initialState, action) => {
  const { type, payload, userId = {} } = action;
  switch (type) {
    case CHANGING_PROFILE_PIC_COMPLETED:
      return changeCurrentUserProfilePic(state, payload);
    case SAVING_USER_COMPLETED:
      return {
        ...state,
        [payload.userId]: setUserProfileComPleted(state[payload.userId])
      };
    case SENDING_OTP_COMPLETED:
    case VERIFYING_OTP_COMPLETED:
      return changeContactNo(state, payload);
    case VERIFY_DOCUMENT_REQUEST_COMPLETED:
      return changeDocumentVerificationStatus(state, payload, userId);
    case REUPLOAD_IDPROOF_REQUEST_COMPLETED:
    case REUPLOAD_CONSENTFORM_REQUEST_COMPLETED:
      return updateUserDocuments(state, payload);

    case DISCHARGE_PATIENT_REQUEST_COMPLETED:
      return updateUserStatusToDischarged(state, payload);

    default:
      //
      return setUsersData(state, payload);
  }
};
