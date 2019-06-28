import { doRequest } from "../../Helper/network";
import { User } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";
const intialState = {};

export const FETCHING_PROGRAMS_DATA = "FETCHING_PROGRAMS_DATA";
export const FETCHING_PROGRAMS_DATA_COMPLETED =
  "FETCHING_PROGRAMS_DATA_COMPLETED";
export const FETCHING_PROGRAMS_DATA_COMPLETED_WITH_ERROR =
  "FETCHING_PROGRAMS_DATA_COMPLETED_WITH_ERROR";

export const FETCHING_PROGRAM_DOCTORS_DATA = "FETCHING_PROGRAM_DOCTORS_DATA";
export const FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED =
  "FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED";
export const FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED_WITH_ERROR =
  "FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED_WITH_ERROR";

export const FETCHING_PROGRAM_PATIENTS_DATA = "FETCHING_PROGRAM_PATIENTS_DATA";
export const FETCHING_PROGRAM_PATIENTS_DATA_COMPLETED =
  "FETCHING_PROGRAM_PATIENTS_DATA_COMPLETED";
export const FETCHING_PROGRAM_PATIENTS_DATA_COMPLETED_WITH_ERROR =
  "FETCHING_PROGRAM_PATIENTS_DATA_COMPLETED_WITH_ERROR";

export const FETCHING_CURRENT_PROGRAM_DETAILS =
  "ETCHING_CURRENT_PROGRAM_DETAILS";
export const FETCHING_CURRENT_PROGRAM_DETAILS_COMPLETED =
  "FECTCHING_CURRENT_PROGRAM_DETAILS_COMPLETED";
export const FETCHING_CURRENT_PROGRAM_DETAILS_COMPLETED_WITH_ERROR =
  "FETCHING_CURRENT_PROGRAM_DETAILS_COMPLETED_WITH_ERROR";

export const CLEAR_CURRENT_PROGRAM_DETAILS = "CLEAR_CURRENT_PROGRAM_DETAILS";

function setPrograms(state, data) {
  const { programs } = data;
  if (programs) {
    const programIds = Object.keys(programs);
    const prevPrograms = { ...state };
    let newState = Object.assign({}, prevPrograms);
    programIds.forEach(id => {
      newState = Object.assign(
        newState,
        setindividualProgram(prevPrograms, programs, id)
      );
    });
    return newState;
  } else {
    return state;
  }
}

function setindividualProgram(state, programs, id) {
  const program = Object.assign({}, state[id], programs[id]);
  return { [id]: program };
}

// const setProgramDoctors = (state, data) => {
//   const currentState = Object.assign({}, state);
//   const programDoctorsData = Object.assign({}, currentState.programDoctors);
//   const newProgramDoctorsData = Object.assign(programDoctorsData, data);
//   return Object.assign(currentState, {
//     programDoctors: { ...newProgramDoctorsData }
//   });
// };

// const setProgramDoctors = (state, data) => {
//
//
//   const currentState = Object.assign({}, state);
//
//   const usersData = Object.assign({}, currentState.users);
//
//   const newUsersData = Object.assign({}, usersData, data);
//
//   return Object.assign( state, ...newUsersData);
// };

// const setProgramPatients = (state, data) => {
//   const currentState = Object.assign({}, state);
//   const programPatientsData = Object.assign({}, currentState.programPatients);
//   const newProgramPatientsData = Object.assign(programPatientsData, data);
//   return Object.assign(currentState, {
//     programPatients: { ...newProgramPatientsData }
//   });
// };

// const setCurrentProgramData = (state, data) => {
//   const currentState = Object.assign({}, state);
//   const programData = Object.assign({}, currentState.data);
//   const newProgramData = Object.assign(programData, data);
//   return Object.assign(currentState, {
//     basicInfo: { ...newProgramData["info"] },
//     products: { ...newProgramData["products"] }
//   });
// };

// const clearCurrentProgramsData = state => {
//   let newState = Object.assign({}, state);
//   delete newState.basicInfo;
//   delete newState.products;
//   delete newState.programDoctors;
//   delete newState.programPatients;
//   return newState;
// };

