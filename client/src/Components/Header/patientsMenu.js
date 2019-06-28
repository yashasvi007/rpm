import React from "react";
import { injectIntl } from "react-intl";
import { Menu } from "antd";
import "./style.less";
import messages from "./message";
import { DASHBOARD_MENU } from "../../constant";

const PatientMenu = props => {
  const {
    intl: { formatMessage }
  } = props;

  const redirectToTab = tabValue => {
    props.history.push({
      pathname: `/${tabValue}`
    });
    // if (props.history.location.pathname !== "/") {
    //   props.history.push({
    //     pathname: "/",
    //     state: { defaultTab: tabValue }
    //   });
    // } else {
    //   setTabDashboard(tabValue);
    // }
  };

  return (
    <Menu mode="horizontal" className="menu" selectedKeys={[props.currentTab]}>
      <Menu.Item
        key={DASHBOARD_MENU.HOME}
        className="menuItem dashboard fontsize14"
        onClick={() => {
          redirectToTab(DASHBOARD_MENU.HOME);
        }}
      >
        {formatMessage(messages.dashboard)}
      </Menu.Item>
      <Menu.Item
        key={DASHBOARD_MENU.CALENDAR}
        className="menuItem mycalender fontsize14"
        onClick={() => {
          redirectToTab(DASHBOARD_MENU.CALENDAR);
        }}
      >
        {formatMessage(messages.mycalender)}
      </Menu.Item>
      <Menu.Item
        key={DASHBOARD_MENU.MEDICALS}
        className="menuItem my-medical-detail fontsize14"
        onClick={() => {
          redirectToTab(DASHBOARD_MENU.MEDICALS);
        }}
      >
        {formatMessage(messages.MyMedicalDetails)}
      </Menu.Item>
    </Menu>
  );
};

export default injectIntl(PatientMenu);
