import { createSelector } from "reselect";

const getPatientProgram = (users, userId, programs) => {
  if (!userId) {
    return {};
  }
  let program = {};
  const userData = users[userId];
  if (userData) {
    const { programIds = [] } = userData;
    if (programIds.length > 0) {
      program = programs[programIds[0].id];
    }
  }
  return program;
};

export const makeGetPatientProgramProduct = () =>
  createSelector(
    [getPatientProgram],
    programs => {
      const { products = [] } = programs;
      return products;
    }
  );