export const fetchProgramsData = () => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_PROGRAMS_DATA });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: User.getProgramsURL()
      });
      // ("============================inside the program controleer ==========================", response)
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_PROGRAMS_DATA_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_PROGRAMS_DATA_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
      return status;
    } catch (error) {
      throw error;
      //
    }
  };
};

export const fetchProgramDoctorsForModal = programId => {
  return async dispatch => {
    try {
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: `/program/${programId}/doctor`
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: "itSTEMPORARY",
          payload: { ...payload.data }
        });
      } else if (response.status === false) {
        // dispatch({
        //   type: FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED_WITH_ERROR,
        //   payload: payload.error
        // });
      }
    } catch (error) {
      throw error;
      //
    }
  };
};

//check for payload.data.programDoctorsData
export const fetchProgramDoctors = programId => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_PROGRAM_DOCTORS_DATA });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: User.getProgramDoctorsURL(programId)
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {
      throw error;
      //
    }
  };
};

export const fetchProgramPatient = (programId, filterBy, sortBy, query) => {
  return async dispatch => {
    try {
      let data = {};
      if (filterBy) {
        data = { ...data, filterBy };
      }
      if (sortBy) {
        data = { ...data, sortBy };
      }
      if (query) {
        data = { ...data, ...query };
      }
      dispatch({
        type: FETCHING_PROGRAM_PATIENTS_DATA
      });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: User.getProgramPatientsURL(programId),
        params: data
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_PROGRAM_PATIENTS_DATA_COMPLETED,
          payload: payload.data,
          programId
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_PROGRAM_PATIENTS_DATA_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (err) {
      throw err;
    }
  };
};
export const fetchProgramPatients = programId => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_PROGRAM_PATIENTS_DATA });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: User.getProgramPatientsUrl(programId)
      });
      let { error, payload } = response;
      if (!error) {
        dispatch({
          type: FETCHING_PROGRAM_PATIENTS_DATA_COMPLETED,
          payload: payload.data
        });
      } else {
        dispatch({
          type: FETCHING_PROGRAM_PATIENTS_DATA_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const fetchCurrentProgram = programId => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_CURRENT_PROGRAM_DETAILS });
      let response = await doRequest({
        url: User.getCurrentProgramUrl(programId),
        method: REQUEST_TYPE.GET
      });
      let { status, payload } = response;
      if (status) {
        dispatch({
          type: FETCHING_CURRENT_PROGRAM_DETAILS_COMPLETED,
          payload: { ...payload.data, programId }
        });
      } else {
        dispatch({
          type: FETCHING_CURRENT_PROGRAM_DETAILS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
      return status;
    } catch (error) {}
  };
};

export const clearCurrentPrograms = () => {
  return dispatch => {
    dispatch({ type: CLEAR_CURRENT_PROGRAM_DETAILS });
  };
};

export default (state = intialState, action) => {
  const { type, payload = {} } = action;
  switch (type) {
    case FETCHING_PROGRAMS_DATA_COMPLETED:
      return setPrograms(state, payload);
    case FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED:
      return setPrograms(state, payload);
    case FETCHING_PROGRAM_PATIENTS_DATA_COMPLETED:
      return setPrograms(state, payload);
    case FETCHING_CURRENT_PROGRAM_DETAILS_COMPLETED:
      return setPrograms(state, payload);
    case CLEAR_CURRENT_PROGRAM_DETAILS:
      return state;
    default:
      return setPrograms(state, payload);
  }
};

// export function current_program_data(state = {}, action) {
//   const { type, payload = {} } = action;
//   switch (type) {
//     case FETCHING_CURRENT_PROGRAM_DETAILS:
//       return setPrograms(state, { isloading: true });
//     case FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED:
//       return setPrograms(state, { isloading: false, payload: payload.program });
//     case FETCHING_PROGRAM_DOCTORS_DATA_COMPLETED_WITH_ERROR:
//       return setPrograms(state, { isloading: false, payload: payload });
//   }
// }
