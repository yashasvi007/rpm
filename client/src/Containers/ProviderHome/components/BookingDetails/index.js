import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Button, Divider, Icon, Card } from "antd";
import moment from "moment";
import "./style.css";

class BookingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableStartConsultationButton: true
    };
  }
  componentDidMount() {
    this.setState({ callSetInterval: true });
    if (this.state.callSetInterval) {
      this.timerId = setInterval(() => {
        let dateData = this.props.bookingReqDetails.date;
        dateData = dateData.split("T");
        let timeData = dateData[1].split(":");
        timeData[0] = this.props.bookingReqDetails.time;
        timeData = timeData.join(":");
        dateData[1] = timeData;
        dateData = dateData.join("T");

        if (moment().isAfter(moment(this.props.bookingReqDetails.date))) {
          this.setState({ disableStartConsultationButton: false });
        } else {
          this.setState({ disableStartConsultationButton: true });
        }
      }, 5000);
    }
  }
  componentWillUnmount() {
    clearInterval(this.timerId);
  }
  goBack = () => {
    this.props.setProviderHomeState("current", 1);
  };
  startConsultation = () => {
    this.props.setProviderHomeState("current", 5);
  };
  cancelConsultation = () => {};
  renderStartConsultation = () => {
    return this.state.disableStartConsultationButton ? (
      <Button type="default" onClick={this.startConsultation}>
        Start Consultation
      </Button>
    ) : (
      <Button disabled>Start Consultation</Button>
    );
  };
  render() {
    return (
      <Card className="bookingReqDetailsContainer">
        <Row>
          <Button type="primary" onClick={this.goBack}>
            <Icon type="left" />
            Go back
          </Button>
        </Row>
        <Row>
          <p />
          <p>
            <strong>Name</strong>
            :&nbsp;
            {this.props.bookingReqDetails.memberId.firstName +
              " " +
              this.props.bookingReqDetails.memberId.lastName}
          </p>
          <Divider />
          <p>
            <strong>Email:</strong>
            &nbsp;
            {this.props.bookingReqDetails.memberId.email}
          </p>
          <Divider />
          <p>
            <strong>Contact:</strong>
            &nbsp;
            {this.props.bookingReqDetails.memberId.phone}
          </p>
          <Divider />
          <p>
            <strong>Booking Date:</strong>
            &nbsp;
            {moment(this.props.bookingReqDetails.date)
              .utc()
              .format("DD-MM-YYYY")}
          </p>
          <Divider />
          <p>
            <strong>Booking Time:</strong>
            &nbsp;
            {this.props.bookingReqDetails.time + ":00"}
          </p>
          <Divider />
          <p>
            <strong>Documents:</strong>
            &nbsp;
            {this.props.bookingReqDetails.documentUrl
              ? this.props.bookingReqDetails.documentUrl
              : "No documents to show"}
          </p>
        </Row>
        <Row type="flex" gutter={20}>
          <Col>{this.renderStartConsultation()}</Col>
          <Col>
            <Button type="primary" onClick={this.cancelConsultation}>
              Cancel Consultation
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default withRouter(BookingDetails);
