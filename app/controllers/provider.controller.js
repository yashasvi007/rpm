const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const providerService = require("../services/provider.services");
const bookingRequestStatusService = require("../services/bookingRequestStatus.services");
const Log = require("../../libs/log")("provider.controller");

class ProviderController {
  async addProvider(req, res) {
    try {
      let postData = req.body;
      let salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      let hash = await bcrypt.hash(postData.password, salt);
      postData.password = hash;
      let response = await providerService.addProvider(postData);
      res.send(response);
    } catch (err) {
      res.send({ err: 500, message: "unable to add provider data" });
    }
  }

  async authenticateProvider(email, password) {
    try {
      //let email = req.body.email;
      //let password = req.body.password;
      let providerResponse = await providerService.getProvider({
        email
      });
      if (providerResponse) {
        const hashPassword = providerResponse.password;
        const passwordMatch = await bcrypt.compare(password, hashPassword);

        let providerResponseJson = providerResponse.toJSON();
        delete providerResponseJson["password"];
        if (passwordMatch) {
          const token = jwt.sign(
            providerResponseJson,
            process.config.TOKEN_SECRET_KEY,
            {
              expiresIn: process.config.TOKEN_EXPIRE_TIME // expires in 1 day
            }
          );
          const response = {
            firstName: providerResponseJson.firstName,
            lastName: providerResponseJson.lastName,
            email: providerResponseJson.email,
            accessToken: token
          };
          return response;
        } else {
          return { err: 500, message: "Invalid Email or Password" };
        }
      } else {
        return { err: 500, message: "unable to find provider" };
      }
    } catch (err) {
      return { err: 500, message: "unable to authenticate provider" };
    }
  }

  async getProviders(req, res) {
    try {
      let response = await providerService.getAllProviders();

      res.send(response);
    } catch (err) {
      res.send({ err: 500, message: "unable to fetch providers" });
    }
  }

  async getProvidersByCityAndSpecs(req, res) {
    try {
      let response = await providerService.getProvidersByCityAndSpecs(
        req.params.cityid,
        req.params.specid
      );
      res.send(response);
    } catch (err) {
      res.send({ err: 500, message: "unable to fetch providers" });
    }
  }

  async getProviderAppointmentHistory(req, res) {
    try {
      let date = req.body.date;
      let providerId = req.body.providerId;
      let statuses = await bookingRequestStatusService.getBookingRequestStatusForProviderAppointmentHistory();
      let statusIds = statuses.map(status => status._id);
      let params = {
        date,
        providerId,
        statusIds
      };
      let appointments = await providerService.getProviderAppointmentHistory(
        params
      );
      res.send(appointments);
    } catch (err) {
      res.send({ err: 500, message: "unable to fetch providers" });
    }
  }

  async fetchProviderByAccessToken(req, res) {
    if (req.user) {
      const accessToken = req.user.accessToken;
      if (accessToken) {
        try {
          const decoded = await jwt.verify(
            accessToken,
            process.config.TOKEN_SECRET_KEY
          );

          let providerFetched = await providerService.getProvider({
            _id: decoded._id
          });
          let providerFetchedJSON = providerFetched.toJSON();
          delete providerFetchedJSON["password"];

          res.send(providerFetchedJSON);
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
}

module.exports = new ProviderController();
