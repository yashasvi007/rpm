import React, { Component } from "react";
import { Modal, Radio, Form } from "antd";
import { injectIntl } from "react-intl";
import moment from "moment";
import "../style.less";
import { EVENT_TYPE, EVENT_ACTION, REPEAT_TYPE } from "../../../constant";
import messages from "./message";
import Add from "./add";
import CalendarTimeSelection from "./calendarTimeSelection";
import clone from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";

import { doRequest } from "../../../Helper/network";
import { getBookedSlotsURL } from "../../../Helper/urls/event";
import CommonError from "../../CommonError";

import { isNumber } from "../../../Helper/validation";

const { Button: RadioButton, Group: RadioGroup } = Radio;

class Event extends Component {
  constructor(props) {
    super(props);
    this.AddForm = Form.create({ onValuesChange: this.onFormChanges })(Add);
    this.state = {
      eventMode: this.props.eventMode || EVENT_TYPE.APPOINTMENT,
      eventTitle: "",
      eventStartTime: moment(),
      eventEndTime: moment().add(1, "h"),
      startDate: moment(),
      endDate: null,
      repeatType: REPEAT_TYPE.NONE,
      bookedEvents: []
    };
  }

  // componentDidMount() {
  //   //for now, we are considering that care-coach is our participantone.
  //   const { event: { eventType, startTime, endTime } = {} } = this.props;
  //   this.setState({
  //     eventMode: eventType,
  //     eventStartTime: startTime,
  //     eventEndTime: endTime
  //   });
  // }

  componentDidUpdate(prevProps, prevState) {
    const newProps = clone(this.props);
    if (newProps.show === true && newProps.show !== prevProps.show) {
      this.setState({
        eventStartTime: moment(),
        eventEndTime: moment().add(1, "h"),
        startDate: moment()
      });
      const { userId, users } = newProps;
      if (userId) {
        const user = users[userId] || {};
        this.setParticipantTwo(user);
      }
    }

    if (newProps.show && !isEqual(prevProps.event, newProps.event)) {
      const {
        event,
        currentUser: { basicInfo: { _id } = {} } = {},
        users = {}
      } = newProps;
      if (event) {
        const {
          eventType,
          startTime,
          endTime,
          data: { repeatInterval, repeat, participantTwo, participantOne } = {}
        } = event;
        this.setState({
          eventMode: eventType,
          eventStartTime: moment(startTime),
          eventEndTime: moment(endTime),
          startDate: moment(startTime),
          repeatInterval,
          repeat
        });
        const id = participantTwo === _id ? participantOne : participantTwo;
        if (id) {
          const user = users[id] || {};
          this.setParticipantTwo(user);
        }
      }
    }
  }

  getBookedSlots = async () => {
    const {
      startDate,
      participantTwo: { basicInfo: { _id } = {} } = {}
    } = this.state;
    if (startDate && startDate.isValid && _id) {
      //fetching current startDate's booked events.
      const response = await doRequest({
        url: getBookedSlotsURL(),
        params: {
          startDate: startDate.clone().format("YYYY-MM-DD"),
          userId: _id
        }
      });
      const { status, payload = {} } = response;
      if (status) {
        const { data: { bookedSlots } = [] } = payload;
        //for more events option got to https://fullcalendar.io/docs/event-parsing
        const bookedEvents = bookedSlots.map(event => {
          const { start, end } = event;
          return {
            start,
            end,
            editable: false,
            startEditable: false,
            durationEditable: false,
            className: "booked"
          };
        });
        this.setState({ bookedEvents });
      }
    }
  };

  setParticipantTwo = value => {
    const { getBookedSlots } = this;
    //make category check here
    this.setState({ participantTwo: value }, getBookedSlots);
  };

