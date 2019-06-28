import React, { Component } from "react";
import { Row, Col, DatePicker, Card } from "antd";
import moment from "moment";
import { connect } from "react-redux";
import { fetchProviderAppointmentHistory } from "../../../../Actions/providerActions";
import "./style.css";

const { Meta } = Card;

class HistoryBodyContainer extends Component {
  constructor() {
    super();
    this.state = {
      searchDate: null
    };
  }
  async selectDate(date, dateString) {
    if (dateString) {
      this.setState({ searchDate: dateString });
      this.props.fetchProviderAppointmentHistory(
        dateString,
        this.props.provider._id
      );
    }
  }

  disabledDate(current) {
    return current > moment().add(0, "days");
  }

  renderAppointments() {
    return this.props.appointmentHistory.map((appointmentHistory, index) => (
      <Col md={6} key={index} className="appointmentHistoryColumn">
        <Card
          hoverable
          style={{ width: "50%", marginBottom: "30px" }}
          cover={
            <img
              alt="example"
              src="https://www.flossiesgifts.com/v/vspfiles/photos/BLITZ-FC-RED-16.jpg"
            />
          }
        >
          <Meta
            title={
              appointmentHistory.memberId.firstName +
              " " +
              appointmentHistory.memberId.lastName
            }
            description={`${appointmentHistory.time}:00   ${
              appointmentHistory.statusId.name
            }`}
          />
        </Card>
      </Col>
    ));
  }

  render() {
    return (
      <Card>
        <Row className="historyDateDiv">
          <Col md={6} offset={9}>
            <DatePicker
              disabledDate={this.disabledDate}
              onChange={(date, dateString) => this.selectDate(date, dateString)}
            />
          </Col>
        </Row>
        <Row
          className="appointmentHistoryCard"
          type="flex"
          justify="space-around"
        >
          {this.props.appointmentHistory &&
          this.props.appointmentHistory.length > 0
            ? this.renderAppointments()
            : ""}
        </Row>
      </Card>
    );
  }
}

const mapStateToProps = ({ providerReducer }) => {
  return {
    provider: providerReducer.provider,
    appointmentHistory: providerReducer.appointmentHistory
  };
};

export default connect(
  mapStateToProps,
  { fetchProviderAppointmentHistory }
)(HistoryBodyContainer);
