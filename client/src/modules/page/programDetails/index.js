import { FETCHING_CURRENT_PROGRAM_DETAILS_COMPLETED } from "../../program";

const initialState = {};

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case FETCHING_CURRENT_PROGRAM_DETAILS_COMPLETED:
      return { id: payload.programId, isLoading: false };
    default:
      return state;
  }
};
