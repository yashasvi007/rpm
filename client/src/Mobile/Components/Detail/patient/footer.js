import React, { Component, Fragment } from "react";
import { Menu, Icon, Button } from "antd";
import { USER_CATEGORY } from "../../../../constant";
import "../style.less";
const { Item } = Menu;

const MEDICAL_DETAILS = "Medical-Details";
const CALENDAR = "calendar";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggleHistory = () => {
    this.props.toggleHistory();
  };

  goBack = () => {
    this.props.goBack();
  };

  openAddAppointment = () => {
    this.props.openAddAppointment();
  };

  selectMenu = e => {
    const { key } = e;
    this.props.selectMenu(key);
  };

  render() {
    const { showHistory, currentTab, showCalendar, userData = {} } = this.props;
    const { basicInfo: { category } = {} } = userData;

    return (
      <div className="patient-details-footer">
        {!showHistory && (
          <Fragment>
            {currentTab === CALENDAR && showCalendar && (
              <div
                className="appointment-history-button"
                onClick={this.toggleHistory}
              >
                View Appointment History
              </div>
            )}
            {category !== USER_CATEGORY.DOCTOR && showCalendar && (
              <div className="menu-selection menu-black">
                <Menu
                  selectedKeys={[currentTab]}
                  mode="horizontal"
                  onClick={this.selectMenu}
                >
                  <Item key={CALENDAR}>Calendar</Item>
                  <Item key={MEDICAL_DETAILS}>Medical Details</Item>
                </Menu>
              </div>
            )}
          </Fragment>
        )}
        <div className="nav-bar">
          <div className="nav-bar-left">
            <div className="arrow-wrapper">
              <Icon
                type="arrow-left"
                onClick={showHistory ? this.toggleHistory : this.goBack}
              />
            </div>
            <div className="text">
              {showHistory ? "Patient Details" : "All Programs"}
            </div>
          </div>
          {!showHistory && (
            <div className="nav-bar-right">
              <Button
                type="primary"
                className="button-text"
                onClick={this.openAddAppointment}
              >
                Add Appointment/Reminder
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Footer;
