const Manager = require("../models/manager");
const Log = require("../../libs/log")("manager.services");

class ManagerServices {
  async addManager(managerData) {
    try {
      let response = await Manager.create(managerData);
      return response;
    } catch (err) {
      Log.errLog(500, "addManager", err);
    }
  }

  async getManager(param) {
    try {
      let manager = await Manager.findOne(param);

      return manager;
    } catch (err) {
      Log.errLog(500, "getManager", err);
    }
  }
}

module.exports = new ManagerServices();
