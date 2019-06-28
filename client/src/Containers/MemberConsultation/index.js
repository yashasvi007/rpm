import React, { Component, Fragment } from "react";
import { Card, Row, Col, Button } from "antd";
import moment from "moment";
import { withRouter } from "react-router-dom";
import AppHeader from "../../Commons/AppHeader";
import AppFooter from "../../Commons/AppFooter";
import { connect } from "react-redux";
import {
  getMemberAppointments,
  fetchMember
} from "../../Actions/memberActions";

class MemberConsultation extends Component {
  componentDidMount() {
    this.callInitialFunctions();
  }

  async callInitialFunctions() {
    await this.props.fetchMember();
    await this.props.getMemberAppointments(this.props.loggedInMember._id);
  }

  renderAppointments() {
    return this.props.appointments.map((appointment, index) => (
      <Col md={6} key={index} className="appointmentHistoryColumn">
        <Card
          hoverable
          style={{ width: "50%", marginBottom: "30px" }}
          cover={<img alt="example" src={appointment.providerId.photoUrl} />}
        >
          <h4>
            Doctor:{" "}
            {appointment.providerId.firstName +
              " " +
              appointment.providerId.lastName +
              "\n"}
          </h4>
          <p>
            {" "}
            <b>Date: </b>
            {moment(appointment.date).format("MM-DD-YYYY")}
            <br />
            <b>Time: </b> {appointment.time}
            :00 Hour <br />
            <b>Status: </b>
            {appointment.statusId.name}
            <br />
            <b>Concern: </b>
            {appointment.concern}
          </p>
          {/* <Link
            to={{
              pathname: "/member/consultationScreen",
              state: { bookingRequestId: appointment._id }
            }}
          > */}
          <Button
            type="primary"
            onClick={() =>
              this.props.history.push({
                pathname: "/member/consultationScreen",
                state: {
                  appointment,
                  entity: "member"
                }
              })
            }
          >
            Start Consultation
          </Button>
          {/* </Link> */}

          {/* <Meta
            title={
              appointment.providerId.firstName +
              " " +
              appointment.providerId.lastName
            }
            description={`${moment(appointment.date).format("MM-DD-YYYY")} ${
              appointment.time
            }:00 Hour ${appointment.statusId.name}`}
          /> */}
        </Card>
      </Col>
    ));
  }

  render() {
    return (
      <Fragment>
        <AppHeader
          loggedInMemberData={
            this.props.loggedInMember ? this.props.loggedInMember : null
          }
        />
        <Row
          className="appointmentHistoryCard"
          type="flex"
          justify="space-around"
        >
          {this.props.appointments && this.props.appointments.length > 0
            ? this.renderAppointments()
            : ""}
        </Row>
        <AppFooter />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ memberReducer }) => {
  let loggedInMember = memberReducer.data;
  let appointments = memberReducer.appointments;

  return { loggedInMember, appointments };
};

export default withRouter(
  connect(
    mapStateToProps,
    { getMemberAppointments, fetchMember }
  )(MemberConsultation)
);
