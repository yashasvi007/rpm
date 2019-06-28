// import changePassword from "../../../Containers/page/changePassword";

export const getEditProfileURL = (userId = "") => {
  return "/edit-profile";
};

export const getUserByIdURL = userId => {
  return `/user/${userId}`;
};

export const getMyProfileURL = (userId = "") => {
  return "/myprofile";
};

export const getChangeProfilePicURL = () => {
  return "/upload-profile-pic";
};

export const getChangePasswordURL = (userId = "") => {
  return "/change-password";
};

export const getUploadConsentFormURL = () => {
  return "/upload-consent-form";
};

export const getUploadIdProofURL = () => {
  return `/upload-id-proof`;
};

export const getInsuranceProvidersURL = () => {
  return "/insurance-providers";
};

export const getRelatedMembersURL = () => {
  return "/members";
};
export const getProgramsURL = () => {
  return "/programs";
};

export const getProgramDoctorsURL = programId => {
  return `/program/${programId}/doctors`;
};

export const getProgramPatientsURL = programId => {
  return `/program/${programId}/patients`;
};
// export const getProgramPatientsUrl = programId => {
//   return `/program/${programId}/patients`;
// };

export const getCurrentProgramUrl = programId => {
  return `/program/${programId}`;
};

export const getProductsURL = programId => {
  return `/products/${programId}`;
};

export const getDoctorHospitalsURL = doctorId => {
  return `/doctor/${doctorId}/hospitals`;
};

export const getHospitalsURL = () => {
  return "/hospitals";
};

export const getDischargePatientURL = () => {
  return `/patients/discharge`;
};

export const verifyDocumentURL = userId => {
  return `/users/${userId}/documents-verify`;
};

export const fetchCareCoachSurveyURL = userId => {
  return `/users/surveys`;
};

export const reUploadIdProofsURL = userId => {
  return `/users/${userId}/reupload-idproofs`;
};

export const reUploadConsentDocsURL = userId => {
  return `/users/${userId}/reupload-consentdocs`;
};

export const getHistoricalClinicalReadingURL = userId => {
  return `/patients/${userId}/clinical-readings`;
};

export const getHistoricalVitalsReadingURL = userId => {
  return `/patients/${userId}/vitals`;
};

export const getHistoricalMedicationDataURL = userId => {
  return `/patients/${userId}/medication`;
};
