export default data => {
  const {
    article = {},
    programs = {},
    users = {},
    currentUser: { basicInfo: { _id: currentUserId } = {}, programId } = {}
  } = data;
  const { participants = {} } = article;
  const list = Object.keys(participants);
  const programData = [];
  programId.forEach(id => {
    const { name } = programs[id] || {};
    let item = { title: name, id };
    const patientList = list.filter(userId => {
      const {
        basicInfo: { _id: patientUserId } = {},
        programId: patientProgram = []
      } = users[userId] || {};
      return patientProgram[0] === id && patientUserId !== currentUserId;
    });
    if (patientList && patientList.length > 0) {
      programData.push({ ...item, patients: patientList });
    }
  });
  return programData;
};
