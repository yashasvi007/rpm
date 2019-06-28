import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import dateFns from "date-fns";
import { Button, Checkbox, Icon, Modal, Select } from "antd";
import filter from "lodash-es/filter";
import { monthsShort } from "moment";
import "./style.less";
import messages from "./messages";
import { EVENT, EVENT_TYPE, USER_CATEGORY } from "../../../constant";
import ReminderCard from "../../Containers/Cards/reminder";
import AppointmentCard from "../../Containers/Cards/appointment";
import dropDown from "../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import Cell from "./cell";
import config from "../../../config";

const dropdownIcon = <img alt="" src={dropDown} />;
const Option = Select.Option;

class Calendar extends Component {
  constructor(props) {
    super(props);
    const show = props.show;
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
    this.fetchEventsAgain();
    this.timer = setInterval(() => this.pollItems(), 5000);
  }

  formatMessage = data => this.props.intl.formatMessage(data);

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
    this.props.fetchEventsData(
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
    let monthsData = monthsShort();
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
    const { showAppointment, showReminder } = this.state;
    const {
      onChangeAppointmentStatus,
      onChangeReminderStatus,
      formatMessage
    } = this;

    return (
      <div className="calendar-header background-gray">
        <div className="calendar-header-top">
          <div className="left">
            {config.CALENDAR_SYNC === true && (
              <Button className="sync-btn">
                {formatMessage(messages.syncCalendar)}
              </Button>
            )}
          </div>
          <div className="right">
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
          </div>
        </div>
        <div className="calendar-header-bottom">
          <div className="show">{formatMessage(messages.show)}</div>
          <Checkbox
            className={"calendar_sync_line settings-checkbox"}
            checked={showAppointment}
            onChange={onChangeAppointmentStatus}
          >
            <span className="fontsize14 medium dark">
              {formatMessage(messages.appointments)}
            </span>
          </Checkbox>
          <Checkbox
            className={"calendar_sync_line settings-checkbox"}
            checked={showReminder}
            onChange={onChangeReminderStatus}
          >
            <span className="fontsize14 medium  dark">
              {formatMessage(messages.reminder)}
            </span>
          </Checkbox>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="days" key={i}>
          {dateFns
            .format(dateFns.addDays(startDate, i), dateFormat)
            .slice(0, -1)}
        </div>
      );
    }
    return (
      <div className="calendar-row border-bottom background-gray">{days}</div>
    );
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    const {
      events: { scheduleEventListByDate: scheduleEventList, events } = {}
    } = this.props;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const eventData = [];
        const today = dateFns.format(day, "YYYY-MM-DD");
        const { showAppointment, showReminder } = this.state;
        if (scheduleEventList) {
          const currentDateEvents = scheduleEventList[today] || [];
          if (currentDateEvents.length > 0) {
            currentDateEvents.forEach(id => {
              const event = events[id];
              if (event) {
                if (showAppointment && showReminder) {
                  eventData.push(events[id]);
                } else if (showAppointment && !showReminder) {
                  if (event.eventType === EVENT_TYPE.APPOINTMENT) {
                    eventData.push(events[id]);
                  }
                } else if (showReminder && !showAppointment) {
                  if (event.eventType === EVENT_TYPE.REMINDER) {
                    eventData.push(events[id]);
                  }
                }
              }
            });
          }
        }
        const cloneDay = day;
        const disableDate =
          dateFns.isBefore(cloneDay, monthStart) ||
          dateFns.isAfter(cloneDay, monthEnd);

        days.push(
          <Cell
            key={cloneDay}
            date={cloneDay}
            events={eventData}
            onDateClick={this.onDateClick}
            isSelected={dateFns.isSameDay(cloneDay, selectedDate)}
            disabled={disableDate}
          />
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="calendar-row white tall" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  }

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

  renderDateAndLine = () => {
    const { selectedDate } = this.state;
    return (
      <div className="date-and-line">
        {dateFns.format(selectedDate, "DD MMM YYYY")}
      </div>
    );
  };

  renderEvents() {
    const { selectedDate, showAppointment, showReminder } = this.state;
    const {
      events: { events = {}, scheduleEventListByDate = {} } = {},
      calendarUserId
    } = this.props;
    const today = dateFns.format(selectedDate, "YYYY-MM-DD");
    let eventsData = [];
    if (scheduleEventListByDate) {
      const currentDate = scheduleEventListByDate[today] || [];
      currentDate.forEach(id => {
        if (events[id]) {
          const event = events[id];
          eventsData.push(event);
        }
      });
    }
    let options = [];
    eventsData.forEach(event => {
      const { id } = event;
      const card =
        event.eventType === EVENT_TYPE.REMINDER && showReminder ? (
          <ReminderCard id={id} calendarUserId={calendarUserId} modal={true} />
        ) : showAppointment && event.eventType === EVENT_TYPE.APPOINTMENT ? (
          <AppointmentCard
            id={id}
            calendarUserId={calendarUserId}
            modal={true}
          />
        ) : null;

      if (card !== null) {
        options.push(
          <Fragment key={event.id}>
            <div className="black pr16 fontsize16">{card}</div>
          </Fragment>
        );
      }
    });

    return <div className="mobile-card-wrapper hide-scroll">{options}</div>;
  }

  render() {
    return (
      <div className="m calendar-full">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
        {this.renderDateAndLine()}
        {this.renderEvents()}
      </div>
    );
  }
}

export default injectIntl(Calendar);
