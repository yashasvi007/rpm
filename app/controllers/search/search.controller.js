const searchService = require("../../services/search/search.service");
const userService = require("../../services/user/user.service");
const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("searchController");

class SearchController {
  constructor() {}
  async doSearch(req, res) {
    try {
      const programIDs = req.userDetails.userData.programId;
      const { query } = req.query;
      const users = await searchService.getUsers(programIDs, query);
      const programList = await searchService.getPrograms(programIDs, query);
      let programs = {};

      for (const value of programList) {
        const patientData = await userService.getAllUser(
          {
            programId: { $in: [value._id] },
            category: "patient"
          },
          "name email category  programId,_id"
        );
        const patients = patientData.map(patient => {
          const {
            basicInfo: { _id }
          } = patient;
          return _id;
        });
        programs = {
          ...programs,
          [value._id]: { ...value, patients: patients }
        };
      }

      let response = new Response(true, 200);
      response.setData({ users, programs });
      response.setMessage("Your Search is done.");
      res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}
module.exports = new SearchController();
