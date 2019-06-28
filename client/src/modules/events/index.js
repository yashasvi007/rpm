// import moment from "moment";
import { doRequest } from "../../Helper/network";
import { Event } from "../../Helper/urls";
import { REQUEST_TYPE } from "../../constant";
const intialState = {};

const FETCHING_EVENTS_DATA = "FETCHING_EVENTS_DATA";
const FETCHING_EVENTS_DATA_COMPLETED = "FETCHING_EVENTS_DATA_COMPLETED";
const FETCHING_EVENTS_DATA_COMPLETED_WITH_ERROR =
  "FETCHING_EVENTS_DATA_COMPLETED_WITH_ERROR";

const FETCH_APPOINTMENTS_HISTORY = "FETCH_APPOINTMENTS_HISTORY";
const FETCH_APPOINTMENTS_HISTORY_COMPLETED =
  "FETCH_APPOINTMENTS_HISTORY_COMPLETED";
const FETCH_APPOINTMENTS_HISTORY_COMPLETED_WITH_ERROR =
  "FETCH_APPOINTMENTS_HISTORY_COMPLETED_WITH_ERROR";

export const FETCH_ADVERSE_EVENT_COMPLETED = "FETCH_ADVERSE_EVENT_COMPLETED";

export const CANCEL_APPOINTMENT = "CANCEL_APPOINTMENT";
export const CANCEL_APPOINTMENT_COMPLETED = "CANCEL_APPOINTMENT_COMPLETED";
export const CANCEL_APPOINTMENT_COMPLETED_WITH_ERROR =
  "CANCEL_APPOINTMENT_COMPLETED_WITH_ERROR";

export const CANCEL_REMINDER = "CANCEL_REMINDER";
export const CANCEL_REMINDER_COMPLETED = "CANCEL_REMINDER_COMPLETED";
export const CANCEL_REMINDER_COMPLETED_WITH_ERROR =
  "CANCEL_REMINDER_COMPLETED_WITH_ERROR";

export const SET_APPOINTMENT_STATUS = "SET_APPOINTMENT_STATUS";
export const SET_APPOINTMENT_STATUS_COMPLETED =
  "SET_APPOINTMENT_STATUS_COMPLETED";
export const SET_APPOINTMENT_STATUS_COMPLETED_WITH_ERROR =
  "SET_APPOINTMENT_STATUS_COMPLETED_WITH_ERROR";

export const EDIT_NOTES = "EDIT_NOTES";
export const EDIT_NOTES_COMPLETED = "EDIT_NOTES_COMPLETED";
export const EDIT_NOTES_COMPLETED_WITH_ERROR =
  "EDIT_NOTES_COMPLETED_WITH_ERROR";

export const RESCHEDULE = "RESCHEDULE";
export const RESCHEDULE_COMPLETED = "RESCHEDULE_COMPLETED";
export const RESCHEDULE_COMPLETED_WITH_ERROR =
  "RESCHEDULE_COMPLETED_WITH_ERROR";

export const POLL_EVENTS = "POLL_EVENTS";
export const POLL_EVENTS_COMPLETED = "POLL_EVENTS_COMPLETED";
export const POLL_EVENTS_COMPLETED_WITH_ERROR =
  "POLL_EVENTS_COMPLETED_WITH_ERROR";

export const FETCH_EVENT_USERS = "FETCH_EVENT_USERS";
export const FETCH_EVENT_USERS_COMPLETED = "FETCH_EVENT_USERS_COMPLETED";
export const FETCH_EVENT_USERS_COMPLETED_WITH_ERROR =
  "FETCH_EVENT_USERS_COMPLETED_WITH_ERROR";

const ADD_VIDEO_ROOM_PARTICIPANTS = "ADD_VIDEO_ROOM_PARTICIPANTS";
const ADD_VIDEO_ROOM_PARTICIPANTS_COMPLETED =
  "ADD_VIDEO_ROOM_PARTICIPANTS_COMPLETED";
const ADD_VIDEO_ROOM_PARTICIPANTS_COMPLETED_WITH_ERROR =
  "ADD_VIDEO_ROOM_PARTICIPANTS_COMPLETED_WITH_ERROR";

const setEvents = (state, data) => {
  const {
    events: upcomingEvents = {},
    appointments: upcomingAppointments = {},
    scheduleEventListByDate: upcomingScheduleEventListByDate = {}
  } = data;
  const { events = {}, appointments = {} } = state;
  const newEvents = { ...events, ...upcomingEvents };
  const newAppointments = Object.assign({}, appointments, upcomingAppointments);
  const newScheduleEventListByDate = Object.assign(
    {},
    upcomingScheduleEventListByDate
  );

  return {
    ...state,
    events: newEvents,
    appointments: newAppointments,
    scheduleEventListByDate: newScheduleEventListByDate
  };
};

