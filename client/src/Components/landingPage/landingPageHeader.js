import React, { Component } from "react";
import { Row, Col, Button } from "antd";
import logo from "../../Assets/images/iqvia_logo_white.png";
import "./style/style.less";

class LandingPageHeader extends Component {
  render() {
    return (
      <div>
        <Row
          type="flex"
          align="middle"
          justify="space-between"
          className={"header"}
        >
          <Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
            <div
              className={
                " logo-block flex align-items-center justify-content-start pl24"
              }
            >
              <div className={"logo"}>
                <img alt="" src={logo} />
              </div>
              <div className={"pl10 bold"}>P E P</div>
            </div>
          </Col>
          <Col xs={0} sm={0} md={0} lg={3} xl={3} xxl={3}>
            <div
              className={" logo-block flex align-items-center pull-right pr24"}
            >
              {/* <Button type="primary" className="signup-btn margin-rl-10">
                Sign Up
              </Button> */}
              <Button className="signin-btn" onClick={this.props.showSignIn}>
                Sign In
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LandingPageHeader;
