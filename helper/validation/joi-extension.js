import Joi from "joi";
import { ObjectID } from "mongodb";

export const isMongoId = Joi.extend(joi => ({
  name: "mongoId",
  language: {
    pre: "needs to be a string of 12 bytes or a string of 24 hex characters"
  },
  pre(value, state, options) {
    if (ObjectID.isValid(value)) {
      return ObjectID(value);
    }
    return this.createError("objectId.pre", { v: value }, state, options);
  }
}));
