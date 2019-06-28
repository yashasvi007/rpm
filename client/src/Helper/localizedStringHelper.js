const getDataForContext = (m1, contextString, initial) => {
  let contexts = contextString.split(".");
  let data = m1;
  let value;
  for (value in contexts) {
    if (data !== undefined) {
      data = data[contexts[value]];
    } else {
      return initial;
    }
  }
  return data;
};

export default getDataForContext;
