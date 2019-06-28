export const getAddMedicationURL = () => {
  return "/medication";
};
export const getRemoveMedicationURL = userId => {
  return `users/${userId}/medication`;
};
export const getRecentMedicationURL = userId => {
  return `/patients/${userId}/medication/recent`;
};
