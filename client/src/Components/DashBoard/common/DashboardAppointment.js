import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import dateFns from "date-fns";
import AppointmentCard from "../../../Containers/cards/appointment";
import messages from "../message";
import { Icon } from "antd";
import "./style.less";
import {
  DASHBOARD_MENU,
  USER_CATEGORY,
  EVENT_TYPE,
  EVENT
} from "../../../constant";

class DashboardAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      selectedDate: new Date()
    };
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  componentDidMount() {
    this.getCurrentWeek();
    this.timer = setInterval(() => this.pollItems(), 5000);
  }

  async pollItems() {
    const { pollEventsData, events: { lastUpdatedAt } = {} } = this.props;
    const lastUpdatedOld = lastUpdatedAt;
    await pollEventsData().then(result => {
      const lastUpdatedNew = this.props.events.lastUpdatedAt;
      if (dateFns.isAfter(lastUpdatedNew, lastUpdatedOld)) {
        this.getCurrentWeek();
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  handleUpdateVital = id => {
    const {
      auth: { authenticated_user: auth_user } = {},
      users = {}
    } = this.props;
    const { basicInfo = {} } = users[auth_user];
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
    const {
      auth: { authenticated_user: auth_user } = {},
      users = {}
    } = this.props;
    const { basicInfo = {} } = users[auth_user];
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
    const {
      auth: { authenticated_user: auth_user } = {},
      users = {}
    } = this.props;
    const { basicInfo = {} } = users[auth_user];
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

  getCurrentWeek = () => {
    const { currentDate } = this.state;
    const weekStart = dateFns.format(
      dateFns.startOfWeek(currentDate),
      "YYYY-MM-DD"
    );
    const weekEnd = dateFns.format(
      dateFns.endOfWeek(currentDate),
      "YYYY-MM-DD"
    );
    const {
      auth: { authenticated_user: userId }
    } = this.props;
    this.props.fetchEventsData(userId, weekStart, weekEnd);
  };

  prevWeek = () => {
    this.setState(
      (prevState, props) => {
        return {
          currentDate: dateFns.subWeeks(prevState.currentDate, 1),
          selectedDate: dateFns.startOfWeek(
            dateFns.subWeeks(prevState.currentDate, 1)
          )
        };
      },
      () => {
        this.getCurrentWeek();
      }
    );
  };

  nextWeek = () => {
    this.setState(
      (prevState, props) => {
        return {
          currentDate: dateFns.addWeeks(prevState.currentDate, 1),
          selectedDate: dateFns.startOfWeek(
            dateFns.addWeeks(prevState.currentDate, 1)
          )
        };
      },
      () => {
        this.getCurrentWeek();
      }
    );
  };

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };

  goToCalendarDashboard = () => {
    const { setTabDashboard } = this.props;
    setTabDashboard(DASHBOARD_MENU.CALENDAR, { show: "appointments" });
  };

  renderHeader() {
    const { formatMessage } = this;
    return (
      <div className="appointment-header">
        <div className="header-title">
          {formatMessage(messages.dashboardAppointments)}
        </div>
      </div>
    );
  }

  renderDays() {
    const dayFormat = "dd";
    const days = [];

    let startDate = dateFns.startOfWeek(this.state.currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center pointer" key={i}>
          {dateFns
            .format(dateFns.addDays(startDate, i), dayFormat)
            .slice(0, -1)}
        </div>
      );
    }
    return <div className="dashboard-days dashboard-row">{days}</div>;
  }

  renderDates() {
    const dateFormat = "D";
    const dates = [];
    const { selectedDate, currentDate } = this.state;

    const startDate = dateFns.startOfWeek(currentDate);
    let day = startDate;

    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      dates.push(
        <div
          className={`week-dates ${
            dateFns.isToday(cloneDay)
              ? "isSelected"
              : dateFns.isSameDay(cloneDay, selectedDate)
              ? "isFadeSelected"
              : ""
          }`}
          key={i}
          onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
        >
          {dateFns.format(cloneDay, dateFormat)}
        </div>
      );

      day = dateFns.addDays(day, 1);
    }
    return (
      <div className="date-section">
        <div className="dashboard-dates">
          <Icon
            className="dashboard-icons"
            type="left"
            onClick={this.prevWeek}
          />
          <div className="dates-row clickable">{dates}</div>
          <Icon
            className="dashboard-icons"
            type="right"
            onClick={this.nextWeek}
          />
        </div>
      </div>
    );
  }

  renderEvents() {
    const { selectedDate, currentDate } = this.state;

    const {
      events: { events = {}, scheduleEventListByDate = {} } = {},
      auth: { authenticated_user: currentUserId }
    } = this.props;
    const today = dateFns.format(selectedDate, "YYYY-MM-DD");
    const weekStart = dateFns.format(
      dateFns.startOfWeek(currentDate),
      "YYYY-MM-DD"
    );
    const weekEnd = dateFns.format(
      dateFns.endOfWeek(currentDate),
      "YYYY-MM-DD"
    );

    let eventsData = [];
    if (scheduleEventListByDate) {
      const currentDate = scheduleEventListByDate[today] || [];
      let count = 0;
      currentDate.forEach(id => {
        if (count === 4) {
          return false;
        }
        if (events[id] && events[id].eventType === EVENT_TYPE.APPOINTMENT) {
          count++;
          const event = events[id];
          event.calendarStartingDate = weekStart;
          event.calendarEndingDate = weekEnd;
          eventsData.push(events[id]);
        }
      });
    }

    let options = [];
    eventsData.forEach(event => {
      const { id } = event;

      const card =
        event.eventType === EVENT_TYPE.APPOINTMENT ? (
          <AppointmentCard
            id={id}
            calendarUserId={currentUserId}
            modal={true}
          />
        ) : null;

      if (card !== null) {
        options.push(
          <Fragment key={event.id}>
            <div className="black pb10 pt10 fontsize16">{card}</div>
          </Fragment>
        );
      }
    });

    return <div className="card-wrapper">{options}</div>;
  }

  renderCurrentSelectedDate() {
    const fullDateFormat = "ddd, D MMM YYYY";
    const { selectedDate } = this.state;
    return (
      <div className="date-display">
        {dateFns.isToday(selectedDate) && (
          <div className="today">
            <div>Today </div>
            <div className="dot silver ml2 mr2" />
          </div>
        )}
        {dateFns.format(selectedDate, fullDateFormat)}
      </div>
    );
  }

  renderDateDots = cloneDay => {
    const dots = [];
    const { selectedDate } = this.state;
    const isVisible = !dateFns.isSameDay(cloneDay, selectedDate);
    const {
      events: { events = {}, scheduleEventListByDate = {} } = {}
    } = this.props;
    cloneDay = dateFns.format(cloneDay, "YYYY-MM-DD");

    if (scheduleEventListByDate) {
      const currentDate = scheduleEventListByDate[cloneDay] || [];
      let count = 0;
      currentDate.forEach(id => {
        if (count === 4) {
          return false;
        }
        const event = events[id];
        if (event.eventType === EVENT_TYPE.APPOINTMENT) {
          count++;
          if (event.status === EVENT.STATUS.COMPLETED) {
            dots.push(
              <div
                key={event.id}
                className={`dot silver ml2 mr2 ${isVisible ? "" : "invisble"}`}
              />
            );
          } else if (event.status === EVENT.STATUS.PASSED) {
            dots.push(
              <div
                key={event.id}
                className={`dot orange ml2 mr2 ${isVisible ? "" : "invisble"}`}
              />
            );
          } else {
            dots.push(
              <div
                key={event.id}
                className={`dot dark ml2 mr2 ${isVisible ? "" : "invisble"}`}
              />
            );
          }
        }
      });
    }
    return dots;
  };

  renderDots() {
    const dots = [];
    const { currentDate } = this.state;

    const startDate = dateFns.startOfWeek(currentDate);
    let day = startDate;

    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      dots.push(
        <div
          className="week-dots "
          key={i}
          onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
        >
          {!dateFns.isToday(cloneDay) ? this.renderDateDots(cloneDay) : null}
          {/* {this.renderDateDots(cloneDay)} */}
        </div>
      );
      day = dateFns.addDays(day, 1);
    }
    return (
      <Fragment>
        <div className="dots-wrapper">{dots}</div>
        <div>
          <hr className="line" />
        </div>
      </Fragment>
    );
  }

  render() {
    const { formatMessage } = this;
    return (
      <Fragment>
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderDates()}
        {this.renderDots()}
        {this.renderCurrentSelectedDate()}
        {this.renderEvents()}
        <div className="flex align-items-center justify-content-end">
          <div
            className="header-sub-title clickable"
            onClick={this.goToCalendarDashboard}
          >
            {formatMessage(messages.dashboardViewAll)}
          </div>
        </div>
      </Fragment>
    );
  }
}
export default injectIntl(DashboardAppointment);
