export const getTwilioVideoAccessToken = () => {
  return "/getTwilioVideoAccessToken";
};
export const getTwilioChatAccessToken = () => {
  return "/getTwilioChatAccessToken";
};
export const getConnectedParticipants = roomId => {
  return `/getConnectedParticipants/${roomId}`;
};
