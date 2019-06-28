const userModel = require("../../models/user");
const path = require("path");
const ObjectId = require("mongodb").ObjectID;
import { formatUserData } from "./helper";
import { constant } from "async";

const NAME = "Name";
const ALL = "All";
const ENROLLED = "Enrolled";
const INACTIVE = "Inactive";
const DISCHARGED = "Discharged";

class UserService {
  constructor() {}
  async addUser(data) {
    try {
      let user = await userModel.create(data);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getUser(data) {
    try {
      const user = await userModel.findOne(data);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getUserById(id) {
    try {
      const user = await userModel.findOne({ _id: id }, { password: 0 });
      return formatUserData(user);
    } catch (err) {
      throw err;
    }
  }

  async updateUser(searchField, updateField) {
    try {
      let user = await userModel.update(searchField, { $set: updateField });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async addConsentForm(userID, consentForm) {
    try {
      let user = await userModel.update(
        { _id: userID },
        {
          $set: {
            isConsentFormUploaded: true
          },
          $push: {
            "documents.consentForm": { file: consentForm }
          }
        }
      );
      return user;
    } catch (err) {
      throw err;
    }
  }

  async addIdProof(userID, idProof) {
    try {
      let user = await userModel.update(
        { _id: userID },
        {
          $set: {
            isIdProofUploaded: true
          },
          $push: {
            "documents.idProof": { file: idProof }
          }
        }
      );
      return user;
    } catch (err) {
      throw err;
    }
  }

  async addtoArray(searchField, updateField, updateData) {
    try {
      let result = await userModel.update(searchField, {
        $push: { [updateField]: { $each: updateData } }
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async bulkUpdateUsers(updateQueries) {
    try {
      let user = await userModel.bulkWrite(updateQueries);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getAllUser(
    data,
    selectVal = false,
    filter = false,
    { q, status } = {}
  ) {
    try {
      let users = {};
      let query = {};
      if (status) {
        if (status.startsWith("!")) {
          query = { status: { $not: { $eq: status.slice(1) } } };
        }
      }
      const { programId, category } = data;
      let nameQuery = {};
      if (q) {
        nameQuery = { name: { $regex: `^.*${q}.*`, $options: "$i" } };
      }
      const queryData = {
        ...data,
        ...nameQuery,
        ...query
      };
      if (!filter.filterBy || filter.filterBy === "" || !filter) {
        users = selectVal
          ? await userModel
              .find(queryData)
              .select(selectVal)
              .lean()
          : await userModel.find(queryData).lean();
      } else {
        const { filterBy, sortBy } = filter;
        switch (filterBy) {
          case ALL: {
            //if (sortBy === NAME) {
            users = await userModel.find(queryData).sort({
              [sortBy]: 1
            });
            //}
            break;
          }

          case ENROLLED: {
            //if (sortBy === NAME) {
            users = await userModel
              .find({
                category: "patient",
                programId: programId,
                status: "ENROLLED",
                name: { $regex: `^.*${q}.*`, $options: "$i" }
              })
              .sort({
                [sortBy]: 1
              });
            // console.log("=====users=====>", users)
            //}
            break;
          }

          case INACTIVE: {
            //if (sortBy === NAME) {
            users = await userModel
              .find({
                category: "patient",
                programId: programId,
                status: "INACTIVE",
                name: { $regex: `^.*${q}.*`, $options: "$i" }
              })
              .sort({
                [sortBy]: 1
              });
            // console.log("=====users=====>", users)
            //}
            break;
          }

          case DISCHARGED: {
            //if (sortBy === NAME) {
            users = await userModel
              .find({
                category: "patient",
                programId: programId,
                status: "DISCHARGED",
                name: { $regex: `^.*${q}.*`, $options: "$i" }
              })
              .sort({
                [sortBy]: 1
              });
            // console.log("=====users=====>", users)
            //}
            break;
          }

          default:
            users = selectVal
              ? await userModel
                  .find(queryData)
                  .select(selectVal)
                  .lean()
              : await userModel.find(queryData).lean();
            break;
        }
      }
      // console.log("filter--------------",users, "----------")
      return users.map(value => formatUserData(value));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getDoctorDataforBatch(doctorIds) {
    try {
      const doctorsdata = await userModel.find({ _id: { $in: doctorIds } });

      return doctorsdata;
    } catch (err) {
      throw err;
    }
  }

  async getBasicInfo(
    id,
    fields = ["_id", "profilePicLink", "name", "category"]
  ) {
    try {
      if (id === undefined || id == null) return;
      let user = await this.getUser({ _id: id });
      let basicInfo = {};

      for (let field in fields) {
        basicInfo = Object.assign(basicInfo, {
          [fields[field]]: user[fields[field]]
        });
      }

      if (basicInfo.profilePicLink) {
        basicInfo.profilePicLink =
          "http://" +
          path.join(process.config.IMAGE_HOST, basicInfo.profilePicLink);
      }

      return basicInfo;
    } catch (err) {
      throw err;
    }
  }

  async getMedicalCondition(id) {
    try {
      let user = await this.getUser({ _id: id });
      return user.medicalCondition ? user.medicalCondition : {};
    } catch (err) {
      throw err;
    }
  }

  async getClinicalReadings(id) {
    try {
      let user = await this.getUser({ _id: id });
      return user.clinicalReadings ? user.clinicalReadings : {};
    } catch (err) {
      throw err;
    }
  }

  async getWork(id) {
    try {
      let user = await this.getUser({ _id: id });
      return user.work ? user.work : {};
    } catch (err) {
      throw err;
    }
  }

  async getVisitingHospitals(id) {
    try {
      let user = await this.getUser({ _id: id });
      return user.visitingHospitals ? user.visitingHospitals : {};
    } catch (err) {
      throw err;
    }
  }

  async getBulkUsers(ids) {
    try {
      const users = await userModel.find({ _id: { $in: ids } });
      return users.map(value => formatUserData(value));
    } catch (err) {
      throw err;
    }
  }

  async getRelatedMembers({ programIds, category = ["doctor", "patient"] }) {
    try {
      const programIdObjectsArr = programIds.map(id => ObjectId(id));
      const users = await userModel.find({
        programId: { $in: programIdObjectsArr },
        isProfileCompleted: true,
        category: { $in: category }
      });
      return users.map(value => formatUserData(value));
    } catch (err) {
      throw err;
    }
  }

  async updateStatus(searchField, updateData) {
    try {
      const { ids, category } = searchField;
      const patientIds = ids.map(id => ObjectId(id));
      const result = await userModel.updateMany(
        { _id: { $in: patientIds }, category: category },
        updateData
      );
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new UserService();
