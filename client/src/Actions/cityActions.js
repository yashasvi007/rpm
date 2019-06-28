import axios from "axios";
import {
  GET_ALL_CITIES,
  GET_ALL_CITIES_SUCCESSFUL,
  GET_ALL_CITIES_FAILED,
  GET_CITIES_BY_COUNTRY,
  GET_CITIES_BY_COUNTRY_SUCCESSFUL,
  GET_CITIES_BY_COUNTRY_FAILED
} from "./types";

export const getAllCities = () => {
  return async dispatch => {
    try {
      dispatch({
        type: GET_ALL_CITIES
      });
      let response = await axios.get("/api/getCities");
      const cities = await response.data;

      if (!cities.error) {
        dispatch({
          type: GET_ALL_CITIES_SUCCESSFUL,
          payload: cities
        });
      } else {
        dispatch({
          type: GET_ALL_CITIES_FAILED
        });
      }
    } catch (error) {
      dispatch({
        type: GET_ALL_CITIES_FAILED
      });
    }
  };
};

export const getCitiesByCountry = id => {
  return async dispatch => {
    try {
      dispatch({
        type: GET_CITIES_BY_COUNTRY
      });
      let response = await axios.get(`/api/getCitiesByCountry/${id}`);
      let cities = response.data;

      if (!cities.error) {
        dispatch({
          type: GET_CITIES_BY_COUNTRY_SUCCESSFUL,
          payload: cities
        });
      } else {
        dispatch({
          type: GET_CITIES_BY_COUNTRY_FAILED
        });
      }
    } catch (err) {
      dispatch({
        type: GET_CITIES_BY_COUNTRY_FAILED
      });
    }
  };
};
