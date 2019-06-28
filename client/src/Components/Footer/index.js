import React, { Component, Fragment } from "react";
import { Row, Col, Menu } from "antd";

import alert from "../../Assets/images/ico_alert_desktop.png";
import chat from "../../Assets/images/ico_chat_desktop.png";
import calendar from "../../Assets/images/ico_calendar.png";
import seacrh from "../../Assets/images/ico_search_desktop.png";
import home from "../../Assets/images/ico_dash.png";
import "./style.less";
export default class PageFooter extends Component {
  componentDidMount() {
    // if (window.location.pathname.includes("remoteConsulting")) {
    //   this.setState({ display: false });
    // }
  }

  render() {
    const menu = [home, calendar, seacrh, chat, alert];
    let menuElement = [];
    menu.forEach((value, index) => {
      menuElement.push(
        <Menu.Item key={index}>
          <img alt="" src={value} />
        </Menu.Item>
      );
    });

    if (window.location.pathname.includes("remoteConsulting")) {
      return null;
    }

    return (
      <Fragment>
        <div className={"parent-footer"}>
          <Row className={"footer"} type={"flex"} align={"middle"}>
            <Col
              className={"footer-copyrights"}
              xs={24}
              sm={0}
              md={12}
              lg={12}
              xl={12}
              xxl={12}
            >
              <p>PEP 2019 © All Rights Reserved</p>
            </Col>
            <Col
              xs={0}
              sm={24}
              md={0}
              lg={0}
              xl={0}
              xxl={0}
              style={{ bottom: "0" }}
            >
              <Menu
                mode="horizontal"
                style={{ display: "flex", justifyContent: "space" }}
              >
                {menuElement}
              </Menu>
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}
