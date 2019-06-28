const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const memberService = require("../services/member.services");
const Log = require("../../libs/log")("member.controller");

class MemberController {
  constructor() {}

  async addMember(req, res) {
    try {
      const { firstName, lastName, email, password, phone } = req.body;
      let salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      let hash = await bcrypt.hash(password, salt);
      let postData = { firstName, lastName, email, password: hash, phone };
      let response = await memberService.addMember(postData);
      res.send(response);
    } catch (err) {
      res.send({ error: 500, message: "unable to add member" });
    }
  }

  async authenticateMember(email, password) {
    try {
      //let email = req.body.email;
      //let password = req.body.password;
      let memberResponse = await memberService.getMember({
        email
      });
      if (memberResponse) {
        const hashPassword = memberResponse.password;
        const passwordMatch = await bcrypt.compare(password, hashPassword);

        let memberResponseJson = memberResponse.toJSON();
        delete memberResponseJson["password"];
        if (passwordMatch) {
          const token = jwt.sign(
            memberResponseJson,
            process.config.TOKEN_SECRET_KEY,
            {
              expiresIn: process.config.TOKEN_EXPIRE_TIME // expires in 1 day
            }
          );
          const response = {
            firstName: memberResponseJson.firstName,
            lastName: memberResponseJson.lastName,
            email: memberResponseJson.email,
            hasConsented: memberResponseJson.hasConsented,
            accessToken: token
          };
          return response;
        } else {
          return { err: 500, message: "Invalid Email or Password" };
        }
      } else {
        return { err: 500, message: "unable to find member" };
      }
    } catch (err) {
      return { err: 500, message: "unable to authenticate member" };
    }
  }

  async fetchMemberByAccessToken(req, res) {
    if (req.user) {
      const accessToken = req.user.accessToken;
      if (accessToken) {
        try {
          const decoded = await jwt.verify(
            accessToken,
            process.config.TOKEN_SECRET_KEY
          );

          let memberFetched = await memberService.getMember({
            _id: decoded._id
          });
          let memberFetchedJSON = memberFetched.toJSON();
          delete memberFetchedJSON["password"];

          res.send(memberFetchedJSON);
        } catch (err) {
          res.send({
            err: 403,
            mssg: "The access token is invalid"
          });
        }
      } else {
        res.send({
          err: 403,
          mssg: "The request lacks a valid access token"
        });
      }
    } else {
      res.send({
        err: 401,
        mssg: "The user is not logged in"
      });
    }
  }

  async updateMemberConsent(req, res) {
    try {
      let id = req.body.id;
      let consent = req.body.consent;
      let param = { hasConsented: consent };

      let response = await memberService.updateMember(id, param);
      res.send(response);
    } catch (error) {
      res.send({
        err: 501,
        mssg: "Update member consent failed"
      });
    }
  }

  async fetchMemberAppointments(req, res) {
    try {
      let memberId = req.params.memberId;
      let appointments = await memberService.getMemberAppointments(memberId);
      res.send(appointments);
    } catch (err) {
      res.send({
        err: 501,
        mssg: "Failed to fetch member appointments"
      });
    }
  }

  // async checkMemberAuthentication(req, res) {
  //   try {
  //     let access_token = req.params.access_token;
  //     let isAuthenticated = memberService.checkMemberAuthentication(
  //       access_token
  //     );
  //
  //     res.send({ isAuthenticated });
  //   } catch (err) {
  //
  //     res.send({ error: 500, message: "unable to authenticate member" });
  //   }
  // }
}

module.exports = new MemberController();
