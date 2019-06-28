import { createSelector } from "reselect";

const getMedicalData = (medicalData, id) => {
  // ("=========id =======", id,     medicalData)
  return medicalData[id];
};

export const makeGetMedicalDataOfUser = () =>
  createSelector(
    [getMedicalData],
    data => {
      return data;
    }
  );
