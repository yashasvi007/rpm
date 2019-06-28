import React, { Fragment, Component } from "react";
import dateFns from "date-fns";
import { Timeline, Avatar, Icon } from "antd";
import "./styles.less";
import { EVENT, USER_CATEGORY } from "../../../constant";

import visit from "../../../Assets/images/calendar/ico-visit-activity-flat-clr.png";
import visitMissed from "../../../Assets/images/calendar/ico-visit-activity-missed-flat-clr.svg";
import call from "../../../Assets/images/calendar/ico-mobile-activity-flat-clr.svg";
import callMissed from "../../../Assets/images/calendar/ico-mobile-activity-missed-flat-clr.svg";
import videoCall from "../../../Assets/images/calendar/ico-call-activity-flat-clr.svg";
import videoCallMissed from "../../../Assets/images/calendar/ico-video-activity-missed-flat-clr.svg";
import reminder from "../../../Assets/images/calendar/ico-reminder-flat-clr.svg";
import moment from "moment";

const visitIcon = <img className="icons" alt="" src={visit} />;
const visitIconMissed = <img className="icons" alt="" src={visitMissed} />;
const callIcon = <img className="icons" alt="" src={call} />;
const callIconMissed = <img className="icons" alt="" src={callMissed} />;
const videoCallIcon = <img className="icons" alt="" src={videoCall} />;
const videoCallIconMissed = (
  <img className="icons" alt="" src={videoCallMissed} />
);
const reminderIcon = <img className="icons" alt="" src={reminder} />;

const { Item: TimelineItem } = Timeline;

class AppointmentsHistory extends Component {
  constructor(props) {
    super(props);
    this.renderEvents = this.renderEvents.bind(this);
    this.state = {
      lastDate: moment(),
      loading: false,
      end: true
    };
  }

  componentDidMount() {
    const History = document.getElementById("history-body");
    History.addEventListener("scroll", this.myHandler);
    this.fetchAppointmentsHistory();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.events.historyIds !== prevProps.events.historyIds) {
      const { historyIds = [] } = this.props.events;
      if (historyIds && historyIds.length > 0) {
        const lastRenderedDate = historyIds[historyIds.length - 1];
        this.setState({ lastDate: lastRenderedDate });
      }
    }
  }

  myHandler = () => {
    const HistoryBody = document.getElementById("history-body");
    const winScroll = HistoryBody.scrollTop;
    const height = HistoryBody.scrollHeight - HistoryBody.clientHeight;
    const scrolled = winScroll / height;
    const { end } = this.state;
    if (scrolled === 1 && !end) {
      const { lastDate: startDate } = this.state;
      this.fetchAppointmentsHistory(startDate);
    }
  };

  fetchAppointmentsHistory = startDate => {
    const { fetchAppointmentsHistory } = this.props;
    this.setState({ loading: true });
    fetchAppointmentsHistory(startDate).then(response => {
      const { status, payload } = response;
      const { data: { historyIds = [] } = {} } = payload;
      if (status === true && historyIds.length === 0) {
        this.setState({ loading: false, end: true });
      } else if (status === true) {
        this.setState({ loading: false });
      } else if (status === false) {
        this.setState({ loading: false });
      }
    });
  };

  getDifference = (from, to) => {
    let diff = dateFns.differenceInMinutes(
      dateFns.parse(to),
      dateFns.parse(from)
    );
    if (diff > 60) {
      diff =
        dateFns.differenceInHours(dateFns.parse(to), dateFns.parse(from)) +
        " hr";
    } else if (diff > 0 && diff <= 60) {
      diff = diff + " min";
    } else {
      diff = null;
    }
    return diff;
  };

  renderIcon = (activityMode, status) => {
    switch (activityMode) {
      case EVENT.ACTIVITY_MODE.CALL:
        return status === EVENT.STATUS.PENDING ||
          status === EVENT.STATUS.COMPLETED
          ? callIcon
          : callIconMissed;
      case EVENT.ACTIVITY_MODE.VISIT:
        return status === EVENT.STATUS.PENDING ||
          status === EVENT.STATUS.COMPLETED
          ? visitIcon
          : visitIconMissed;
      case EVENT.ACTIVITY_MODE.CHAT:
        return status === EVENT.STATUS.PASSED
          ? videoCallIconMissed
          : videoCallIcon;
      default:
        return reminderIcon;
    }
  };

  renderTimeLineItems = event => {
    const currentUserId = this.props.id;

    const { participantOne, participantTwo } = event.data;
    const otherUserId =
      currentUserId && participantOne === currentUserId
        ? participantTwo
        : participantOne;
    const showYou = otherUserId === currentUserId ? " (You)" : "";

    const { users = {} } = this.props;
    const {
      basicInfo: {
        profilePicLink: otherUserProfilePic,
        name: otherUserName,
        category: otherUserCategory
      } = {}
    } = users[otherUserId] || {};

    const startTime = dateFns.format(dateFns.parse(event.startTime), "h:mm A");
    const difference =
      event.startTime && event.endTime
        ? this.getDifference(event.startTime, event.endTime)
        : null;

    const activityMode = event.data.activityMode;
    const status = event.status;
    const icon = this.renderIcon(activityMode, status);

    const activityName =
      activityMode.charAt(0).toUpperCase() + activityMode.slice(1);

    const categoryName =
      otherUserCategory === USER_CATEGORY.CARE_COACH
        ? "Coach"
        : otherUserCategory === USER_CATEGORY.DOCTOR
        ? "Doctor"
        : "Patient";

    return (
      <Fragment key={event.id}>
        <TimelineItem className="time" dot={icon}>
          {startTime}, {difference}
          <div className="activity-name">
            {categoryName} {activityName} {"  "}
            <span className="coach-avatar">
              <Avatar src={otherUserProfilePic} />
              {otherUserName} {showYou}
            </span>
          </div>
        </TimelineItem>
      </Fragment>
    );
  };

  renderEvents = () => {
    const appointmentsHistoryList =
      this.props.events !== undefined ? this.props.events.historyIds : {};

    const events =
      this.props.events !== undefined ? this.props.events.events : {};

    const appointmentsHistory =
      this.props.events !== undefined
        ? this.props.events.appointmentHistory
        : {};

    let options = [];
    let items = [];

    for (const key in appointmentsHistoryList) {
      const appointments = [
        ...appointmentsHistory[appointmentsHistoryList[key]]
      ].reverse();
      const date = dateFns.format(
        dateFns.parse(appointmentsHistoryList[key]),
        "D MMM YYYY, dddd"
      );

      items = [];
      options.push(
        <Fragment key={date}>
          <TimelineItem
            className="main-date"
            dot={<div className="blue-dot" />}
          >
            {date}
          </TimelineItem>

          {//eslint-disable-next-line
          appointments.forEach(appointment => {
            items.push(this.renderTimeLineItems(events[appointment]));
          })}
          {items}
        </Fragment>
      );
    }
    return options;
  };

  render() {
    const { loading } = this.state;
    return (
      <div className="history" id="history">
        <div className="history-title">My Appointments History</div>
        <div id="history-body">
          <Timeline className="time-line">{this.renderEvents()}</Timeline>
          {loading && (
            <div>
              {" "}
              <Icon type="loading" className="ml10 dark pb10" />
              <span className="dark ml8">Loading</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AppointmentsHistory;
