import moment from "moment";
import { ENTITY, VALIDITY } from "../../constant";
import UserDpPlaceholder from "../../Assets/images/ico-placeholder-userdp.svg";

export const getProgramData = programs => {
  const programData = [];
  const programIds = Object.keys(programs);
  programIds.forEach(programId => {
    const program = programs[programId] || {};
    let programObj = {};
    const checkIfExpired = moment().diff(program.expiresOn, "years", true);

    const { patients = [] } = program;
    const totalPatients = patients.length;
    programObj.id = program._id;
    programObj.title = program.name;
    programObj.expireOn = program.expireOn;
    programObj.createdAt = program.createdAt;
    programObj.updatedAt = program.updatedAt;
    programObj.products = program.products.length;
    programObj.patients = totalPatients;
    programObj.city = program.targetLocation.city;
    programObj.country = program.targetLocation.country;
    if (checkIfExpired < 0) {
      programObj.Valid = VALIDITY.ACTIVE;
      programData.push(programObj);
    } else {
      programObj.Valid = VALIDITY.EXPIRE;
      programData.push(programObj);
    }
  });
  //
  const data = sortByUpdateAt(programData);

  return data;
};

export const getPatientData = patients => {
  const patientData = [];
  // (patients)
  patients.forEach(patient => {
    const {
      _id,
      name,
      gender,
      dob,
      profilePicLink = UserDpPlaceholder,
      category,
      doctor,
      hospital,
      createdAt
    } = patient;
    const years = dob !== null ? moment().diff(dob, "years", false) : "";
    if (category === ENTITY.PATIENT) {
      patientData.push({
        id: _id,
        title: name,
        age: years,
        gender: gender,
        profilePicLink,
        doctor: doctor,
        hospital: hospital,
        createdAt
      });
    }
  });

  const data = sortByName(patientData);
  //
  return data;
};

export const getDoctorData = doctors => {
  const doctorData = [];

  doctors.forEach(doctor => {
    const {
      _id,
      name,
      profilePicLink = UserDpPlaceholder,
      category,
      hospital = "Burjeel Hospital, Dubai",
      createdAt
    } = doctor;

    if (category === ENTITY.DOCTOR) {
      doctorData.push({
        title: name,
        profilePicLink,
        hospital,
        id: _id,
        createdAt
      });
    }
  });

  //
  const data = sortByName(doctorData);
  return data;
};

export const sortByUpdateAt = data => {
  let dataToBeSorted = [...data];

  dataToBeSorted.sort((a, b) => {
    const updatedAt1 = moment().diff(a.updatedAt, "days", true);
    const updatedAt2 = moment().diff(b.updatedAt, "days", true);
    return updatedAt1 - updatedAt2;
  });
  const sortedData = Object.assign([], dataToBeSorted);
  return sortedData;
};

export const sortByCreatedAt = data => {
  let dataToBeSorted = [...data];

  return dataToBeSorted.sort((a, b) => {
    return moment(a.createdAt).diff(b.createdAt);
  });
};

export const sortByName = data => {
  let dataToBeSorted = [...data];

  dataToBeSorted.sort((a, b) => {
    const Name1 = a.title.toLowerCase();
    const Name2 = b.title.toLowerCase();

    if (Name1 > Name2) {
      return 1;
    }

    if (Name1 < Name2) {
      return -1;
    }

    return 0;
  });
  const sortedData = Object.assign([], dataToBeSorted);
  return sortedData;
};
