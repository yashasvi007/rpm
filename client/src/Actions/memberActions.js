import axios from "axios";
import {
  FETCH_LOGGED_IN_MEMBER,
  FETCH_LOGGED_IN_MEMBER_FAILED,
  FETCH_LOGGED_IN_MEMBER_SUCCESSFUL,
  UPDATE_MEMBER_CONSENT,
  UPDATE_MEMBER_CONSENT_FAILED,
  UPDATE_MEMBER_CONSENT_SUCCESSFUL,
  FETCH_MEMBER_APPOINTMENTS_SUCCESSFUL,
  FETCH_MEMBER_APPOINTMENTS_FAILED
} from "./types";

// export const validateMember = (username, password) => {
//   return async dispatch => {
//     try {
//       dispatch({
//         type: MEMBER_LOGIN
//       });
//
//       let response = await axios.post("/api/memberLogin", {
//         username,
//         password
//       });
//
//       if (!response.err) {
//         window.location.replace("/home");
//       }
//     } catch (error) {
//
//     }
//   };
// };

export const fetchMember = () => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_LOGGED_IN_MEMBER
      });
      let response = await axios.get("/api/fetchLoggedInMember");
      let loggedInMember = response.data;

      if (!loggedInMember.error) {
        dispatch({
          type: FETCH_LOGGED_IN_MEMBER_SUCCESSFUL,
          payload: loggedInMember
        });
      } else {
        dispatch({ type: FETCH_LOGGED_IN_MEMBER_FAILED });
      }
    } catch (error) {
      dispatch({ type: FETCH_LOGGED_IN_MEMBER_FAILED });
    }
  };
};

export const updateMemberConsent = (id, consent) => {
  return async dispatch => {
    try {
      let response = await axios.post("/api/updateMemberConsent", {
        id,
        consent
      });
      if (!response.error) {
        dispatch({
          type: FETCH_LOGGED_IN_MEMBER_SUCCESSFUL,
          payload: response.data
        });
      } else {
      }
    } catch (err) {}
  };
};

export const getMemberAppointments = memberId => {
  return async dispatch => {
    try {
      let appointments = await axios.get(
        `/api/getMemberAppointments/${memberId}`
      );

      if (!appointments.err) {
        dispatch({
          type: FETCH_MEMBER_APPOINTMENTS_SUCCESSFUL,
          payload: appointments.data
        });
      } else {
        dispatch({
          type: FETCH_MEMBER_APPOINTMENTS_FAILED
        });
      }
    } catch (err) {
      dispatch({
        type: FETCH_MEMBER_APPOINTMENTS_FAILED
      });
    }
  };
};
