import React, { Component } from "react";
import { Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import "./style.css";
import createHistory from "history/createBrowserHistory";
import AppHeader from "../../Commons/AppHeader";
import TwilioChat from "../TwilioChat";
import TwilioVideo from "../TwilioVideo";

class ConsultationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointment: null,
      entity: null,
      chatClient: null,
      channelSid: null
    };
  }
  componentDidMount() {
    // (
    //   "booking id in consultation screen: ",
    //   this.props.location.state.bookingRequestId
    // );
    if (this.props.location.state && this.props.location.state.appointment) {
      let appointment = this.props.location.state.appointment;
      let entity = this.props.location.state.entity;
      this.setState({ appointment, entity });
      const history = createHistory();
      let state = { ...history.location.state };
      delete state.appointment;
      history.replace({ ...history.location, state });
    } else {
      this.props.history.push("/member/consultation");
    }
  }

  componentWillUnmount() {}

  setChatClient = fn => {
    this.setState({ chatClient: fn }, () => {});
  };
  setChannelSid = sid => {
    this.setState({ channelSid: sid }, () => {});
  };

  render() {
    return (
      <div className="consultationScreen">
        <AppHeader />
        <Row
          type="flex"
          justify="space-around"
          align="middle"
          className="consultationContainerBody"
        >
          <Col lg={15} className="videoDiv">
            {this.props.location.state.appointment ? (
              <TwilioVideo
                bookingReqData={this.props.location.state.appointment}
                type="member"
              />
            ) : (
              ""
            )}
          </Col>

          <Col lg={6} className="chatDiv">
            {this.state.appointment ? (
              <TwilioChat
                appointment={this.state.appointment}
                entity={this.state.entity}
                setChatClient={this.setChatClient}
                setChannelSid={this.setChannelSid}
              />
            ) : (
              ""
            )}
          </Col>
        </Row>
        {/* <AppFooter /> */}
      </div>
    );
  }
}

export default withRouter(ConsultationScreen);
