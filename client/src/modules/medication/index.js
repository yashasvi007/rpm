import { doRequest } from "../../Helper/network";
import { medication } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";
const intialState = {};

const SAVING_MEDICATION_COMPLETED = "SAVING_MEDICATION_COMPLETED";
const SAVING_MEDICATION_COMPLETED_WITH_ERROR =
  "SAVING_MEDICATION_COMPLETED_WITH_ERROR";

const DELETING_MEDICATION_COMPLETED = "DELETING_MEDICATION_COMPLETED";
const DELETING_MEDICATION_COMPLETED_WITH_ERROR =
  "DELETING_MEDICATION_COMPLETED_WITH_ERROR";

const GETTING_RECENT_MEDICATION_COMPLETED =
  "GETTING_RECENT_MEDICATION_COMPLETED";
const GETTING_RECENT_MEDICATION_COMPLETED_WITH_ERROR =
  "GETTING_RECENT_MEDICATION_COMPLETED_WITH_ERROR";

function setMedication(state, data) {
  const { medication } = data;
  if (medication) {
    return { ...state, ...medication };
  } else {
    return state;
  }
}

export const getRecentMedication = id => {
  return async dispatch => {
    try {
      const response = await doRequest({
        url: medication.getRecentMedicationURL(id),
        method: REQUEST_TYPE.GET
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: GETTING_RECENT_MEDICATION_COMPLETED,
          payload: payload.data
        });
      } else if (status === false) {
        dispatch({
          type: GETTING_RECENT_MEDICATION_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

export const addMedication = (data = {}, userId) => {
  return async dispatch => {
    try {
      const response = await doRequest({
        data: { value: data, userId: userId },
        url: medication.getAddMedicationURL(),
        method: REQUEST_TYPE.POST
      });

      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: SAVING_MEDICATION_COMPLETED,
          payload: {
            message: payload.message,
            medication: payload.data,
            userId: userId
          }
        });
      } else if (status === false) {
        dispatch({
          type: SAVING_MEDICATION_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

export const removeMedication = (productId = {}, userId) => {
  return async dispatch => {
    try {
      const response = await doRequest({
        data: { productId, userId },
        url: medication.getAddMedicationURL(),
        method: REQUEST_TYPE.DELETE
      });

      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: DELETING_MEDICATION_COMPLETED,
          payload: {
            message: payload.message,
            productId: productId,
            userId: userId
          }
        });
      } else if (status === false) {
        dispatch({
          type: DELETING_MEDICATION_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  };
};

export default (state = intialState, action) => {
  const { type, payload = {} } = action;
  // const {medication} = payload
  switch (type) {
    case SAVING_MEDICATION_COMPLETED: {
      const { medication, userId } = payload;
      let newState = { ...state };
      if (newState[userId].medicine) {
        newState[userId].medicine = Object.assign(
          newState[userId].medicine,
          medication.medication.medicine
        );
      } else {
        newState[userId].medicine = [medication];
      }

      return {
        ...newState
      };
    }
    case DELETING_MEDICATION_COMPLETED: {
      const { productId, userId } = payload;
      let newState = { ...state };
      delete newState[userId].medicine[productId];
      return {
        ...newState
      };
    }

    default:
      return setMedication(state, payload);
  }
};
