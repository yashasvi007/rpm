const City = require("../models/city");
const Log = require("../../libs/log")("city.services");

class CityServices {
  constructor() {}

  async getCities(param = {}) {
    try {
      let result = await City.find(param).populate("countryId");
      return result;
    } catch (err) {
      Log.errLog(500, "getCities", err);
    }
  }

  async getCitiesByCountry(countryId) {
    try {
      let result = await City.find({ countryId });
      return result;
    } catch (err) {
      Log.errLog(500, "getCitiesByCountry", err);
    }
  }

  async addCity(cityData) {
    try {
      let response = await City.create(cityData);
      return response;
    } catch (err) {}
  }
}

module.exports = new CityServices();
