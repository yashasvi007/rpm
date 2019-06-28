import getAge from "../getAge";
import { USER_CATEGORY, USER_STATUS } from "../../constant";
export default data => {
  const {
    users = {},
    currentUser: {
      basicInfo: { category }
    },
    hospitals = {},
    patient = {}
  } = data;
  let doctor;
  let hospital;
  const {
    programIds = [],
    basicInfo: { _id, name, profilePicLink } = {},
    personalInfo: { gender, dob } = {},
    status
  } = patient;
  if (programIds.length > 0) {
    const { doctor: doctorId, hospitalId } = programIds[0];
    doctor = users[doctorId];
    hospital = hospitals[hospitalId];
  }
  const checkbox =
    status === USER_STATUS.ENROLLED && category === USER_CATEGORY.CARE_COACH;

  const formatData = {
    title: name || "",
    profilePicLink: profilePicLink || "",
    age: (dob && getAge(dob)) || "",
    gender: gender || "",
    doctor: doctor && doctor.basicInfo ? `Dr. ${doctor.basicInfo.name}` : "",
    hospital: hospital ? `${hospital.name},${hospital.city}` : "",
    id: _id,
    type: status,
    checkbox: checkbox
  };

  return formatData;
};