  onFormChanges = (props, changedValues, allValues) => {
    const { adjustDate } = this;
    const {
      repeat: changeRepeat,
      repeatInterval: changeRepeatInterval
    } = changedValues;

    if (changeRepeat || changeRepeatInterval) {
      const { repeat, repeatInterval } = allValues;
      this.setState({ repeat, repeatInterval }, adjustDate);
    }
  };

  getNewEndDate = () => {
    const { repeat, repeatInterval, startDate: eventStartDate } = this.state;
    let endDate;
    if (!repeat && !repeatInterval) {
      return endDate;
    } else {
      const startDate = eventStartDate.clone();
      const res = isNumber(repeatInterval);
      if (repeat === REPEAT_TYPE.DAILY || res.valid === true) {
        switch (repeat) {
          case REPEAT_TYPE.DAILY: {
            endDate = startDate.add(1, "d");
            break;
          }
          case REPEAT_TYPE.WEEKLY: {
            endDate = startDate.add(res.value, "w");
            break;
          }
          case REPEAT_TYPE.MONTHLY: {
            endDate = startDate.add(res.value, "M");
            break;
          }
          case REPEAT_TYPE.YEARLY: {
            endDate = startDate.add(res.value, "y");
            break;
          }
          default:
            break;
        }
      }
      return endDate;
    }
  };

  adjustDate = () => {
    const { repeat, repeatInterval } = this.state;
    const { onEndDateChange, getNewEndDate } = this;
    if (!repeat && !repeatInterval) {
      return;
    }
    onEndDateChange(getNewEndDate());
  };

  formatMessage = messageId => {
    const {
      intl: { formatMessage }
    } = this.props;
    return formatMessage(messageId);
  };

  handleCancel = () => {
    const { close } = this.props;
    close();
    this.resetState();
  };

  resetState = () => {
    this.setState({
      eventMode: EVENT_TYPE.APPOINTMENT,
      eventTitle: "",
      eventStartTime: moment(),
      eventEndTime: moment().add(1, "h"),
      startDate: moment(),
      endDate: null,
      repeatType: REPEAT_TYPE.NONE,
      participantTwo: {},
      bookedEvents: []
    });
  };

  onAddAppointment = data => {
    const { addAppointment } = this.props;
    const {
      participantTwo,
      activityType,
      activityMode,
      repeat,
      repeatDays,
      notes,
      repeatInterval
    } = data;

    const { startDate, endDate, eventStartTime, eventEndTime } = this.state;
    addAppointment({
      participantTwo,
      activityMode,
      activityType,
      repeat,
      repeatInterval,
      repeatDays,
      notes,
      startDate:
        startDate && startDate !== null ? startDate.format() : startDate,
      endDate: endDate && endDate !== null ? endDate.format() : endDate,
      startTime:
        eventStartTime && eventStartTime !== null
          ? eventStartTime.startOf("minute").format()
          : eventStartTime,
      endTime:
        eventEndTime && eventEndTime !== null
          ? eventEndTime.startOf("minute").format()
          : eventEndTime
    }).then(res => {
      if (res !== undefined && res.status) {
        this.resetState();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }
    });
  };

  editNotes = data => {
    const {
      editNotes,
      event: { id, eventType },
      editNotesReminder
    } = this.props;
    const { notes } = data;

    if (eventType === EVENT_TYPE.APPOINTMENT) {
      editNotes({
        id: id,
        notes
      }).then(value => {
        this.resetState();
      });
    } else if (eventType === EVENT_TYPE.REMINDER) {
      editNotesReminder({
        id: id,
        notes
      }).then(value => {
        this.resetState();
      });
    }
  };

  reschedule = data => {
    const {
      reschedule,
      event: { id },
      series
    } = this.props;
    const { repeat, repeatDays, repeatInterval, notes } = data;

    const {
      startDate,
      endDate,
      eventStartTime: startTime,
      eventEndTime: endTime
    } = this.state;
    reschedule({
      id: id,
      startDate,
      endDate,
      startTime: startTime.startOf("minute").format(),
      endTime:
        endTime && endTime !== null
          ? endTime.startOf("minute").format()
          : endTime,
      repeat,
      repeatDays,
      repeatInterval,
      series,
      notes
    }).then(res => {
      if (res !== undefined && res.status) {
        this.resetState();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }
    });
  };

