const Member = require("../models/member");
const BookingRequest = require("../models/bookingRequest");
const BookingRequestStatus = require("../models/bookingRequestStatus");
const Log = require("../../libs/log")("member.services");

class MemberService {
  constructor() {}

  // async checkMemberAuthentication(access_token) {
  //   try {
  //     let isAuthenticated = true;
  //     return isAuthenticated;
  //   } catch (err) {
  //     Log.errLog(500, "checkMemberAuthentication", err);
  //   }
  // }

  async addMember(memberData) {
    try {
      let response = await Member.create(memberData);
      return response;
    } catch (err) {
      Log.errLog(500, "addMember", err);
    }
  }

  async getMember(param) {
    try {
      let member = await Member.findOne(param);

      return member;
    } catch (err) {
      Log.errLog(500, "getMember", err);
    }
  }

  async updateMember(id, updateParam) {
    try {
      let member = await Member.findByIdAndUpdate(id, updateParam, {
        new: true
      });
      let updateMemberJSON = member.toJSON();
      delete updateMemberJSON["password"];
      return updateMemberJSON;
    } catch (err) {
      Log.errLog(500, "updateMember", err);
    }
  }

  async getMemberAppointments(memberId) {
    try {
      let approvedStatusId = await BookingRequestStatus.findOne()
        .where("name")
        .equals("Approved");

      let appointments = await BookingRequest.find()
        .where("statusId")
        .equals(approvedStatusId)
        .where("memberId")
        .equals(memberId)
        .populate("providerId")
        .populate("statusId")
        .populate("memberId")
        .populate("cityId")
        .sort({ date: 1, time: 1 });

      return appointments;
    } catch (err) {
      Log.errLog(500, "getMemberAppointments", err);
    }
  }
}

module.exports = new MemberService();
