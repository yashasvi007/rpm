import axios from "axios";
import {
  GET_ALL_COUNTRIES,
  GET_ALL_COUNTRIES_FAILED,
  GET_ALL_COUNTRIES_SUCCESSFUL
} from "./types";

export const getAllCountries = () => {
  return async dispatch => {
    try {
      dispatch({
        type: GET_ALL_COUNTRIES
      });
      let response = await axios.get("/api/getCountries");
      let countries = response.data;

      if (!countries.error) {
        dispatch({
          type: GET_ALL_COUNTRIES_SUCCESSFUL,
          payload: countries
        });
      } else {
        dispatch({
          type: GET_ALL_COUNTRIES_FAILED
        });
      }
    } catch (error) {
      dispatch({
        type: GET_ALL_COUNTRIES_FAILED
      });
    }
  };
};
