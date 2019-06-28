import { doRequest } from "../../Helper/network";
import { User } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";

const FETCHING_INSURANCE_PROVIDERS_DATA = "FETCHING_INSURANCE_PROVIDERS_DATA";
const FETCHING_INSURANCE_PROVIDERS_DATA_COMPLETED =
  "FETCHING_INSURANCE_PROVIDERS_DATA_COMPLETED";
const FETCHING_INSURANCE_PROVIDERS_DATA_COMPLETED_WITH_ERROR =
  "FETCHING_INSURANCE_PROVIDERS_DATA_COMPLETED_WITH_ERROR";

const intialState = {};

function setInsuranceData(state, data) {
  const { insuranceProviders } = data;
  if (insuranceProviders) {
    return { ...state, ...insuranceProviders };
  } else {
    return state;
  }
}

export const fetchInsuranceData = () => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_INSURANCE_PROVIDERS_DATA });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: User.getInsuranceProvidersURL()
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_INSURANCE_PROVIDERS_DATA_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_INSURANCE_PROVIDERS_DATA_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export default (state = intialState, action) => {
  const { type, payload = {} } = action;

  switch (type) {
    case FETCHING_INSURANCE_PROVIDERS_DATA_COMPLETED: {
      return setInsuranceData(state, payload);
    }
    default:
      return setInsuranceData(state, payload);
  }
};