const updateEvent = (state, data) => {
  const { events: newEvents = {} } = data;
  const { events = {} } = state;
  return {
    ...state,
    events: { ...events, ...newEvents }
  };
};

const setAppointmentsHistory = (state, data) => {
  const {
    events: upcomingEvents = {},
    appointmentHistory: upcomingApptHistory = {},
    historyIds: upcomingHistoryId = {}
  } = data;

  const { events = {}, historyIds = [], appointmentHistory = {} } = state;
  const newEvents = { ...events, ...upcomingEvents };
  const newAppointmentHistory = Object.assign(
    {},
    appointmentHistory,
    upcomingApptHistory
  );
  const newHistoryIds = new Set([...historyIds, ...upcomingHistoryId]);

  return {
    ...state,
    events: newEvents,
    appointmentHistory: newAppointmentHistory,
    historyIds: [...newHistoryIds]
  };
};

// const onRescheduleComplete = (state, data) => {
//   const { events = {}, scheduleEventListByDate = {} } = state;
//   const { id, fields } = data;
//   const { startDate } = fields;
//   const currentEvent = events[id] || {};
//   const oldDate = moment(currentEvent.startTime).format("YYYY-MM-DD");
//   const newDate = moment(startDate).format("YYYY-MM-DD");
//   const oldEventList = scheduleEventListByDate[oldDate] || [];
//   let newEventsList = scheduleEventListByDate[newDate] || [];
//   newEventsList.push(id);
//   const newScheduleEventListByDate = {
//     ...scheduleEventListByDate,
//     [oldDate]: oldEventList.filter(value => {
//       return id !== value;
//     }),
//     [newDate]: newEventsList
//   };
//   const updatedEvent = { ...currentEvent, ...fields };
//   return {
//     ...state,
//     events: { ...events, [id]: updatedEvent },
//     scheduleEventListByDate: newScheduleEventListByDate
//   };
// };

const onEditNotesComplete = (state, data) => {
  const { events = {} } = state;
  const { id, notes } = data;
  const currentEvent = events[id] || {};
  const oldData = currentEvent.data || {};
  const newData = { ...oldData, notes: notes };
  const updatedEvent = { ...currentEvent, data: newData };
  return { ...state, events: { ...events, [id]: updatedEvent } };
};

