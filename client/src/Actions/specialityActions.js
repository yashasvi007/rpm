import axios from "axios";

import {
  GET_SPECIALITY,
  GET_SPECIALITY_SUCCESSFUL,
  GET_SPECIALITY_FAILED
} from "./types";

export const getAllSpeciality = () => {
  return async dispatch => {
    try {
      dispatch({
        type: GET_SPECIALITY
      });
      let response = await axios.get("/api/getAllSpecialities");
      let specs = response.data;
      if (!specs.error) {
        dispatch({
          type: GET_SPECIALITY_SUCCESSFUL,
          payload: specs
        });
      } else {
        dispatch({
          type: GET_SPECIALITY_FAILED
        });
      }
    } catch (err) {
      dispatch({
        type: GET_SPECIALITY_FAILED
      });
    }
  };
};
