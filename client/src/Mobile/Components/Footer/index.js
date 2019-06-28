import React, { Component, Fragment } from "react";
import { Row, Col, Menu } from "antd";

import "./style.less";
export default class PageFooter extends Component {
  componentDidMount() {
    // if (window.location.pathname.includes("remoteConsulting")) {
    //   this.setState({ display: false });
    // }
  }

  render() {
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
            />
          </Row>
        </div>
      </Fragment>
    );
  }
}
