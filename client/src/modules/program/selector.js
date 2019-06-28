import { createSelector } from "reselect";
import isEmpty from "lodash-es/isEmpty";
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

const getUserPrograms = programData => {
  if (isEmpty(programData)) return {};
  let programs = {};
  Object.keys(programData).forEach(key => {
    let value = programData[key];

    if (
      ["basicInfo", "products", "programDoctors", "programPatients"].indexOf(
        key
      ) === -1
    ) {
      programs[key] = value;
    }
  });
  return programs;
};

const getProgramById = (programData, programId) => {
  if (isEmpty(programData)) return {};
  const program = programData[programId];
  if (program) return program;
  else return {};
};

const getProgramProducts = (programData, programId, productsData) => {
  if (isEmpty(programData)) return [];
  const program = programData[programId];
  if (program) {
    const { products } = program;
    return products.map(value => {
      return productsData[value];
    });
  } else return [];
};

const getProgramPatients = (programData, programId, users) => {
  if (isEmpty(programData)) return {};
  const program = programData[programId];
  if (program) {
    let patientList = [];
    const { patients = [] } = program;
    patients.forEach(value => {
      const patient = users[value];
      if (patient) patientList.push(patient);
    });
    return patientList;
  } else return [];
};

const getProgramDoctors = (programData, programId, users) => {
  if (isEmpty(programData)) return [];
  const program = programData[programId];
  if (program) {
    const { doctors = [] } = program;
    let doctorList = [];
    doctors.forEach(value => {
      const { _id } = value;
      if (_id) {
        const doctor = users[_id];
        if (doctor) doctorList.push(doctor);
      }
    });
    return doctorList;
  } else return [];
};

export const makeGetPatientProgramProduct = () =>
  createSelector(
    [getPatientProgram],
    programs => {
      const { products = [] } = programs;
      return products;
    }
  );

export const makeGetUserPrograms = () =>
  createSelector(
    [getUserPrograms],
    programs => {
      return programs;
    }
  );

export const makeGetProgramsById = () => {
  return createSelector(
    [getProgramById],
    program => {
      return program;
    }
  );
};

export const makeGetProgramProducts = () => {
  return createSelector(
    [getProgramProducts],
    products => {
      return products;
    }
  );
};

export const makeGetProgramDoctors = () => {
  return createSelector(
    [getProgramDoctors],
    doctors => {
      return doctors;
    }
  );
};

export const makeGetProgramPatients = () => {
  return createSelector(
    [getProgramPatients],
    patients => {
      return patients;
    }
  );
};
