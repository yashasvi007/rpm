import Joi from "joi";
const Response = require("../../../app/helper/responseFormat");

const MedicationFormSchema = Joi.object().keys({
  product_id: Joi.string().required(),
  often: Joi.string().required(),
  upto: Joi.date().required()
});

const userIdSchema = Joi.object().keys({
  userId: Joi.string().required()
});

export const validateMedicationFormData = (req, res, next) => {
  const { body: data = {} } = req;
  const { userId = "", value = {} } = data;
  const isDataValid = Joi.validate(value, MedicationFormSchema);
  const isUserIdValid = Joi.validate(userId, userIdSchema);
  if (
    isDataValid &&
    isUserIdValid &&
    isUserIdValid.error != null &&
    isDataValid.error != null
  ) {
    let response = new Response(false, 422);
    response.setError(isUserIdValid.error || isDataValid.error);
    return res.status(422).json(response.getResponse());
  }
  next();
};
