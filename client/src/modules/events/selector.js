import { createSelector } from "reselect";

const getAdverseEventsfromEvents = (events = {}, userId) => {
  const { events: allEvents = {}, adverseEvent = {} } = events;
  const adverseEventList = adverseEvent[userId];
  let allAdverseEvent = [];
  if (adverseEventList) {
    allAdverseEvent = adverseEventList.map(
      adverseEventId => allEvents[adverseEventId]
    );
  }
  return allAdverseEvent;
};

export const makeAdverseEventSelector = () =>
  createSelector(
    getAdverseEventsfromEvents,
    allAdverseEvent => {
      return allAdverseEvent;
    }
  );
