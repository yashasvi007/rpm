import React, { Component, Fragment } from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  TimePicker,
  DatePicker,
  Button,
  Tag
} from "antd";

import { injectIntl } from "react-intl";
import moment from "moment";

import AppointmentType from "./appointmentType";
import ActivityMode from "./activityMode";
import Participants from "./participants";
import RepeatInterval from "./repeatInterval";
import ReminderTitle from "./reminderTitle";
import SelectedDays from "./selectedDays";
import { isNumber } from "../../../../Helper/validation";
import { getActivityBetween } from "./constant";

import {
  REPEAT_OPTION,
  REPEAT_TYPE,
  DAYS,
  EVENT_TYPE,
  ACTIVITY_TYPE,
  APPOINTMENT_TYPE,
  USER_CATEGORY
} from "../../../../constant";
import calendar from "../../../../Assets/images/button-select-date.svg";
import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import messages from "../message";
import { doRequest } from "../../../../Helper/network";
import { User } from "../../../../Helper/urls";
import { hasErrors } from "../../../../Helper/validation";

const { TextArea } = Input;

const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;

// function range(start, end) {
//   const result = [];
//   for (let i = start; i < end; i++) {
//     result.push(i);
//   }
//   return result;
// }

const { Item: FormItem } = Form;
const { Button: RadioButton } = Radio;
const { Option } = Select;
const { CheckableTag } = Tag;

const PARTICIPANT_TWO = "participantTwo";
const REPEAT = "repeat";
const REPEAT_PARAM_WEEKLY = "repeatDays";
const REPEAT_INTERVAL = "repeat interval";
const REPEATINTERVAL = "repeatInterval";

const REMINDER_TITLE = "title";
const SELECTED_DAYS = "days";
// const START_DATE = "startDate";
// const END_DATE = "endDate";
// const START_TIME = "startTime";
// const END_TIME = "endTime";
const NOTES = "notes";

