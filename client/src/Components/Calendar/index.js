import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import dateFns from "date-fns";
import { Select, Icon, Button, Modal, Checkbox } from "antd";
import filter from "lodash-es/filter";
import { monthsShort } from "moment";
import "./style.less";
import { EVENT, EVENT_TYPE } from "../../constant";

import CommonSuccessMsg from "../../Containers/CommonSuccessMsg";
import CalendarCard from "../../Containers/cards/appointment";
import ReminderCard from "../../Containers/cards/reminder";
import dropDown from "../../Assets/images/material-icons-black-arrow-drop-down.svg";

import visit from "../../Assets/images/calendar/ico-location-flat.png";
import visitInactive from "../../Assets/images/calendar/ico-location-flat-inactive.png";
import video from "../../Assets/images/calendar/ico-video-flat.png";
import videoInactive from "../../Assets/images/calendar/ico-video-flat-inactive.png";
import call from "../../Assets/images/calendar/ico-phone-flat.svg";
import callInactive from "../../Assets/images/calendar/ico-phone-flat-inactive.png";
import email from "../../Assets/images/calendar/ico-phone-flat-inactive.png";
import emailInactive from "../../Assets/images/calendar/ico-phone-flat-inactive.png";
import reminder from "../../Assets/images/calendar/ico-reminder-flat.svg";
import config from "../../config";
import { USER_CATEGORY } from "../../constant";

const dropdownIcon = <img alt="" src={dropDown} />;
const visitIcon = <img className="icon-images" alt="" src={visit} />;
const visitIconInactive = (
  <img className="icon-images" alt="" src={visitInactive} />
);
const videoIcon = <img className="icon-images" alt="" src={video} />;
const videoIconInactive = (
  <img className="icon-images" alt="" src={videoInactive} />
);
const callIcon = <img className="icon-images" alt="" src={call} />;
const callIconInactive = (
  <img className="icon-images" alt="" src={callInactive} />
);
const emailIcon = <img className="icon-images" alt="" src={email} />;
const emailIconInactive = (
  <img className="icon-images" alt="" src={emailInactive} />
);

const reminderIcon = <img className="icon-images" alt="" src={reminder} />;

const Option = Select.Option;

const Hover = ({
  className,
  onHover,
  children,
  shiftLeft,
  shiftTop,
  isReminder
}) => (
  <span className={`hover ${className}`}>
    <div className="hover__no-hover">{children}</div>
    <div
      className={`hover__hover ${shiftLeft ? "change-to-right" : ""}
      ${
        shiftTop
          ? `${
              isReminder
                ? "change-to-top-reminder"
                : "change-to-top-appointment"
            }`
          : ""
      }`}
    >
      {onHover}
    </div>
  </span>
);

