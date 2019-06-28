const Country = require("../models/country");
const City = require("../models/city");

class CountryServices {
  constructor() {}

  async getCountries() {
    try {
      let result = await Country.find();
      return result;
    } catch (err) {}
  }

  async getCountryByCity(cityId) {
    try {
      let city = await City.findById(cityId);

      let country = await Country.findById(city.countryId);
      return country;
    } catch (err) {}
  }

  async addCountry(req) {
    try {
      let response = await Country.create(req.body);

      return response;
    } catch (err) {}
  }
}

module.exports = new CountryServices();
