import React, { Component } from "react";
import { Row, Col, Card } from "antd";
import moment from "moment";
import TwilioVideo from "../../../TwilioVideo";
import TwilioChat from "../../../TwilioChat";

import AddPrescription from "../AddPrescription";

import "./style.css";

class ProviderConsultationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPrescription: false,
      chatClient: null,
      channelSid: null
    };
  }

  setChatClient = fn => {
    this.setState({ chatClient: fn }, () => {});
  };
  setChannelSid = sid => {
    this.setState({ channelSid: sid }, () => {});
  };

  showPrescriptionState = value => {
    this.setState(
      {
        showPrescription: value
      },
      () => {}
    );
  };

  render() {
    return (
      <Row id="providerConsultationContainer">
        <Col id="providerConsultationLeftContainer">
          <Col id="patientDetailsContainer">
            <Card>
              <Col>
                <Col>
                  <h3>Patient Details</h3>
                </Col>
                <Col>
                  <strong>Name:</strong>
                  {this.props.bookingReqData.memberId.firstName +
                    " " +
                    this.props.bookingReqData.memberId.lastName}
                </Col>
                <Col>
                  <strong>Date:</strong>
                  {moment(this.props.bookingReqData.date).format("DD-MM-YYYY")}
                </Col>
              </Col>
            </Card>
          </Col>
          <Col className="clearFixHorizontalVS" />
          <Col id="videoContainer">
            <TwilioVideo
              bookingReqData={this.props.bookingReqData}
              type="provider"
              showPrescriptionState={this.showPrescriptionState}
            />
          </Col>
          <Col className="clearFixHorizontalVS" />

          <Col id="prescribeMedicineContainer">
            {this.state.showPrescription ? (
              <AddPrescription
                chatClient={this.state.chatClient}
                channelSid={this.state.channelSid}
                bookingReqData={this.props.bookingReqData}
              />
            ) : (
              ""
            )}
          </Col>
          <Col className="clearFixHorizontalVS" />
        </Col>
        <Col className="clearFixVerticalVS" />
        <Col id="providerConsultationRightContainer">
          <TwilioChat
            appointment={this.props.bookingReqData}
            entity="provider"
            setChatClient={this.setChatClient}
            setChannelSid={this.setChannelSid}
          />
        </Col>
      </Row>
    );
  }
}

export default ProviderConsultationContainer;
