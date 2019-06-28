import React from "react";
import { injectIntl } from "react-intl";
import { Menu, Dropdown, Button, Badge } from "antd";
import "./style.less";
import search from "../../Assets/images/ico-search-flat-white.svg";
import chat from "../../Assets/images/ico-chat-flat-white.svg";
import alert from "../../Assets/images/icon-bell-flat-white.svg";
import messages from "./message";
import { GLOBAL_MODALS, USER_CATEGORY } from "../../constant";

const HeaderIcons = props => {
  const {
    intl: { formatMessage },
    category,
    showSearchbar,
    userId,
    reportAdverseEvent,
    showSearch,
    showAddButton,
    notifications
  } = props;
  //console.log("notifications", notifications);
  const AlertMenu = () => {
    let menuItems = notifications
      ? notifications.map((value, index) => {
          return <Menu.Item key={index}>{value.message}</Menu.Item>;
        })
      : null;
    return <Menu>{menuItems}</Menu>;
  };
  const CareCoachAddmenu = (
    <Menu className="addButtonmenu">
      <Menu.Item
        className="addButtonMenuItem"
        onClick={e => {
          props.openModal(GLOBAL_MODALS.EVENT_MODAL);
        }}
      >
        {formatMessage(messages.newAppointment)}
      </Menu.Item>

      <Menu.Item
        className="addButtonMenuItem"
        onClick={props.openAddPatientModal}
      >
        {formatMessage(messages.newPatient)}
      </Menu.Item>

      <Menu.Item
        className="addButtonMenuItem"
        onClick={props.openAddDoctorModal}
      >
        {formatMessage(messages.newDoctor)}
      </Menu.Item>

      <Menu.Item
        className="addButtonMenuItem"
        onClick={e => {
          props.openModal(GLOBAL_MODALS.ADVERSE_EVENTS);
        }}
      >
        {formatMessage(messages.reportAdverseEvent)}
      </Menu.Item>
    </Menu>
  );

  const PatientAddmenu = (
    <Menu className="addButtonmenu">
      <Menu.Item
        className="addButtonMenuItem"
        onClick={e => {
          props.openModal(GLOBAL_MODALS.EVENT_MODAL);
        }}
      >
        {formatMessage(messages.newAppointment)}
      </Menu.Item>

      <Menu.Item
        className="addButtonMenuItem"
        onClick={e => {
          reportAdverseEvent(userId);
        }}
      >
        {formatMessage(messages.reportAdverseEvent)}
      </Menu.Item>
    </Menu>
  );

  let currentAddMenu;
  switch (category) {
    case USER_CATEGORY.CARE_COACH:
      currentAddMenu = CareCoachAddmenu;
      break;
    case USER_CATEGORY.PATIENT:
      currentAddMenu = PatientAddmenu;
      break;
    case USER_CATEGORY.DOCTOR:
      currentAddMenu = PatientAddmenu;
      break;
    default:
      break;
  }

  return (
    <div className="flex align-items-center justify-content-space-evenly">
      {currentAddMenu && showAddButton && (
        <div>
          <Dropdown
            overlay={currentAddMenu}
            trigger={["click"]}
            overlayStyle={{
              paddingTop: "8px",
              paddingRight: "12px",
              position: "fixed"
            }}
          >
            <Button icon="plus" className="addButton">
              Add
            </Button>
          </Dropdown>
        </div>
      )}
      <div className="flex align-items-center justify-content-space-evenly ">
        {category && category !== USER_CATEGORY.PATIENT && showSearch && (
          <div onClick={showSearchbar} className="ico-search-desktop">
            <img alt="" src={search} className="icons" />
          </div>
        )}
        <div className="chat">
          <img alt="" src={chat} className="icons" />
        </div>
        <div className="alert">
          <Badge count={notifications ? notifications.length : 0}>
            <Dropdown
              overlay={AlertMenu()}
              trigger={["click"]}
              overlayStyle={{
                paddingTop: "8px",
                paddingRight: "12px",
                position: "fixed"
              }}
            >
              <img alt="" src={alert} className="icons" />
            </Dropdown>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default injectIntl(HeaderIcons);
