import moment from "moment";
import UserDpPlaceholder from "../../../Assets/images/ico-placeholder-userdp.svg";
import { VALIDITY, ENTITY } from "../../../constant";

export const getProgramChildren = programs => {
  let programChildred = [];
  let programIds = Object.keys(programs);
  programIds.forEach(id => {
    // if (count > 4) {
    //   return (programChildred);
    // }
    const program = programs[id] || {};
    let obj = {};
    obj.id = program._id;
    const checkIfExpired = moment().diff(program.expiresOn, "years", true);
    if (checkIfExpired < 0) {
      obj.title = program.name;
      obj.validity = VALIDITY.ACTIVE;
      programChildred.push(obj);
    } else {
      obj.title = program.name;
      obj.validity = VALIDITY.EXPIRE;
      programChildred.push(obj);
    }
  });

  //
  //
  return programChildred;
};

export const getPatientChildren = patients => {
  let patientChildred = [];
  patients.forEach(patient => {
    const {
      _id,
      name,
      gender,
      dob,
      homeAddress = {},
      profilePicLink = UserDpPlaceholder,
      category,
      city,
      disease,
      country
    } = patient;
    const years = moment().diff(dob, "years", false);
    if (category === ENTITY.PATIENT) {
      patientChildred.push({
        id: _id,
        title: name,
        age: years,
        gender: gender,
        disease: disease,
        addressLine1: homeAddress.addressLine2,
        city: city,
        country: country,
        profilePicLink: profilePicLink
      });
    }
  });

  return patientChildred;
};

export const getDoctorChildren = doctors => {
  const doctorChildred = [];
  doctors.forEach(doctor => {
    const { _id, name, speciality, category } = doctor;
    if (category === ENTITY.DOCTOR) {
      doctorChildred.push({
        id: _id,
        title: name,
        Speciality: speciality
      });
    }
  });
  return doctorChildred;
};