class AddAppointment extends Component {
  constructor(props) {
    super(props);
    const {
      data: { activityType, activityMode, repeatDays = [] } = {}
    } = this.props;

    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      selectedDays: repeatDays || [],
      activityType: activityType || APPOINTMENT_TYPE.FOLLOWUP,
      activityMode: activityMode || ACTIVITY_TYPE.CALL,
      members: []
    };
  }

  getParentNode = t => t.parentNode;

  formatMessage = data => this.props.intl.formatMessage(data);

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
    const {
      data: { repeat }
    } = this.props;

    if (repeat) {
      this.onChangeRepeatType(repeat);
    }
    const { setParticipantTwo } = this;
    const {
      currentUser: { basicInfo: { category } = {}, programIds = [] } = {},
      users = {},
      data: { participantTwo } = {}
    } = this.props;
    if (
      category === USER_CATEGORY.CARE_COACH ||
      category === USER_CATEGORY.DOCTOR
    ) {
      doRequest({
        url: User.getRelatedMembersURL()
      })
        .then(res => {
          this.setState({ members: res.payload.data.members });
        })
        .catch(err => {});
    } else if (category === USER_CATEGORY.PATIENT) {
      const { careCoach, doctor } = programIds[0] || {};
      this.setState({ members: [users[careCoach], users[doctor]] }, () => {
        setParticipantTwo(careCoach);
      });
      setParticipantTwo();
    }
    if (participantTwo) {
      setParticipantTwo(participantTwo);
    }
  }

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handleSubmit } = this.props;
    const {
      selectedDays,
      activityMode,
      activityType,
      remindCareCoach = false
    } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        handleSubmit({
          ...values,
          [REPEAT_PARAM_WEEKLY]: selectedDays,
          activityMode,
          activityType,
          remindCareCoach
        });
      }
    });
  };

  getRepeatOption = () => {
    return REPEAT_OPTION.map((value, index) => {
      return (
        <Option key={index} value={value.key}>
          {value.label}
        </Option>
      );
    });
  };

  getDaysOption = () => {
    return DAYS.map(value => {
      return (
        <RadioButton key={value} value={value}>
          {value}
        </RadioButton>
      );
    });
  };

  getTotalTimeDurationOfEvent = () => {
    let eventDurationStr = "";
    const { eventStartTime, eventEndTime } = this.props;
    const diffInMin =
      eventEndTime > eventStartTime
        ? eventEndTime.diff(eventStartTime, "minutes")
        : 0;
    if (diffInMin > 0) {
      const hour = parseInt(diffInMin / 60);
      const min = diffInMin % 60;
      eventDurationStr =
        hour > 0
          ? `Duration ${hour} hour ${min > 0 ? `${min} min` : ""}`
          : `Duration ${min} min`;
    }
    return eventDurationStr;
  };

  onChangeRepeatType = value => {
    const { onChangeRepeatType, adjustDate } = this.props;
    onChangeRepeatType(value);
    adjustDate();
  };

  handleCheckDays = (tag, checked) => {
    const { selectedDays } = this.state;
    const nextSelectedTags = checked
      ? [...selectedDays, tag]
      : selectedDays.filter(t => t !== tag);
    this.setState({ selectedDays: nextSelectedTags });
    const {
      form: { setFieldsValue, validateFields }
    } = this.props;
    setFieldsValue({ [SELECTED_DAYS]: nextSelectedTags.join(",") });
    validateFields();
  };

  openCalendarStartDate = e => {
    e.preventDefault();
    window.document
      .getElementsByClassName("ant-calendar-picker-input")[0]
      .click();
  };

  openCalendarEndDate = e => {
    e.preventDefault();
    window.document
      .getElementsByClassName("ant-calendar-picker-input")[1]
      .click();
  };

  onChangeActivityType = data => {
    this.setState(data);
  };

  onChangeActivityMode = activityMode => {
    this.setState({ activityMode: activityMode });
  };

  validateForm = () => {};

  getParticipantOptionField = () => {};

  disabledStartTime = current => {};
  disabledEndTime = current => {};

  validateRepeatInterval = (rule, value, callback) => {
    const res = isNumber(value);

    if (value && res.valid === false) {
      callback(res.msg);
    } else {
      callback();
    }
  };

  onRepeatIntervalChange = e => {
    e.preventDefault();
    const {
      adjustDate,
      form: { getFieldError },
      setRepeatIntervalError
    } = this.props;
    const error = getFieldError(REPEAT_INTERVAL);
    // eslint-disable-next-line eqeqeq
    setRepeatIntervalError(error != undefined);
    adjustDate();
  };

  remindCareCoach = e => {
    this.setState({ remindCareCoach: e.target.checked });
  };

  setParticipantTwo = value => {
    const { members = [] } = this.state;
    const { setParticipantTwo } = this.props;
    let participant;
    console.log("members ----", members);
    // move to simple for;
    members.forEach(member => {
      const {
        basicInfo: { _id }
      } = member || {};
      if (_id === value) {
        participant = member;
      }
    });
    setParticipantTwo(participant);
  };

  getActivityConfig = () => {
    const { purpose, currentUser, otherUser, data } = this.props;
    return getActivityBetween({
      viewer: currentUser,
      other: otherUser,
      event: data,
      edit: purpose
    });
  };

  render() {
    const {
      data: {
        participantTwo,
        repeatInterval,
        notes,
        title: reminderTitle
      } = {},
      form,
      eventMode,
      loading,
      handleCancel,
      eventStartTime,
      eventEndTime,
      onChangeEventEndTime,
      onChangeEventStartTime,
      startDate,
      endDate,
      repeatType,
      onEndDateChange,
      onStartDateChange,
      // disabledStartDate,
      disabledEndDate,
      purpose,
      disabledForEdit,
      userId,
      currentUser,
      eventEndTimeError,
      eventStartTimeError,
      setRepeatIntervalError,
      showRepeating,
      disabledDateAndTime,
      disabledStartDateOnEdit
    } = this.props;
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError
      //getFieldValue
    } = form;

    const {
      getRepeatOption,
      formatMessage,
      onChangeRepeatType,
      handleCheckDays,
      openCalendarStartDate,
      openCalendarEndDate,
      getTotalTimeDurationOfEvent,
      onChangeActivityMode,
      onChangeActivityType,
      onRepeatIntervalChange,
      remindCareCoach,
      setParticipantTwo
    } = this;
    const { members, activityType, activityMode } = this.state;

    // const participantError =
    //   isFieldTouched(PARTICIPANT_TWO) && getFieldError(PARTICIPANT_TWO);
    // const reminderTitleError =
    //   isFieldTouched(REMINDER_TITLE) && getFieldError(REMINDER_TITLE);
    // const repeatIntervalError =
    //   isFieldTouched(REPEAT_INTERVAL) && getFieldError(REPEAT_INTERVAL);

    const eventDuration = getTotalTimeDurationOfEvent();

    const { selectedDays } = this.state;

    const getRepeatTypeStr = () => {
      switch (repeatType) {
        case REPEAT_TYPE.WEEKLY:
          return "Weeks";
        case REPEAT_TYPE.MONTHLY:
          return "Months";
        case REPEAT_TYPE.YEARLY:
          return "Years";
        default:
          return "";
      }
    };

    //const appointmentWith = getFieldValue(PARTICIPANT_TWO);

    const activityConfig = this.getActivityConfig();

    return (
      <Form className="event-form" onSubmit={this.handleSubmit}>
        {eventMode === EVENT_TYPE.REMINDER && (
          <ReminderTitle
            fieldName={REMINDER_TITLE}
            value={reminderTitle}
            form={this.props.form}
            label={formatMessage(messages.reminderTitle)}
            disabled={disabledForEdit}
          />
        )}
        <Participants
          eventMode={eventMode}
          currentUser={currentUser}
          userId={userId}
          members={members}
          participantTwo={participantTwo}
          form={form}
          fieldName={PARTICIPANT_TWO}
          disabledForEdit={disabledForEdit}
          remindCareCoach={remindCareCoach}
          setParticipantTwo={setParticipantTwo}
          onChangeActivityType={onChangeActivityType}
          onChangeActivityMode={onChangeActivityMode}
        />

        {eventMode === EVENT_TYPE.APPOINTMENT && (
          <Fragment>
            <AppointmentType
              data={activityConfig}
              onChangeActivityType={onChangeActivityType}
              activityType={activityType}
              activityMode={activityMode}
            />
            <ActivityMode
              data={activityConfig}
              onChangeActivityMode={onChangeActivityMode}
              activityMode={activityMode}
              activityType={activityType}
            />
          </Fragment>
        )}
        {showRepeating && (
          <Fragment>
            <div className="flex justify-content-space-between">
              <FormItem className="flex-1 align-self-end">
                {getFieldDecorator(REPEAT, {
                  rules: [],
                  initialValue: repeatType || REPEAT_TYPE.NONE,
                  onChange: onChangeRepeatType
                })(
                  <Select
                    className="full-width"
                    placeholder=""
                    showSearch
                    autoComplete="off"
                    optionFilterProp="children"
                    suffixIcon={DropDownIcon}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    getPopupContainer={this.getParentNode}
                  >
                    {getRepeatOption()}
                  </Select>
                )}
              </FormItem>

              {repeatType !== REPEAT_TYPE.NONE &&
                (repeatType !== REPEAT_TYPE.DAILY && (
                  <RepeatInterval
                    fieldName={REPEATINTERVAL}
                    value={repeatInterval}
                    form={this.props.form}
                    getRepeatTypeStr={getRepeatTypeStr}
                    onRepeatIntervalChange={onRepeatIntervalChange}
                    setRepeatIntervalError={setRepeatIntervalError}
                  />
                ))}
            </div>
            {repeatType === REPEAT_TYPE.WEEKLY && (
              <div className="mb16">
                <div className="mb8">
                  <span className="warning-color">* </span>
                  <span className="fontsize12 label-color">
                    {formatMessage(messages.repeatsOn)}
                  </span>
                  <span className="fontsize12 dark">{` ${selectedDays.join(
                    ", "
                  )}`}</span>
                  {selectedDays && selectedDays.length === 0 && (
                    <span className="fontsize12 warning-color ml8">
                      select repeating days
                    </span>
                  )}
                </div>

                <SelectedDays
                  value={selectedDays.join(",")}
                  fieldName={SELECTED_DAYS}
                  form={this.props.form}
                />
                <div className="flex select-days">
                  {DAYS.map(tag => (
                    <CheckableTag
                      className="select-days flex-1"
                      key={tag}
                      checked={selectedDays.indexOf(tag) > -1}
                      onChange={checked => handleCheckDays(tag, checked)}
                    >
                      {tag}
                    </CheckableTag>
                  ))}
                </div>
              </div>
            )}
          </Fragment>
        )}
        <div className=" full-width flex justify-content-space-between mb24">
          {
            <div className=" flex-1 flex  align-items-end iqvia-date-picker">
              {/* <div className="full-width "> */}
              {/* <FormItem
                className="flex-1 date-picker"
                label={
                  repeatType === REPEAT_TYPE.NONE
                    ? formatMessage(messages.on)
                    : formatMessage(messages.from)
                }
              >
                {getFieldDecorator(START_DATE, {
                  rules: []
                })( */}

              <div className="full-width">
                <div className="label-color fontsize12">
                  {repeatType === REPEAT_TYPE.NONE
                    ? formatMessage(messages.on)
                    : formatMessage(messages.from)}
                </div>
                <DatePicker
                  format="DD/MM/YYYY, ddd"
                  showToday={false}
                  disabled={disabledDateAndTime || disabledStartDateOnEdit}
                  // disabledDate={disabledStartDate}
                  className="full-width"
                  suffixIcon={null}
                  value={startDate === null ? null : moment(startDate)}
                  onChange={onStartDateChange}
                  getCalendarContainer={this.getParentNode}
                />
              </div>
              {/* )} */}
              <img
                alt=""
                className="calendar"
                onClick={disabledDateAndTime ? null : openCalendarStartDate}
                src={calendar}
              />
              {/* </FormItem> */}
              {/* </div> */}
            </div>
          }

          {showRepeating && repeatType !== REPEAT_TYPE.NONE && (
            <div className="flex-1 flex  align-items-end iqvia-date-picker">
              {/* <div className="full-width "> */}
              {/* <FormItem
                  className="flex-1 date-picker"
                  label={formatMessage(messages.till)}
                >
                  {getFieldDecorator(END_DATE, {
                    rules: []
                  })( */}
              <div className="full-width ml16">
                <div className="label-color fontsize12">
                  {formatMessage(messages.till)}
                </div>
                <DatePicker
                  format="DD/MM/YYYY, ddd"
                  disabled={getFieldError(REPEAT_INTERVAL) !== undefined}
                  showToday={false}
                  disabledDate={disabledEndDate}
                  className="full-width"
                  suffixIcon={null}
                  value={endDate === null ? null : moment(endDate)}
                  onChange={onEndDateChange}
                  getCalendarContainer={this.getParentNode}
                />
              </div>
              {/* )} */}

              <img
                alt=""
                className="calendar"
                onClick={openCalendarEndDate}
                src={calendar}
              />
              {/* </FormItem> */}
              {/* </div> */}
            </div>
          )}
        </div>

        {
          <Fragment>
            <div className="flex justify-content-space-between">
              {/* <FormItem label={formatMessage(messages.from)}>
            {getFieldDecorator(START_TIME, {
              rules: []
            })( */}
              <div className="full-width">
                <div className="label-color fontsize12">
                  {`${
                    eventMode === EVENT_TYPE.APPOINTMENT
                      ? formatMessage(messages.from)
                      : formatMessage(messages.at)
                  }`}
                </div>
                <TimePicker
                  allowClear={false}
                  disabled={disabledDateAndTime}
                  className={`${
                    eventStartTimeError === true ? "has-error" : ""
                  }`}
                  use12Hours
                  format="h:mm A"
                  suffixIcon={null}
                  style={{ width: "100%" }}
                  value={moment(eventStartTime)}
                  onChange={onChangeEventStartTime}
                  getPopupContainer={this.getParentNode}
                />
              </div>
              {/* )}
          </FormItem> */}

              {/* <FormItem label={formatMessage(messages.till)}>
            {getFieldDecorator(END_TIME, {
              rules: [],
              initialValue: event.end
            })( */}
              {eventMode === EVENT_TYPE.APPOINTMENT && (
                <div className="full-width ml16">
                  <div className="label-color fontsize12">
                    {formatMessage(messages.till)}
                  </div>
                  <TimePicker
                    className={`${
                      eventEndTimeError === true ? "has-error" : ""
                    }`}
                    allowClear={false}
                    disabled={disabledDateAndTime}
                    use12Hours
                    format="h:mm A"
                    style={{ width: "100%" }}
                    suffixIcon={null}
                    value={moment(eventEndTime)}
                    onChange={onChangeEventEndTime}
                    getPopupContainer={this.getParentNode}
                  />
                </div>
              )}
              {/* )}
          </FormItem> */}
            </div>
            {eventMode === EVENT_TYPE.APPOINTMENT &&
              !eventEndTimeError &&
              !eventStartTimeError && (
                <div className="full-width dark tar mt4">{eventDuration}</div>
              )}
            {eventEndTimeError === true && (
              <div className="full-width warning-color tar mt4 fontsize12">
                End time cannot be less than and equal Start time
              </div>
            )}
            {eventStartTimeError === true && (
              <div className="full-width warning-color tar mt4 fontsize12">
                You can't create events on passed time.
              </div>
            )}
          </Fragment>
        }
        {
          <FormItem className="mt16">
            {getFieldDecorator(NOTES, {
              rules: [],
              initialValue: notes
            })(
              <TextArea placeholder={formatMessage(messages.notes)} autosize />
            )}
          </FormItem>
        }
        <div className="footer">
          <div className="flex align-items-center justify-content-end h100 mr24">
            <Button className="iqvia-btn cancel mr16" onClick={handleCancel}>
              {formatMessage(messages.cancel)}
            </Button>
            <FormItem className="m0">
              <Button
                className="iqvia-btn"
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={
                  hasErrors(getFieldsError()) ||
                  eventEndTimeError ||
                  eventStartTimeError
                }
              >
                {purpose
                  ? "Save"
                  : eventMode === EVENT_TYPE.APPOINTMENT
                  ? formatMessage(messages.addAppointment)
                  : formatMessage(messages.addReminder)}
              </Button>
            </FormItem>
          </div>
        </div>
      </Form>
    );
  }
}

export default injectIntl(AddAppointment);