class Calendar extends Component {
  constructor(props) {
    super(props);
    const show = props.match.params ? props.match.params.show : "all";
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date(),
      visible: false,
      cardClicked: false,
      modalVisible: false,
      showReminder: show !== "appointments",
      showAppointment: show !== "reminders"
    };
    this.fetchEventsAgain = this.fetchEventsAgain.bind(this);
  }

  componentDidMount() {
    const params = this.props.match.params;
    if (params.show) {
      const show = params.show;
      if (show === "appointments") {
        this.setState({
          showAppointment: true,
          showReminder: false
        });
      } else if (show === "reminders") {
        this.setState({
          showAppointment: false,
          showReminder: true
        });
      }
    }
    this.fetchEventsAgain();
    this.timer = setInterval(() => this.pollItems(), 5000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id !== this.props.id) {
      this.fetchEventsAgain();
    }
  }

  async pollItems() {
    const { pollEventsData, events: { lastUpdatedAt } = {} } = this.props;
    const lastUpdatedOld = lastUpdatedAt;
    await pollEventsData().then(result => {
      const lastUpdatedNew = this.props.events.lastUpdatedAt;
      if (dateFns.isAfter(lastUpdatedNew, lastUpdatedOld)) {
        this.fetchEventsAgain();
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  fetchEventsAgain = () => {
    const { currentMonth } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);
    const {
      myCalendar,
      auth,
      match: { params: { id } = {} } = {}
    } = this.props;
    const userId = myCalendar ? auth : id || "";

    this.props.fetchEventsData(
      userId,
      dateFns.format(startDate, "YYYY-MM-DD"),
      dateFns.format(endDate, "YYYY-MM-DD")
    );
  };

  changeMonth = value => {
    const date = JSON.parse(value);
    const currentYear = dateFns.getYear(this.state.currentMonth);
    const newDate = new Date(currentYear, parseInt(date.month), 1);
    this.setState(
      {
        currentMonth: newDate,
        selectedDate: newDate
      },
      this.fetchEventsAgain
    );
  };

  getMonthsData = () => {
    let monthsData = [];
    monthsData = monthsShort();
    const currentYear = dateFns.getYear(this.state.currentMonth);
    let options = [];

    for (const index in monthsData) {
      const month = monthsData[index];
      const date = { month: index, year: currentYear };
      options.push(
        <Option key={index} value={JSON.stringify(date)}>
          {month + " " + currentYear}
        </Option>
      );
    }

    return options;
  };

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };

  nextMonth = () => {
    this.setState(
      {
        currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
      },
      function() {
        const newDate = new Date(
          dateFns.getYear(this.state.currentMonth),
          dateFns.getMonth(this.state.currentMonth),
          1
        );
        this.setState(
          {
            selectedDate: newDate
          },
          this.fetchEventsAgain
        );
        //this.renderHeader();
      }
    );
  };

  prevMonth = () => {
    this.setState(
      {
        currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
      },
      function() {
        const newDate = new Date(
          dateFns.getYear(this.state.currentMonth),
          dateFns.getMonth(this.state.currentMonth),
          1
        );
        this.setState(
          {
            selectedDate: newDate
          },
          this.fetchEventsAgain
        );
        //this.renderHeader();
      }
    );
  };

  onChangeReminderStatus = e => {
    this.setState({ showReminder: e.target.checked });
  };

  onChangeAppointmentStatus = e => {
    this.setState({ showAppointment: e.target.checked });
  };

  renderHeader() {
    const dateFormat = "MMM YYYY";
    const { myCalendar = false } = this.props;
    const { showAppointment, showReminder } = this.state;
    const { onChangeAppointmentStatus, onChangeReminderStatus } = this;

    return (
      <div
        className={`calendar-header flex ${
          myCalendar === true
            ? "justify-content-space-between"
            : "justify-content-end"
        }`}
      >
        {myCalendar && (
          <span className="calendar-header-left">
            {config.CALENDAR_SYNC === true && (
              <Button className={"sync-btn "}>Sync Calendar</Button>
            )}
            <span style={{ color: "#7f888d", padding: "0px 5px 0px 15px" }}>
              Show
            </span>
            <Checkbox
              className={"calendar_sync_line settings-checkbox"}
              checked={showAppointment}
              onChange={onChangeAppointmentStatus}
            >
              <span className="fontsize14 medium dark">Appointments</span>
            </Checkbox>
            <Checkbox
              className={"calendar_sync_line settings-checkbox"}
              checked={showReminder}
              onChange={onChangeReminderStatus}
            >
              <span className="fontsize14 medium  dark">Reminder</span>
            </Checkbox>
          </span>
        )}

        <span className="calendar-header-right">
          <Select
            defaultValue={dateFns.format(this.state.currentMonth, dateFormat)}
            className={"month-dropdown"}
            suffixIcon={dropdownIcon}
            onChange={this.changeMonth}
            value={dateFns.format(this.state.currentMonth, dateFormat)}
          >
            {this.getMonthsData()}
          </Select>

          <Icon
            className="mr10 ml20 clickable"
            type="left"
            onClick={this.prevMonth}
          />
          <Icon
            className="mr10 clickable"
            type="right"
            onClick={this.nextMonth}
          />
        </span>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns
            .format(dateFns.addDays(startDate, i), dateFormat)
            .slice(0, -1)}
        </div>
      );
    }
    return <div className="days calendar-row">{days}</div>;
  }

  getExtrasCount(events) {
    const { showAppointment, showReminder } = this.state;
    const appointments = filter(events, function(event) {
      return event.eventType === EVENT_TYPE.APPOINTMENT;
    });
    const reminders = filter(events, function(event) {
      return event.eventType === EVENT_TYPE.REMINDER;
    });

    if (showAppointment && showReminder) {
      const number = events.length - 2;
      return number > 0 ? `+ ${number}` : null;
    } else if (showAppointment && !showReminder) {
      const number = appointments.length - 2;
      return number > 0 ? `+ ${number}` : null;
    } else if (showReminder && !showAppointment) {
      const number = reminders.length - 2;
      return number > 0 ? `+ ${number}` : null;
    } else {
      return null;
    }
  }

  renderCells() {
    const { currentMonth } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    const {
      events: { scheduleEventListByDate: scheduleEventList, events } = {}
    } = this.props;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        let dateMatch = false;
        const eventData = [];
        const today = dateFns.format(day, "YYYY-MM-DD");
        formattedDate = dateFns.format(day, dateFormat);
        if (scheduleEventList) {
          const currentDate = scheduleEventList[today] || [];
          if (currentDate.length > 0) {
            dateMatch = true;
            currentDate.forEach(id => {
              const event = events[id];
              if (event) {
                eventData.push(events[id]);
              }
            });
          }
        }
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart) ? "disabled" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <div
              className={`circle ${
                dateFns.isToday(day) ? "isHighligted" : ""
                // : dateFns.isSameDay(day, selectedDate)
                // ? "isFadeHighligted"
                // : ""
                //Uncomment for fade highlighting of date on change of month
              }`}
            >
              <span className="number-text">{formattedDate}</span>
            </div>
            <div className="extra-events" onClick={this.toggleModal}>
              {dateMatch ? this.getExtrasCount(eventData) : ""}
              {/* {eventData.length - 2 >= 1 && dateMatch
                ? "+" + (eventData.length - 2)
                : ""} */}
            </div>
            <div>{dateMatch ? this.renderEvents(eventData) : ""}</div>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="calendar-row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  renderEventIcon = (activityMode, status) => {
    switch (activityMode) {
      case EVENT.ACTIVITY_MODE.CALL:
        return status === EVENT.STATUS.PASSED ? callIconInactive : callIcon;
      case EVENT.ACTIVITY_MODE.VISIT:
        return status === EVENT.STATUS.PASSED ? visitIconInactive : visitIcon;
      case EVENT.ACTIVITY_MODE.CHAT:
        return status === EVENT.STATUS.PASSED ? videoIconInactive : videoIcon;
      case EVENT.ACTIVITY_MODE.VIDEO:
        return status === EVENT.STATUS.PASSED ? emailIconInactive : emailIcon;
      default:
        return reminderIcon;
    }
  };

  handleUpdateVital = id => {
    const { auth, users = {} } = this.props;
    const { basicInfo = {} } = users[auth] || {};
    const { category = "" } = basicInfo;

    if (category === USER_CATEGORY.CARE_COACH) {
      this.props.history.push({
        pathname: `/patient/${id}/Medical-Details`,
        state: { currentMedicalField: "Vital" }
      });
    } else if (category === USER_CATEGORY.PATIENT) {
      this.props.history.push("/medicals/Vital");
    }
  };

  handleUpdateClinicalReading = id => {
    const { auth, users = {} } = this.props;
    const { basicInfo = {} } = users[auth] || {};
    const { category = "" } = basicInfo;

    if (category === USER_CATEGORY.CARE_COACH) {
      this.props.history.push({
        pathname: `/patient/${id}/Medical-Details`,
        state: {
          currentMedicalField: "Clinical-Reading"
        }
      });
    } else if (category === USER_CATEGORY.PATIENT) {
      this.props.history.push("/medicals/Clinical-Reading");
    }
  };

  handleUpdateMedication = id => {
    const { auth, users = {} } = this.props;
    const { basicInfo = {} } = users[auth] || {};
    const { category = "" } = basicInfo;

    if (category === USER_CATEGORY.CARE_COACH) {
      this.props.history.push({
        pathname: `/patient/${id}/Medical-Details`,
        state: {
          currentMedicalField: "Medication"
        }
      });
    } else if (category === USER_CATEGORY.PATIENT) {
      this.props.history.push("/medicals/Medication");
    }
  };

  renderEvents(events) {
    let format = [];
    let count = 0;
    const { showAppointment, showReminder } = this.state;

    let eventsData = [];
    if (showAppointment && !showReminder) {
      const appointments = filter(events, function(event) {
        return event.eventType === EVENT_TYPE.APPOINTMENT;
      });
      eventsData = appointments;
    } else if (showReminder && !showAppointment) {
      const reminders = filter(events, function(event) {
        return event.eventType === EVENT_TYPE.REMINDER;
      });
      eventsData = reminders;
    } else {
      eventsData = events;
    }
    eventsData.forEach(event => {
      const { id: key } = event;
      if (count === 2) {
        return format;
      } else {
        count++;
      }
      const startTime = dateFns.format(
        dateFns.parse(event.startTime),
        "h:mm A"
      );
      const activityMode = event.data.activityMode;
      const status = event.status;

      // const difference =
      //   event.startTime && event.endTime
      //     ? this.getDifference(event.startTime, event.endTime)
      //     : null;

      const isPassed = status === EVENT.STATUS.COMPLETED;
      const day = dateFns.getDay(event.startTime);

      const { currentMonth } = this.state;
      const monthEnd = dateFns.endOfMonth(currentMonth);
      const endDate = dateFns.endOfWeek(monthEnd);

      const shiftTop = dateFns.isAfter(
        event.startTime,
        dateFns.subWeeks(dateFns.addDays(endDate, 1), 2)
      );
      const shiftLeft = day > 3;
      const isReminder = event.eventType === EVENT_TYPE.REMINDER;
      const className = isPassed
        ? "calendar-date event-passed"
        : "calendar-date";

      const eventIcon = this.renderEventIcon(activityMode, status);

      const {
        myCalendar,
        auth,
        match: { params: { id } = {} } = {}
      } = this.props;
      const calendarUserId = myCalendar ? auth : id || "";
      const { showAppointment, showReminder } = this.state;
      const card =
        event.eventType === EVENT_TYPE.REMINDER && showReminder ? (
          <ReminderCard id={key} calendarUserId={calendarUserId} />
        ) : showAppointment && event.eventType === EVENT_TYPE.APPOINTMENT ? (
          <CalendarCard id={key} calendarUserId={calendarUserId} />
        ) : null;
      if (card !== null && startTime !== "Invalid Date") {
        format.push(
          <span key={key}>
            <Hover
              className={className}
              onHover={card}
              shiftLeft={shiftLeft}
              shiftTop={shiftTop}
              isReminder={isReminder}
            >
              {eventIcon}
              <span>
                {startTime}
                {/* {event.eventType === EVENT_TYPE.REMINDER ? " " : ", "}
                {difference
                  ? difference.slice(-1) === "n"
                    ? difference.slice(0, -2)
                    : difference
                  : ""} */}
              </span>
            </Hover>
          </span>
        );
      }
    });
    return format;
  }

  handleOk = e => {
    this.setState({
      modalVisible: false
    });
  };

  handleCancel = e => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
    this.setState({
      modalVisible: false
    });
  };

  toggleModal = () => {
    this.setState(
      {
        modalVisible: true
      },
      () => this.openEventModal()
    );
  };

  openEventModal = () => {
    const {
      modalVisible,
      selectedDate,
      showAppointment,
      showReminder
    } = this.state;
    const {
      events: { events = {}, scheduleEventListByDate = {} } = {},
      handleModalVisible
    } = this.props;
    const today = dateFns.format(selectedDate, "YYYY-MM-DD");
    if (modalVisible) {
      handleModalVisible(true);
    }
    let eventsData = [];
    if (scheduleEventListByDate) {
      const currentDate = scheduleEventListByDate[today] || [];
      currentDate.forEach(id => {
        eventsData.push(events[id]);
      });
    }

    let options = [];
    eventsData.forEach(event => {
      const {
        myCalendar = false,
        auth,
        match: { params: { id: cal_user } = {} } = {}
      } = this.props;
      const calendarUserId = myCalendar ? auth : cal_user || "";
      const { id } = event;

      const card =
        event.eventType === EVENT_TYPE.REMINDER && showReminder ? (
          <ReminderCard id={id} calendarUserId={calendarUserId} />
        ) : showAppointment && event.eventType === EVENT_TYPE.APPOINTMENT ? (
          <CalendarCard id={id} calendarUserId={calendarUserId} />
        ) : null;

      if (card !== null) {
        options.push(
          <Fragment key={event.id}>
            <div className="black fontsize16 pl48 pb16 pr24 mt16">{card}</div>
          </Fragment>
        );
      }
    });

    const titleDate = dateFns.format(selectedDate, "DD/MM/YYYY");
    const title =
      showAppointment && showReminder
        ? "Appointments/Reminders on "
        : showAppointment && !showReminder
        ? "Appointments on "
        : "Reminders on ";

    return (
      modalVisible && (
        <Modal
          key={today}
          zIndex={200}
          title={title + titleDate}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrapClassName={"global-modal full-height calendar-modals"}
          footer={null}
          destroyOnClose={true}
          bodyStyle={{ paddingBottom: "40px" }}
          {...this.props}
        >
          {options}
          <CommonSuccessMsg className={"dashboard-success-msg"} />
        </Modal>
      )
    );
  };

  render() {
    return (
      <div className="calendar-full">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
        {this.openEventModal()}
      </div>
    );
  }
}

//export default Calendar;
export default injectIntl(Calendar);