  editReminder = data => {
    const {
      editReminder,
      event: { id },
      series
    } = this.props;
    const {
      startDate,
      endDate,
      eventStartTime: startTime,
      eventEndTime: endTime
    } = this.state;
    const { notes = "", repeat, repeatDays, repeatInterval } = data;

    editReminder({
      id: id,
      startDate,
      endDate,
      startTime: startTime.startOf("minute").format(),
      endTime,
      repeat,
      repeatDays,
      repeatInterval,
      series,
      notes
    }).then(res => {
      if (res !== undefined && res.status) {
        this.resetState();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }
    });
  };

  onAddReminder = data => {
    const {
      addReminder,
      currentUser: { programIds }
    } = this.props;
    const { startDate, endDate, eventStartTime } = this.state;
    const {
      repeat,
      repeatDays,
      notes,
      repeatInterval,
      title,
      remindCareCoach,
      participantTwo: remindAlso
    } = data;
    let participantTwo;
    if (remindCareCoach) {
      const { careCoach } = programIds[0] || {};
      participantTwo = careCoach;
    }
    if (remindAlso) {
      participantTwo = remindAlso;
    }
    addReminder({
      startDate:
        startDate && startDate !== null ? startDate.format() : startDate,
      endDate: endDate && endDate !== null ? endDate.format() : endDate,
      startTime:
        eventStartTime && eventStartTime !== null
          ? eventStartTime.startOf("minute").format()
          : eventStartTime,
      participantTwo,
      repeat,
      repeatInterval,
      repeatDays,
      notes,
      title
    }).then(res => {
      this.resetState();
      // if (res !== undefined && res.status) {
      //   setTimeout(() => {
      //     window.location.reload();
      //   }, 1000);
      // }
    });
  };

  onChangeContext = event => {
    this.setState({ eventMode: event.target.value });
  };

  onEventDurationChange = (start, end) => {
    const now = moment();
    let data = {
      eventStartTime: start,
      eventEndTime: end,
      eventStartTimeError: false
    };

    if (start <= now) {
      data = { ...data, eventStartTimeError: true };
    }
    this.setState(data);
  };

  onChangeEventEndTime = endTime => {
    const { eventStartTime } = this.state;
    let data = { eventEndTime: endTime, eventEndTimeError: false };
    if (eventStartTime >= endTime) {
      data = { ...data, eventEndTimeError: true };
    }
    this.setState(data);
  };

  onChangeEventStartTime = startTime => {
    const endTime = startTime.clone();
    const eventEndTime = endTime.add(1, "h");
    const now = moment();
    let data = {
      eventStartTime: startTime,
      eventEndTime: eventEndTime,
      eventStartTimeError: false,
      eventEndTimeError: false
    };
    if (startTime <= now) {
      data = { ...data, eventStartTimeError: true };
    }
    this.setState(data);
  };

  onChangeRepeatType = value => {
    this.setState({ repeatType: value }, this.adjustDate);
  };

  onEndDateChange = endDate => {
    if (endDate && endDate.isValid) {
      this.setState({ endDate: endDate });
    }
  };

  adjustEventOnStartDateChange = (prevDate, newDate) => {
    const { eventStartTime, eventEndTime } = this.state;

    const startOfNewDate = newDate.clone().startOf("day");
    const startOfPrevDate = prevDate.clone().startOf("day");
    const diffInDays = startOfNewDate.diff(startOfPrevDate, "days");
    const newEventStartTime =
      diffInDays > 0
        ? eventStartTime.add(diffInDays, "days")
        : eventStartTime.subtract(Math.abs(diffInDays), "days");
    const newEventEndTime =
      diffInDays > 0
        ? eventEndTime.add(diffInDays, "days")
        : eventEndTime.subtract(Math.abs(diffInDays), "days");

    let data = {
      eventStartTime: newEventStartTime,
      eventEndTime: newEventEndTime,
      eventStartTimeError: false
    };
    const now = moment();
    if (eventStartTime <= now) {
      data = { ...data, eventStartTimeError: true };
    }

    this.setState(data);
  };

