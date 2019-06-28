import axios from "axios";

import {
  GET_PROVIDER_BY_CITY_SPECS,
  GET_PROVIDER_BY_CITY_SPECS_SUCCESSFUL,
  GET_PROVIDER_BY_CITY_SPECS_FAILED,
  FETCH_LOGGED_IN_PROVIDER,
  FETCH_LOGGED_IN_PROVIDER_SUCCESSFUL,
  FETCH_LOGGED_IN_PROVIDER_FAILED,
  FETCH_PROVIDER_APPOINTMENT_HISTORY,
  FETCH_PROVIDER_APPOINTMENT_HISTORY_FAILED,
  FETCH_PROVIDER_APPOINTMENT_HISTORY_SUCCESSFUL
} from "./types";

export const getProviderByCityAndSpecs = (cityId, specId) => {
  return async dispatch => {
    try {
      dispatch({
        type: GET_PROVIDER_BY_CITY_SPECS
      });
      let response = await axios.get(
        `/api/getProviderByCityAndSpecs/${cityId}/${specId}`
      );
      let provider = response.data;
      if (!provider.error) {
        dispatch({
          type: GET_PROVIDER_BY_CITY_SPECS_SUCCESSFUL,
          payload: provider
        });
      } else {
        dispatch({
          type: GET_PROVIDER_BY_CITY_SPECS_FAILED
        });
      }
    } catch (error) {
      dispatch({
        type: GET_PROVIDER_BY_CITY_SPECS_FAILED
      });
    }
  };
};

export const fetchProvider = () => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_LOGGED_IN_PROVIDER
      });
      let response = await axios.get("/api/fetchLoggedInProvider");
      let loggedInProvider = response.data;

      if (!loggedInProvider.error) {
        dispatch({
          type: FETCH_LOGGED_IN_PROVIDER_SUCCESSFUL,
          payload: loggedInProvider
        });
      } else {
        dispatch({ type: FETCH_LOGGED_IN_PROVIDER_FAILED });
      }
    } catch (error) {
      dispatch({ type: FETCH_LOGGED_IN_PROVIDER_FAILED });
    }
  };
};

export const fetchProviderAppointmentHistory = (date, providerId) => {
  return async dispatch => {
    try {
      dispatch({
        type: FETCH_PROVIDER_APPOINTMENT_HISTORY
      });
      let appointmentHistory = await axios.post(
        "/api/getProviderAppointmentHistory",
        { date, providerId }
      );
      "appointment history fetched in action: ", appointmentHistory;
      if (!appointmentHistory.err) {
        dispatch({
          type: FETCH_PROVIDER_APPOINTMENT_HISTORY_SUCCESSFUL,
          payload: appointmentHistory.data
        });
      } else {
        dispatch({
          type: FETCH_PROVIDER_APPOINTMENT_HISTORY_FAILED
        });
      }
    } catch (err) {
      dispatch({ type: FETCH_PROVIDER_APPOINTMENT_HISTORY_FAILED });
    }
  };
};
