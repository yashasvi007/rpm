import { createSelector } from "reselect";

const getCountryById = (countryCitiesData, id) => {
  const data = countryCitiesData.countries[id];
  if (data) {
    return data.name;
  }
};

export const makeCountrySelector = () =>
  createSelector(
    getCountryById,
    country => {
      return country;
    }
  );

const getCityByCountry = (countryCitiesData, countryId, cityId) => {
  //
  const { cities = {} } = countryCitiesData;
  const allCities = cities[countryId];

  if (allCities) {
    const city = allCities.cities[cityId];
    if (city) {
      return city.name;
    }
  }
};

export const makeCitySelector = () =>
  createSelector(
    getCityByCountry,
    city => {
      return city;
    }
  );