  onStartDateChange = currentDate => {
    const { startDate } = this.state;
    const { adjustDate, getBookedSlots } = this;
    if (currentDate && currentDate.isValid) {
      this.setState({ startDate: currentDate }, () => {
        this.adjustEventOnStartDateChange(startDate, currentDate);
        adjustDate(); //it will reset the end date field according to what is selected in repeatType and repeatInterval
        getBookedSlots();
      });
    }
  };

  disabledStartDate = current => {
    // Can not select days before today
    return current && current <= moment().subtract({ day: 1 });
  };

  disabledEndDate = current => {
    const { repeat } = this.state;
    //cannot selecct days before today + repeatInterval
    if (repeat && repeat !== REPEAT_TYPE.NONE) {
      const endDate = this.getNewEndDate();
      if (endDate) {
        return current && current < endDate;
      }
    }
  };

  onPrev = () => {
    const { startDate } = this.state;
    if (startDate !== null) {
      const { onStartDateChange } = this;
      const newStartDate = startDate.clone().subtract(1, "days");
      onStartDateChange(newStartDate);
    }
  };

  onNext = () => {
    const { startDate } = this.state;
    if (startDate !== null) {
      const { onStartDateChange } = this;
      const newStartDate = startDate.clone().add(1, "days");
      onStartDateChange(newStartDate);
    }
  };

  getSubmitHandler = () => {
    const { purpose, event = {} } = this.props;
    const { eventType = "" } = event;
    const {
      editNotes,
      reschedule,
      onAddAppointment,
      onAddReminder,
      editReminder
    } = this;
    const { eventMode } = this.state;
    if (purpose) {
      if (eventType === EVENT_TYPE.APPOINTMENT) {
        return purpose === EVENT_ACTION.EDIT_NOTES ? editNotes : reschedule;
      } else if (eventType === EVENT_TYPE.REMINDER) {
        return purpose === EVENT_ACTION.EDIT_NOTES ? editNotes : editReminder;
      }
    } else {
      return eventMode === EVENT_TYPE.APPOINTMENT
        ? onAddAppointment
        : onAddReminder;
    }
  };

  setFormRef = formRef => {
    this.formRef = formRef;
    this.setState({ formRef: true });
  };

  setRepeatIntervalError = status => {
    this.setState({ repeatInterValError: status });
  };

