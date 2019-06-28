import React from "react";
import { injectIntl } from "react-intl";
import withRouter from "react-router-dom/es/withRouter";
import { Menu } from "antd";
import messages from "./message";
import { DASHBOARD_MENU } from "../../../../constant";

const PatientMenu = props => {
  const {
    intl: { formatMessage }
  } = props;

  const redirectToTab = tabValue => {
    props.history.push({
      pathname: `/${tabValue}`
    });
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

export default withRouter(injectIntl(PatientMenu));
