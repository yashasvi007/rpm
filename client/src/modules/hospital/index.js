import { doRequest } from "../../Helper/network";
import { User } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";
const intialState = {};

const FETCHING_DOCTOR_HOSPITALS_DATA = "FETCHING_DOCTOR_HOSPITALS_DATA";
const FETCHING_DOCTOR_HOSPITALS_DATA_COMPLETED =
  "FETCHING_DOCTOR_HOSPITALS_DATA_COMPLETED";
const FETCHING_DOCTOR_HOSPITALS_DATA_COMPLETED_WITH_ERROR =
  "FETCHING_DOCTOR_HOSPITALS_DATA_COMPLETED_WITH_ERROR";

const FETCHING_HOSPITALS_DATA = "FETCHING_HOSPITALS_DATA";
const FETCHING_HOSPITALS_DATA_COMPLETED = "FETCHING_HOSPITALS_DATA_COMPLETED";
const FETCHING_HOSPITALS_DATA_COMPLETED_WITH_ERROR =
  "FETCHING_HOSPITALS_DATA_COMPLETED_WITH_ERROR";

const setDoctorHospitals = (state, data) => {
  const currentState = Object.assign({}, state);
  const doctorHospitalsData = Object.assign({}, currentState.hospitalData);
  const newDoctorHospitalsData = Object.assign(doctorHospitalsData, data);
  return Object.assign(currentState, { ...newDoctorHospitalsData });
};

const setHospitals = (state, data) => {
  const newHospitalsData = Object.assign({}, data);
  return Object.assign({}, state, { ...newHospitalsData });
};

const setIntialHospitalData = (state, data = {}) => {
  const { hospitals } = data;
  if (hospitals) {
    const prevHospital = state;
    const updatedHospital = { ...prevHospital, ...hospitals };
    return updatedHospital;
  } else return state;
};

export const fetchDoctorHospitals = doctorId => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_DOCTOR_HOSPITALS_DATA });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: User.getDoctorHospitalsURL(doctorId)
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_DOCTOR_HOSPITALS_DATA_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_DOCTOR_HOSPITALS_DATA_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const fetchHospitals = (countryId, cityId) => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_HOSPITALS_DATA });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: User.getHospitalsURL(),
        params: { countryId: countryId, cityId: cityId }
      });

      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: FETCHING_HOSPITALS_DATA_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_HOSPITALS_DATA_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export default (state = intialState, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case FETCHING_DOCTOR_HOSPITALS_DATA_COMPLETED: {
      return setDoctorHospitals(state, payload);
    }
    case FETCHING_HOSPITALS_DATA_COMPLETED: {
      return setHospitals(state, payload);
    }
    default:
      return setIntialHospitalData(state, payload);
  }
};