  render() {
    const {
      show: visible,
      isError,
      requesting,
      purpose,
      series,
      showRepeating,
      disabledDateAndTime,
      disabledStartDate: disabledStartDateOnEdit = false,
      userId,
      event: { data = {} } = {},
      currentUser = {},
      users,
      error: { error } = {},
      clearMsg
    } = this.props;
    const { basicInfo: { _id } = {} } = currentUser;
    const {
      formatMessage,
      handleCancel,
      AddForm,
      onChangeContext,
      onEventDurationChange,
      onChangeEventEndTime,
      onChangeEventStartTime,
      onChangeRepeatType,
      onEndDateChange,
      onStartDateChange,
      disabledEndDate,
      disabledStartDate,
      onPrev,
      onNext,
      getSubmitHandler,
      adjustDate,
      setRepeatIntervalError,
      setParticipantTwo
    } = this;

    let eventData = { ...data };
    const { participantTwo: otherParticipant, participantOne } = data;
    if (otherParticipant === _id) {
      eventData = { ...eventData, participantTwo: participantOne };
    }

    const {
      eventMode,
      eventTitle,
      eventStartTime,
      eventEndTime,
      startDate,
      endDate,
      repeatType,
      eventEndTimeError,
      repeatInterValError,
      eventStartTimeError,
      bookedEvents = [],
      participantTwo
    } = this.state;

    const modalTitle =
      purpose === EVENT_ACTION.EDIT_NOTES
        ? "Edit Notes"
        : purpose === EVENT_ACTION.RESCHEDULE
        ? "Reschedule"
        : formatMessage(messages.schedule);
    const modalProps = {
      visible: visible || isError,
      title: modalTitle,
      okButtonProps: {},
      onCancel: handleCancel,
      wrapClassName: "global-modal event-modal",
      destroyOnClose: true,
      footer: null,
      width: "94%"
    };

    const disabledForEdit = purpose ? true : false;

    return (
      <Modal {...modalProps}>
        {error && (
          <CommonError close={clearMsg} msg={error} className="error" />
        )}
        <div className="flex">
          <div style={{ width: "50%", minHeight: "640px" }}>
            <div className="flex justify-content-end mb16">
              <RadioGroup
                className="event-group-btn"
                buttonStyle="solid"
                onChange={onChangeContext}
                defaultValue={eventMode}
                disabled={disabledForEdit}
                value={eventMode}
              >
                <RadioButton value={EVENT_TYPE.APPOINTMENT}>
                  {formatMessage(messages.appointment)}
                </RadioButton>
                <RadioButton value={EVENT_TYPE.REMINDER}>
                  {formatMessage(messages.reminder)}
                </RadioButton>
              </RadioGroup>
            </div>
            <AddForm
              adjustDate={adjustDate}
              eventMode={eventMode}
              repeatType={repeatType}
              onChangeRepeatType={onChangeRepeatType}
              disabledEndDate={disabledEndDate}
              disabledStartDate={disabledStartDate}
              disabledStartDateOnEdit={disabledStartDateOnEdit}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
              eventTitle={eventTitle}
              eventStartTime={eventStartTime}
              eventEndTime={eventEndTime}
              loading={requesting}
              handleCancel={handleCancel}
              onChangeEventEndTime={onChangeEventEndTime}
              onChangeEventStartTime={onChangeEventStartTime}
              handleSubmit={getSubmitHandler()}
              purpose={purpose}
              showRepeating={showRepeating}
              disabledDateAndTime={disabledDateAndTime}
              series={series}
              disabledForEdit={disabledForEdit}
              userId={userId}
              data={eventData}
              currentUser={currentUser}
              otherUser={participantTwo}
              users={users}
              eventEndTimeError={eventEndTimeError}
              eventStartTimeError={eventStartTimeError}
              setRepeatIntervalError={setRepeatIntervalError}
              setParticipantTwo={setParticipantTwo}
            />
          </div>
          <CalendarTimeSelection
            eventMode={eventMode}
            range={repeatType !== REPEAT_TYPE.NONE}
            disabled={
              eventMode === EVENT_TYPE.REMINDER ||
              purpose === EVENT_ACTION.EDIT_NOTES
            }
            eventTitle={eventTitle}
            disabledEndDate={disabledEndDate}
            disabledStartDate={disabledStartDate}
            disabledStartDateOnEdit={disabledStartDateOnEdit}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            eventStartTime={eventStartTime}
            eventEndTime={eventEndTime}
            startDate={startDate}
            endDate={endDate}
            onPrev={onPrev}
            onNext={onNext}
            repeatInterValError={repeatInterValError}
            onEventDurationChange={onEventDurationChange}
            bookedEvents={bookedEvents}
            className={`calendar-section ${
              eventMode === EVENT_TYPE.REMINDER ||
              purpose === EVENT_ACTION.EDIT_NOTES
                ? "disabled"
                : ""
            }`}
            participant={participantTwo}
          />
        </div>
      </Modal>
    );
  }
}

export default injectIntl(Event);
