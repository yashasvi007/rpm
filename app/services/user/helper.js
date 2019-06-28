import path from "path";
export const formatUserData = data => {
  const {
    isProfileCompleted,
    isIdProofUploaded,
    isConsentFormUploaded,
    _id,
    category,
    name,
    email,
    homeAddress,
    work,
    settings,
    services,
    documents,
    contacts,
    contactNo,
    insurance,
    dob,
    gender,
    profilePicLink,
    programId,
    visitingHospitals,
    status,
    calendar,
    createdAt
  } = data || {};

  const userDp = profilePicLink
    ? `http://${path.join(process.config.IMAGE_HOST, profilePicLink)}`
    : profilePicLink;

  return {
    basicInfo: {
      _id: _id,
      name,
      profilePicLink,
      category,
      profilePicLink: userDp,
      createdAt
    },
    work,
    personalInfo: {
      contactNo,
      email,
      dob,
      gender,
      contacts,
      homeAddress
    },
    settings,
    insurance,
    status,
    programId,
    documents,
    services,
    visitingHospitals,
    isProfileCompleted,
    isConsentFormUploaded,
    isIdProofUploaded,
    calendar
  };
};
