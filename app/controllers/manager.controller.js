const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const managerService = require("../services/manager.services");
const Log = require("../../libs/log")("manager.controller");

class ManagerController {
  async addManager(req, res) {
    try {
      const { firstName, lastName, email, password, cityId } = req.body;
      let salt = await bcrypt.genSalt(process.config.saltRounds);
      let hash = await bcrypt.hash(password, salt);
      let postData = { firstName, lastName, email, password: hash, cityId };
      let response = await managerService.addManager(postData);
      res.send(response);
    } catch (err) {
      res.send({ err: 500, message: "unable to add manager data" });
    }
  }

  async authenticateManager(req, res) {
    try {
      let email = req.body.email;
      let password = req.body.password;
      let managerResponse = await managerService.getManager({
        email
      });
      if (managerResponse) {
        const hashPassword = managerResponse.password;
        const passwordMatch = await bcrypt.compare(password, hashPassword);

        if (passwordMatch) {
          const token = jwt.sign(
            managerResponse.toJSON(),
            process.config.TOKEN_SECRET_KEY,
            {
              expiresIn: process.config.TOKEN_EXPIRE_TIME // expires in 1 day
            }
          );
          const response = {
            accessToken: token
          };
          res.send(response);
        } else {
          res.send({ err: 500, message: "Invalid Email or Password" });
        }
      } else {
        res.send({ err: 500, message: "unable to find manager" });
      }
    } catch (err) {
      res.send({ err: 500, message: "unable to authenticate manager" });
    }
  }

  async getManager(req, res) {
    try {
      let param = req.body.param;
      let manager = await managerService.getManager(param);

      if (!manager.err) {
        res.send(manager);
      } else {
        res.send({ err: 500, message: "unable to fetch manager" });
      }
    } catch (err) {
      res.send({ err: 500, message: "unable to fetch manager" });
    }
  }
}

module.exports = new ManagerController();
