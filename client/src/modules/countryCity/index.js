import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";

const GETTING_COUNTRIES = "getting_countries";
const GETTING_CITIES_BY_COUNTRY = "getting_cities_by_countries";
const GET_COUNTRIES_COMPLETED = "get_countries_completed";
const GET_CITIES_BY_COUNTRY_COMPLETED = "get_cities_by_countries_completed";

//const api
const GET_CITIES = "/getCitiesByCountry/";
const GET_COUNTRIES = "/getCountries";

export const getCountries = () => {
  return async dispatch => {
    try {
      dispatch({ type: GETTING_COUNTRIES });
      const response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: GET_COUNTRIES
      });
      const { status, payload } = response;
      if (status) {
        dispatch({
          type: GET_COUNTRIES_COMPLETED,
          payload: {
            countryList: payload.data.country
          }
        });
      }
    } catch (error) {
      throw error;
    }
  };
};

export const getCities = country => {
  return async dispatch => {
    try {
      dispatch({ type: GETTING_CITIES_BY_COUNTRY });
      const response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: GET_CITIES + country
      });
      const { status, payload } = response;
      if (status) {
        dispatch({
          type: GET_CITIES_BY_COUNTRY_COMPLETED,
          payload: {
            [country]: { cities: payload.data.cities }
          }
        });
      }
    } catch (error) {
      throw error;
    }
  };
};

const addCities = (data, state) => {
  const currentState = Object.assign({}, state);
  const countriesData = Object.assign({}, currentState.cities);
  const newCountriesData = Object.assign(countriesData, data);
  return Object.assign(
    currentState,
    { cities: { ...newCountriesData } },
    { isLoading: false }
  );
};

const intialState = {
  countries: {},
  cities: {},
  isLoading: false
};

function setCountryCitiesData(state, incomingData = {}) {
  const { countryCities } = incomingData;
  if (countryCities) {
    //Data comes in countriesList instead of countries
    const { countries: newList = {}, cities: newData = {} } = countryCities;
    const { countries: prevList = {}, cities: prevData = {} } = state;
    //

    // let citiesData = {};

    // for (let id in newList) {
    //   if (newList[id]) {
    //     citiesData = Object.assign(citiesData, {
    //       [id]: {
    //         cities: { [newL[id]]: newData[newL[id]] }
    //       }
    //     });
    //   }
    // }

    const newState = {
      countries: { ...prevList, ...newList },
      cities: { ...prevData, ...newData }
    };
    //
    //
    return newState;
  } else {
    return state;
  }
}
// const intialState = {};

export default (state = intialState, action) => {
  switch (action.type) {
    case GETTING_COUNTRIES:
      return { ...state, isLoading: true };
    case GET_COUNTRIES_COMPLETED:
      return {
        ...state,
        isLoading: false,
        countries: action.payload.countryList
      };
    case GETTING_CITIES_BY_COUNTRY:
      return { ...state, isLoading: true };
    case GET_CITIES_BY_COUNTRY_COMPLETED:
      return addCities(action.payload, state);
    default:
      return setCountryCitiesData(state, action.payload);
  }
};
