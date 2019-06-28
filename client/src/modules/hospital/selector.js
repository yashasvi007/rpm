// import { createSelector } from "reselect";

// const getUser = (userData, id) => {
//   return userData[id];
// };

// const getDoctorHospitals = (userData, id) => {
//   let hospitals = {};
//   ("userData=================",userData)
//   if (userData[id]) {
//     const currentUser = userData[id];
//     const { visitingHospitals = [] } = currentUser;
//     for (let hospital of visitingHospitals) {
//       ("hospital=======selector--------===========",hospital)
//     }
//   }
//   return hospitals;
// };

// export const makeGetUserById = () =>
//   createSelector(
//     [getUser],
//     users => {
//       return users;
//     }
//   );

// export const makeGetDoctorHospitals = () =>
//   createSelector(
//     [getDoctorHospitals],
//     hospitalData => {
//       return hospitalData;
//     }
//   );
