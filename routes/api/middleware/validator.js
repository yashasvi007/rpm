const errMessage = require("../../../config/messages.json").errMessages;
const Response = require("../../../app/helper/responseFormat");
const rbac = require("./rbac");

export default async (req, res, next, permission, resource) => {
  try {
    const category = req.userDetails.userData.category;
    const can = await rbac.can(category, permission, resource);
    if (can) {
      next();
    } else {
      const response = new Response(false, 403);
      response.setError({ error: "Page not accessible" });
      return res.status(403).json(response.getResponse());
    }
  } catch (err) {
    const response = new Response(false, payload.code);
    response.setError(payload);
    return res.status(payload.code).json(response.getResponse());
  }
};
