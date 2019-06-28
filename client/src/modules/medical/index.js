import { doRequest } from "../../Helper/network";
import { medicalCondition } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";
import moment from "moment";

const intialState = {};

export const SAVING_BASIC_CONDITION_COMPLETED =
  "SAVING_BASIC_CONDITION_COMPLETED";
const SAVING_BASIC_CONDITION_COMPLETED_WITH_ERROR =
  "SAVING_BASIC_CONDITION_COMPLETED_WITH_ERROR";
export const SAVING_VITAL_COMPLETED = "SAVING_VITAL_COMPLETED";
const SAVING_VITAL_COMPLETED_WITH_ERROR = "SAVING_VITAL_COMPLETED_WITH_ERROR";
export const SAVING_CLINICAL_READING_COMPLETED =
  "SAVING_CLINICAL_READING_COMPLETED";
const SAVING_CLINICAL_READING_COMPLETED_WITH_ERROR =
  "SAVING_CLINICAL_READING_COMPLETED_WITH_ERROR";

function setMedicalsData(state, data) {
  const { medicalsData } = data;
  // ("==medicalsData state=", { ...state, ...medicalsData } )
  if (medicalsData) {
    return { ...state, ...medicalsData };
  } else {
    return state;
  }
}

export const saveBasicConditionData = (
  medicalConditionId,
  data = {},
  userId
) => {
  return async dispatch => {
    try {
      const response = await doRequest({
        data: data,
        url: medicalCondition.getEditBasicConditionURL(medicalConditionId),
        method: REQUEST_TYPE.POST
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: SAVING_BASIC_CONDITION_COMPLETED,
          payload: {
            message: payload.message,
            basicCondition: data,
            userId: userId
          }
        });
      } else if (status === false) {
        dispatch({
          type: SAVING_BASIC_CONDITION_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

export const addVitalData = (medicalConditionId, data = {}, userId) => {
  return async dispatch => {
    try {
      const response = await doRequest({
        data: data,
        url: medicalCondition.getAddVitalURL(medicalConditionId),
        method: REQUEST_TYPE.POST
      });
      //
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: SAVING_VITAL_COMPLETED,
          payload: { message: payload.message, vital: data, userId: userId }
        });
      } else if (status === false) {
        dispatch({
          type: SAVING_VITAL_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

export const UpdateClinicalReadingData = (
  medicalConditionId,
  data = {},
  userId
) => {
  // ("update the users clinicalATA ", medicalConditionId)
  return async dispatch => {
    try {
      const response = await doRequest({
        data: data,
        url: medicalCondition.getUpdateClinicalReadingURL(medicalConditionId),
        method: REQUEST_TYPE.POST
      });
      //
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: SAVING_CLINICAL_READING_COMPLETED,
          payload: {
            message: payload.message,
            clinicalReadings: data,
            userId: userId
          }
        });
      } else if (status === false) {
        dispatch({
          type: SAVING_CLINICAL_READING_COMPLETED_WITH_ERROR,
          payload: "payload.error"
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

export default (state = intialState, action) => {
  const { type, payload = {} } = action;

  switch (type) {
    case SAVING_BASIC_CONDITION_COMPLETED: {
      const { basicCondition, userId } = payload;
      let newState = { ...state };
      newState[userId]["basicCondition"] = basicCondition;
      // ("this is the reducer of the medicals",newState[userId])
      return {
        ...newState
      };
    }
    case SAVING_VITAL_COMPLETED: {
      const { vital, userId } = payload;
      let newState = { ...state };
      newState[userId]["vitals"] = vital;
      // ("this is the reducer of the medicals",newState[userId])
      return {
        ...newState
      };
    }
    case SAVING_CLINICAL_READING_COMPLETED: {
      let { clinicalReadings, userId } = payload;
      const updateAt = moment().format();
      let test = Object.keys(clinicalReadings);
      const testName = test[0];
      let clinicalReading = {};
      clinicalReading.data = clinicalReadings[testName];
      clinicalReading.updatedAt = updateAt;

      let newState = { ...state };

      newState[userId]["clinicalReadings"][testName] = Object.assign(
        {},
        newState[userId]["clinicalReadings"][testName],
        clinicalReading
      );
      // newState[userId]["clinicalReadings"][testName].updatedAt = Object.assign(newState[userId]["clinicalReadings"][testName].updatedAt,updateAt);
      return {
        ...newState
      };
    }

    default:
      return setMedicalsData(state, payload);
  }
};
