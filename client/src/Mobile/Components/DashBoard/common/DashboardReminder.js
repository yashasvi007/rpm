import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import dateFns from "date-fns";
import forEach from "lodash-es/forEach";
import pickBy from "lodash-es/pickBy";
import ReminderCard from "../../../Containers/Cards/reminder";
import messages from "../message";
import { Menu } from "antd";
import "./style.less";
import { DASHBOARD_MENU, EVENT_TYPE } from "../../../../constant";

const MenuItem = Menu.Item;
const OneTime = "oneTime";
const Repeating = "repeating";

class DashboardReminder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      selectedDate: new Date(),
      selectedMenu: OneTime
    };
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  componentDidMount() {}

  goToCalendarDashboard = () => {
    const { setTabDashboard } = this.props;
    setTabDashboard(DASHBOARD_MENU.CALENDAR, { show: "reminders" });
  };

  renderHeader() {
    const { formatMessage } = this;
    return (
      <div className="appointment-header">
        <div className="header-title">
          {formatMessage(messages.dashboardReminders)}
        </div>
        <div
          className="header-sub-title clickable"
          onClick={this.goToCalendarDashboard}
        >
          {formatMessage(messages.dashboardViewAll)}
        </div>
      </div>
    );
  }

  selectMenu = item => {
    if (item.key === Repeating) {
      this.setState({ selectedMenu: Repeating });
    } else if (item.key === OneTime) {
      this.setState({ selectedMenu: OneTime });
    }
  };

  renderMenu() {
    return (
      <div className="reminder-menu">
        <Menu
          className="black"
          onSelect={this.selectMenu}
          mode="horizontal"
          defaultSelectedKeys={[OneTime]}
        >
          <MenuItem key={OneTime}>One-Time</MenuItem>
          <MenuItem key={Repeating}>Repeating</MenuItem>
        </Menu>
      </div>
    );
  }

  renderEventsDates = selectedDate => {
    const fullDateFormat = "ddd, D MMM YYYY";
    return (
      <div className="date-display">
        {dateFns.isToday(selectedDate) && (
          <div className="today">
            <div>Today </div>
            <div className="dot silver" />
          </div>
        )}
        {dateFns.format(selectedDate, fullDateFormat)}
      </div>
    );
  };

  filterOneTimeEvents() {
    const { events: { events = {} } = {} } = this.props;
    const eventsData = pickBy(events, function(event) {
      return (
        event.eventType === EVENT_TYPE.REMINDER && event.data.repeat === "none"
      );
    });
    return this.pickRemindersByDate(eventsData);
  }

  filterRepeatingEvents() {
    const { events: { events = {} } = {} } = this.props;
    const eventsData = pickBy(events, function(event) {
      return (
        event.eventType === EVENT_TYPE.REMINDER && event.data.repeat !== "none"
      );
    });
    return this.pickRemindersByDate(eventsData);
  }

  pickRemindersByDate(events) {
    const { events: { scheduleEventListByDate = {} } = {} } = this.props;
    let options = [];
    let count = 0;
    const orderedScheduleEventListByDate = {};
    Object.keys(scheduleEventListByDate)
      .sort()
      .forEach(function(key) {
        orderedScheduleEventListByDate[key] = scheduleEventListByDate[key];
      });

    if (orderedScheduleEventListByDate) {
      for (const date in orderedScheduleEventListByDate) {
        let eventsData = [];
        const ids = orderedScheduleEventListByDate[date];
        //eslint-disable-next-line
        forEach(ids, id => {
          if (count === 4) {
            return false;
          }
          if (events[id]) {
            count++;
            eventsData.push(events[id]);
          }
        });
        options.push(this.renderEvents(eventsData, date));
      }
    }
    return options;
  }

  renderEvents(eventsData, date) {
    const {
      auth: { authenticated_user: currentUserId }
    } = this.props;
    let options = [];
    let count = 0;
    forEach(eventsData, event => {
      const { id } = event;
      if (count === 4) {
        return false;
      }
      count++;

      const card = (
        <ReminderCard id={id} calendarUserId={currentUserId} modal={true} />
      );
      options.push(
        <Fragment key={event.id}>
          <div className="black pb10 pt10 fontsize16">{card}</div>
        </Fragment>
      );
    });
    return (
      <Fragment key={date}>
        {eventsData && eventsData.length !== 0 && this.renderEventsDates(date)}
        <div className="mobile-card-wrapper hide-scroll">{options}</div>
      </Fragment>
    );
  }

  render() {
    const { selectedMenu } = this.state;
    const { formatMessage } = this;

    return (
      <Fragment>
        {this.renderHeader()}
        {this.renderMenu()}
        {selectedMenu === OneTime && this.filterOneTimeEvents()}
        {selectedMenu === Repeating && this.filterRepeatingEvents()}
        {this.renderEvents()}
      </Fragment>
    );
  }
}
export default injectIntl(DashboardReminder);
