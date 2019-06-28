import Joi from "joi";
const Response = require("../../../app/helper/responseFormat");

const BasicConditionFormSchema = Joi.object().keys({
  allergies: Joi.string()
    .optional()
    .allow(""),
  chiefComplaint: Joi.string()
    .optional()
    .allow(""),
  others: Joi.string()
    .optional()
    .allow(""),
  surgeriesOrFracture: Joi.string()
    .optional()
    .allow("")
});

const VitalFormSchema = Joi.object().keys({
  bloodPressure: Joi.string().allow(""),
  pulse: Joi.number().integer(),
  respirationRate: Joi.number().integer(),
  temperature: Joi.number().integer(),
  temperatureUnit: Joi.string(),
  updatedAt: Joi.date()
});

// const ClincalReadingFormSchema = Joi.object().keys({

// })

export const validateBasicConditionFormData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = Joi.validate(data, BasicConditionFormSchema);
  if (isValid && isValid.error != null) {
    let response = new Response(false, 422);
    response.setError(isValid.error);
    return res.status(422).json(response.getResponse());
  }
  next();
};

export const validateVitalFormData = (req, res, next) => {
  const { body: data = {} } = req;
  const isValid = Joi.validate(data, VitalFormSchema);
  if (isValid && isValid.error != null) {
    let response = new Response(false, 422);
    response.setError(isValid.error);
    return res.status(422).json(response.getResponse());
  }
  next();
};
