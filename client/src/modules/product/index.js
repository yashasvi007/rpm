// import { doRequest } from "../../Helper/network";
// import { User } from "../../Helper/urls";
// import { REQUEST_TYPE } from "../../constant";
const intialState = {};

// const FETCHING_PRODUCTS_DATA = "FETCHING_PRODUCTS_DATA";
// const FETCHING_PRODUCTS_DATA_COMPLETED = "FETCHING_PRODUCTS_DATA_COMPLETED";
// const FETCHING_PRODUCTS_DATA_COMPLETED_WITH_ERROR =
//   "FETCHING_PRODUCTS_DATA_COMPLETED_WITH_ERROR";

// const FETCHING_PROGRAM_DOCTORS_DATA = "FETCHING_PROGRAM_DOCTORS_DATA";
// const FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED =
//   "FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED";
// const FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED_WITH_ERROR =
//   "FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED_WITH_ERROR";

// const TOGGLE_ADD_DOCTOR = "TOGGLE_ADD_DOCTOR";
// const TOGGLE_ADD_PATIENT = "TOGGLE_ADD_PATIENT";

function setProducts(state, data) {
  const { products } = data;
  if (products) {
    // const currentState = Object.assign([], state);
    // const newState = Object.assign([], currentState, products);

    return { ...state, ...products };
  } else {
    return state;
  }
}

export default (state = intialState, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    default:
      return setProducts(state, payload);
  }
};
