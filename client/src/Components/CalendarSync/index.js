import React, { Component } from "react";
import AppHeader from "../Header";
import { Row, Col, Button } from "antd";
import { injectIntl } from "react-intl";
import securityIcon from "../../Assets/images/ico_security.png";
import iqviaColorLogo from "../../Assets/images/iqvia_logo_color.png";
import calendarLogo from "../../Assets/images/ico_gcalendar.png";
import recycleIcon from "../../Assets/images/recycle.png";
import "./style.less";
import { path } from "../../constant";
import messages from "./message";

class LandingPage extends Component {
  render() {
    const {
      intl: { formatMessage }
    } = this.props;

    const redirect = path.PROFILE_SETUP;

    const { program } = this.props;
    return (
      <div className="flex align-items-center justify-content-center">
        <AppHeader showmenu={true} />
        <div className="main-iqvia-container flex column align-items-center justify-content-center">
          <div className="pt60">
            <Row className="calendar-container">
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                xxl={12}
                className="text-align-l pb20"
              >
                <div className="mt30 dark">
                  <div className="fontsize22">
                    {formatMessage(messages.welcomeText)}{" "}
                    <div className="fontsize22 medium inline">
                      {program || "Patient Engagement Program"}
                    </div>
                    <span>!</span>
                    {program && formatMessage(messages.welcomeText)}
                  </div>
                </div>
                <div className="mt16 fontsize16">
                  {formatMessage(messages.welcomeSubtitleText)}
                </div>
                <div className="mt16 subdued fontsize12">
                  {formatMessage(messages.calendarSyncDescriptionText)}
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                xxl={12}
                className="calendar-logo"
              >
                <div
                  className={"flex align-items-center justify-content-center"}
                >
                  <div
                    className={
                      "flex align-items-center justify-content-center bg-silver-25 gcalendar_logo br50 p10 mr10"
                    }
                  >
                    <img
                      alt=""
                      src={calendarLogo}
                      style={{ height: "58px", width: "60px" }}
                      className={"w100 p5"}
                    />
                  </div>
                  <div
                    className={"bg-white absolute br50 p5"}
                    style={{ border: "solid 1px #d4d7d9" }}
                  >
                    <img alt="" src={recycleIcon} />
                  </div>
                  <div
                    className={
                      " flex align-items-center justify-content-center bg-silver-25 gcalendar_logo br50 p10 ml10"
                    }
                  >
                    <img alt="" src={iqviaColorLogo} className={"w100"} />
                  </div>
                </div>
              </Col>

              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                xxl={12}
                className="mb16"
              >
                <div
                  className={"flex align-items-center justify-content-center"}
                >
                  <img alt="" src={securityIcon} className={"block"} />
                  <div className="tal pl10 label-color fontsize12">
                    {formatMessage(messages.privacyText)}
                  </div>
                </div>
              </Col>
              <Col xs={0} sm={0} md={0} lg={12} xl={12} xxl={12}>
                <div className="padding-tb-10 mt20 flex row align-items-center justify-content-center">
                  <Button
                    ghost
                    className="margin-rl-10 iqvia-btn"
                    onClick={e => {
                      this.props.history.push(redirect);
                    }}
                    style={{ height: "40px" }}
                  >
                    {formatMessage(messages.skipButton)}
                  </Button>
                  <Button
                    className="iqvia-btn"
                    type="primary"
                    href={`/api/sync-calendar?redirecturi=${redirect}`}
                    style={{ height: "40px" }}
                  >
                    {formatMessage(messages.enableButton)}
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="hide-desktop">
          <Row className="sticky-footer">
            <Col xs={12} sm={12} md={12} lg={0} xl={0} xxl={0}>
              <div className=" pull-right flex row align-items-center justify-content-center">
                <Button
                  ghost
                  className="margin-rl-10 iqvia-btn"
                  onClick={e => {
                    this.props.history.push(redirect);
                  }}
                  style={{ height: "40px" }}
                >
                  {formatMessage(messages.skipButton)}
                </Button>
                <Button
                  className="iqvia-btn"
                  type="primary"
                  href={`/api/sync-calendar?redirecturi=${redirect}`}
                  style={{ height: "40px" }}
                >
                  {formatMessage(messages.enableButton)}
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default injectIntl(LandingPage);
