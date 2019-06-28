import jwt from "jsonwebtoken";
const userService = require("../../../app/services/user/user.service");
const errMessage = require("../../../config/messages.json").errMessages;
const Response = require("../../../app/helper/responseFormat");

export default async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const secret = process.config.TOKEN_SECRET_KEY;
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      const user = await userService.getUser({
        _id: decodedAccessToken.userId
      });
      if (user) {
        req.userDetails = {
          exists: true,
          userId: decodedAccessToken.userId,
          userData: user._doc
        };
      } else {
      }
    } else {
      const response = new Response(false, 401);
      response.setError({ message: errMessage.COOKIES_NOT_SET });
      return res.status(400).json(response.getResponse());
    }
    next();
  } catch (err) {
    let payload = {};
    if (err.name === "TokenExpiredError") {
      payload = {
        code: 401,
        error: "session expired"
      };
    } else {
      payload = {
        code: 500,
        error: errMessage.INTERNAL_SERVER_ERROR
      };
    }

    let response = new Response(false, payload.code);
    response.setError(payload);
    return res.status(payload.code).json(response.getResponse());
  }
};