export const fetchEventsData = (userId, startDate, endDate) => {
  return async dispatch => {
    try {
      dispatch({ type: FETCHING_EVENTS_DATA });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Event.getAppointments(userId, startDate, endDate)
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCHING_EVENTS_DATA_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCHING_EVENTS_DATA_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const fetchEventUsers = eventId => {
  return async dispatch => {
    try {
      dispatch({ type: FETCH_EVENT_USERS });
      const response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Event.getEventUsers(eventId)
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCH_EVENT_USERS_COMPLETED,
          payload: { users: payload.data }
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCH_EVENT_USERS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

const setAdverseEventData = (state, data, userId) => {
  const { events = {}, adverseEvent } = data;
  const { events: oldEvents = {} } = state;
  const { adverseEvent: oldAdverseEvent = {} } = state;
  const newadverseEvent = { ...oldAdverseEvent, ...adverseEvent };

  return {
    ...state,
    events: { ...oldEvents, ...events },
    adverseEvent: newadverseEvent
  };
};

const setLastUpdatedAt = (state, data) => {
  const lastUpdatedAt = data.updatedAt;
  return {
    ...state,
    lastUpdatedAt: lastUpdatedAt
  };
};

export const fetchAdverseEvent = userId => {
  return async dispatch => {
    try {
      const response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Event.getFetchAdverseEvent(userId)
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCH_ADVERSE_EVENT_COMPLETED,
          payload: payload.data,
          userId: userId
        });
      } else if (response.status === false) {
      }
    } catch (error) {}
  };
};

export const fetchAppointmentsHistory = (userId, startDate) => {
  return async dispatch => {
    try {
      dispatch({ type: FETCH_APPOINTMENTS_HISTORY });
      let response = await doRequest({
        params: { query: startDate },
        method: REQUEST_TYPE.GET,
        url: Event.getAppointmentsHistory(userId)
      });
      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: FETCH_APPOINTMENTS_HISTORY_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: FETCH_APPOINTMENTS_HISTORY_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
      return response;
    } catch (error) {}
  };
};

export const cancelAppointment = (eventId, all, reason) => {
  return async dispatch => {
    try {
      dispatch({ type: CANCEL_APPOINTMENT });
      let response = await doRequest({
        data: reason,
        method: REQUEST_TYPE.POST,
        url: Event.getCancelAppointment(eventId, all)
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: CANCEL_APPOINTMENT_COMPLETED,
          payload: { ...payload.data, message: payload.message },
          id: eventId,
          all: all
        });
      } else if (response.status === false) {
        dispatch({
          type: CANCEL_APPOINTMENT_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const cancelReminder = (eventId, all) => {
  return async dispatch => {
    try {
      dispatch({ type: CANCEL_REMINDER });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Event.getCancelReminderURL(eventId, all)
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: CANCEL_REMINDER_COMPLETED,
          payload: { ...payload.data, message: payload.message },
          id: eventId,
          all: all
        });
      } else if (response.status === false) {
        dispatch({
          type: CANCEL_REMINDER_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const setAppointmentStatus = details => {
  return async dispatch => {
    try {
      const { eventId, status: eventStatus } = details;
      dispatch({ type: SET_APPOINTMENT_STATUS });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Event.setAppointmentStatusURL(eventId),
        data: { status: eventStatus }
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: SET_APPOINTMENT_STATUS_COMPLETED,
          payload: {
            data: payload.data,
            message: payload.message
          }
        });
      } else if (response.status === false) {
        dispatch({
          type: SET_APPOINTMENT_STATUS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const editReminder = data => {
  return async dispatch => {
    try {
      const { id, ...fields } = data;

      dispatch({ type: RESCHEDULE });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Event.getEditReminderURL(id),
        data: fields
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: RESCHEDULE_COMPLETED,
          payload: { id: id, fields, message: payload.message }
        });
      } else if (response.status === false) {
        dispatch({
          type: RESCHEDULE_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const editNotesReminder = data => {
  return async dispatch => {
    try {
      const { id, notes } = data;
      dispatch({ type: EDIT_NOTES });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Event.getEditNotesReminderURL(id),
        data: { notes: notes }
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: EDIT_NOTES_COMPLETED,
          payload: { id: id, notes, message: payload.message }
        });
      } else if (response.status === false) {
        dispatch({
          type: EDIT_NOTES_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const reschedule = data => {
  return async dispatch => {
    try {
      const { id, ...fields } = data;
      dispatch({ type: RESCHEDULE });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Event.getRescheduleAppointmentURL(id),
        data: fields
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: RESCHEDULE_COMPLETED,
          payload: { id: id, fields, message: payload.message }
        });
      } else if (response.status === false) {
        dispatch({
          type: RESCHEDULE_COMPLETED_WITH_ERROR,
          payload: { error: response.payload.error }
        });
      }
    } catch (error) {}
  };
};

export const editNotes = data => {
  return async dispatch => {
    try {
      const { id, notes } = data;
      dispatch({ type: EDIT_NOTES });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Event.getEditNotesURL(id),
        data: { notes: notes }
      });

      const { status, payload } = response;
      if (status === true) {
        dispatch({
          type: EDIT_NOTES_COMPLETED,
          payload: { id: id, notes, message: payload.message }
        });
      } else if (response.status === false) {
        dispatch({
          type: EDIT_NOTES_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const pollEventsData = () => {
  return async dispatch => {
    try {
      dispatch({ type: POLL_EVENTS });
      let response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Event.getLastEditedEvent()
      });
      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: POLL_EVENTS_COMPLETED,
          payload: payload.data
        });
      } else if (response.status === false) {
        dispatch({
          type: POLL_EVENTS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export const addVideoRoomParticipantsInEvent = (eventId, userOne, userTwo) => {
  return async dispatch => {
    try {
      dispatch({ type: ADD_VIDEO_ROOM_PARTICIPANTS });
      let response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Event.addVideoRoomParticipantsURL(eventId),
        data: { userOne: userOne, userTwo: userTwo }
      });
      const { status, payload } = response;

      if (status === true) {
        dispatch({
          type: ADD_VIDEO_ROOM_PARTICIPANTS_COMPLETED
        });
      } else if (response.status === false) {
        dispatch({
          type: ADD_VIDEO_ROOM_PARTICIPANTS_COMPLETED_WITH_ERROR,
          payload: payload.error
        });
      }
    } catch (error) {}
  };
};

export default (state = intialState, action) => {
  const { type, payload = {}, userId } = action;

  switch (type) {
    // case RESCHEDULE_COMPLETED:
    //   return onRescheduleComplete(state, payload);
    case EDIT_NOTES_COMPLETED:
      return onEditNotesComplete(state, payload);
    case FETCHING_EVENTS_DATA_COMPLETED:
      return setEvents(state, payload);
    case FETCH_APPOINTMENTS_HISTORY_COMPLETED:
      return setAppointmentsHistory(state, payload);
    case FETCH_ADVERSE_EVENT_COMPLETED:
      return setAdverseEventData(state, payload, userId);
    case POLL_EVENTS_COMPLETED:
      return setLastUpdatedAt(state, payload);
    case SET_APPOINTMENT_STATUS_COMPLETED:
      return updateEvent(state, payload);
    default:
      return state;
  }
};
