const programKeyValueModel = require("../../models/programKeyValue");

class ProgramKeyValueService {
  //params program_Id = _id of program
  async getTest(program_Id) {
    try {
      // ("----------programId in progkeyval---------", program_Id)
      const response = await programKeyValueModel.find({
        programId: program_Id
      });
      // ("-==-=-==-=-=-reponse-=-=-=-=-=-=-=",response )
      return response === null ? [] : response;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ProgramKeyValueService();
