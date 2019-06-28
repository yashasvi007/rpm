const intialState = {};

function setClinicalTestTemplate(state, data) {
  const { clinicalTestTemplates } = data;
  if (clinicalTestTemplates) {
    return { ...state, ...clinicalTestTemplates };
  } else {
    return state;
  }
}

export default (state = intialState, action) => {
  const { type, payload = {} } = action;

  switch (type) {
    default:
      return setClinicalTestTemplate(state, payload);
  }
};
