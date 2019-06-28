import React, { Component } from "react";
import { Layout, Row, Col, Button } from "antd";
import { injectIntl } from "react-intl";
import LandingPageHeader from "./landingPageHeader";
import Footer from "../../Containers/Footer";
import { GRID_GUTTER } from "../../../constant";
import nurseIcon from "../../../Assets/images/ico_nurse.png";
import doctorIcon from "../../../Assets/images/ico_doctor_consultation.png";
import reportIcon from "../../../Assets/images/ico_medical_report.png";
import rpmEconIcon1 from "../../../Assets/images/rpm_econ_bg.png";
import rpmEconIcon2 from "../../../Assets/images/rpm-cc-bg@3x.png";
import "./style/style.less";
import messages from "./message";

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignIn: false
    };
    this.showSignIn = this.showSignIn.bind(this);
  }

  showSignIn() {
    this.props.history.push("/sign-in");
  }
  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    return (
      <div className="landing-page">
        <Layout justify="center" align="center">
          <LandingPageHeader showSignIn={this.showSignIn} />
          <Row className="computerDeskDoctor">
            <Col span={12} className="full-height">
              <div className={"hero_background"} />
              <div
                className={
                  "hero_container flex column align-items-center justify-content-center"
                }
              >
                <div>
                  <h1 className={"medium white"}>
                    {formatMessage(messages.heroText)}
                  </h1>
                </div>
                <div className="padding-tb-10 hide-mobile">
                  <div className={"white medium started-static"}>
                    {formatMessage(messages.heroButton)}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <div style={{ backgroundColor: "white" }}>
            <div className="main-iqvia-container">
              <Row className="" gutter={GRID_GUTTER}>
                <Col className="pt48" span={12}>
                  <h5 className={"mb0 dark"}>
                    {formatMessage(messages.upperViewTitle)}
                  </h5>
                  <h3 className={"medium dark"}>
                    {formatMessage(messages.upperViewSubTitle)}
                  </h3>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
                  xxl={4}
                  className="pt20 pb20"
                >
                  <img alt="" src={doctorIcon} />
                  <p className={"pt10 fontsize14 dark"}>
                    {formatMessage(messages.upperViewDoctor)}
                  </p>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
                  xxl={4}
                  className="pt20 pb20 "
                >
                  <img alt="" src={nurseIcon} />
                  <p className={"pt10 fontsize14 dark"}>
                    {formatMessage(messages.upperViewCareCoach)}
                  </p>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
                  xxl={4}
                  className={"pt20 pb20"}
                >
                  <img alt="" src={reportIcon} />
                  <p className={"pt10 fontsize14 dark"}>
                    {formatMessage(messages.upperViewReport)}
                  </p>
                </Col>
              </Row>
            </div>
            <div className="content-wrapper">
              <Row className="main-iqvia-container">
                <Col span={24} className="pt30 pb20">
                  <h5 className={"mb0 dark"}>
                    {formatMessage(messages.lowerViewTitle)}
                  </h5>
                </Col>
                <Row gutter={GRID_GUTTER}>
                  <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <div className="pt10  pb10">
                      <img
                        alt=""
                        src={rpmEconIcon1}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className={"pt10"}>
                        <h4 className={"tal medium mb0 fontsize22 dark"}>
                          {formatMessage(messages.lowerViewMedicalCheckUpTitle)}
                        </h4>
                        <p
                          className={"fontsize16 black"}
                          style={{ textAlign: "left" }}
                        >
                          {formatMessage(
                            messages.lowerViewMedicalCheckUpContent
                          )}
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <div className="pt10 pb10">
                      <img
                        alt=""
                        src={rpmEconIcon2}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <div className={"pt10"}>
                        <h4 className={"tal medium mb0 fontsize22 dark"}>
                          {formatMessage(messages.lowerViewMedicalReportTitle)}
                        </h4>
                        <p
                          className={"fontsize16 black"}
                          style={{ textAlign: "left" }}
                        >
                          {formatMessage(
                            messages.lowerViewMedicalReportContent
                          )}
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Row>
            </div>
            <div
              className="signup-footer hide-desktop"
              style={{ border: "solid 1px #d4d7d9" }}
            >
              <div className="pull-right padding-tb-10 mr20">
                <Button type="primary" className="signup-btn margin-rl-10">
                  {formatMessage(messages.signUp)}
                </Button>
                <Button
                  className="signin-btn"
                  onClick={() => {
                    this.showSignIn();
                  }}
                >
                  {formatMessage(messages.signIn)}
                </Button>
              </div>
            </div>
          </div>
          <Footer />
        </Layout>
      </div>
    );
  }
}

export default injectIntl(LandingPage);
