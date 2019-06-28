import React, { Component } from "react";
import { Col, Menu } from "antd";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import AppHeader from "../Header";
import "../../../node_modules/react-big-calendar/lib/css/react-big-calendar.css";
import "./style.less";

const localizer = BigCalendar.momentLocalizer(moment);

const MyCalendar = props => (
  <div style={{ height: "700px" }}>
    <BigCalendar
      localizer={localizer}
      events={[]}
      startAccessor="start"
      endAccessor="end"
    />
  </div>
);

const NavBar = () => {
  return (
    <div className={"navbar"}>
      <div className={"back-button"}>All Patients</div>
      <div className={"navbar-menu"}>
        <div>Calendar</div>
        <div>Medical Details</div>
      </div>
    </div>
  );
};

const UserDetails = () => {
  return (
    <div className={"user-details"}>
      <p>UserDetails</p>
    </div>
  );
};
const Calendar = () => {
  return (
    <div className={"calendar-section"}>
      <MyCalendar />
    </div>
  );
};
const ActivityLog = () => {
  return (
    <div className={"activity-log"}>
      <p>ActivityLog</p>
    </div>
  );
};

class MainBody extends Component {
  render() {
    return (
      <div className={"main-body"}>
        <UserDetails />
        <Calendar />
        <ActivityLog />
      </div>
    );
  }
}

class CalendarView extends Component {
  render() {
    const menu = <Menu />;
    return (
      <div>
        <AppHeader menu={menu} />
        <Col xs={0} sm={0} md={0} lg={7} xl={7} xxl={7} className={"h100"} />
        <NavBar />
        <MainBody />
      </div>
    );
  }
}

export default CalendarView;
