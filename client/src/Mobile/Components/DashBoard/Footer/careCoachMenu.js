import React from "react";
import { injectIntl } from "react-intl";
import withRouter from "react-router-dom/es/withRouter";
import { Menu } from "antd";
import messages from "./message";
import { DASHBOARD_MENU } from "../../../../constant";

const CarecoachMenu = props => {
  const {
    intl: { formatMessage }
  } = props;

  const redirectToTab = tabValue => {
    // if (props.history.location.pathname != "/") {
    //   props.history.push({
    //     pathname: "/",
    //     state: { defaultTab: tabValue }
    //   });
    // } else {
    //props.history.push(tabValue.toLowerCase());
    props.history.push({
      pathname: `/${tabValue}`
      //state: { defaultTab: tabValue }
    });
    //setTabDashboard(tabValue);
    //}
  };

  return (
    <Menu mode="horizontal" className="menu" selectedKeys={[props.currentTab]}>
      <Menu.Item
        key={DASHBOARD_MENU.HOME}
        className="fontsize14"
        onClick={() => {
          redirectToTab(DASHBOARD_MENU.HOME);
        }}
      >
        {formatMessage(messages.dashboard)}
      </Menu.Item>
      <Menu.Item
        key={DASHBOARD_MENU.CALENDAR}
        className="fontsize14"
        onClick={() => {
          redirectToTab(DASHBOARD_MENU.CALENDAR);
        }}
      >
        {formatMessage(messages.mycalender)}
      </Menu.Item>
      <Menu.Item
        key={DASHBOARD_MENU.PROGRAMS}
        className="fontsize14"
        onClick={() => {
          redirectToTab(DASHBOARD_MENU.PROGRAMS);
        }}
      >
        {formatMessage(messages.program)}
      </Menu.Item>
      <Menu.Item
        key={DASHBOARD_MENU.SURVEYS}
        className="fontsize14"
        onClick={() => {
          redirectToTab(DASHBOARD_MENU.SURVEYS);
        }}
      >
        {formatMessage(messages.surveys)}
      </Menu.Item>
    </Menu>
  );
};

export default withRouter(injectIntl(CarecoachMenu));
