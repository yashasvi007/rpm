import {
  USER_CATEGORY,
  USER_STATUS,
  RESOURCE,
  REQUEST_TYPE
} from "../../../constant";

const permissions = {
  [RESOURCE.PROGRAM]: {
    [USER_CATEGORY.DOCTOR]: {
      actions: [REQUEST_TYPE.GET]
    }
  }
};
