export const getEditBasicConditionURL = medicalConditionId => {
  return `/medicalCondition/${medicalConditionId}/basicCondition`;
};

export const getAddVitalURL = medicalConditionId => {
  return `/medicalCondition/${medicalConditionId}/vital`;
};

export const getUpdateClinicalReadingURL = medicalConditionId => {
  return `/medicalCondition/${medicalConditionId}/clinicalReading`;
};
