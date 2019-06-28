import React, { Component } from "react";
import { Modal, Button, message } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { fetchMember } from "../../Actions/memberActions";

class ConfirmBookingRequestModal extends Component {
  componentDidMount() {
    this.props.fetchMember();
  }

  handleCancel = e => {
    this.props.setConfirmationModelDisplay(false);
  };

  handleConfirmAppointment = async e => {
    let reqBody = {
      providerId: this.props.provider._id,
      memberId: this.props.memberId,
      date: this.props.bookingDate,
      time: this.props.bookingSlot,
      cityId: this.props.provider.cityId._id,
      hasConsented: true,
      documentUrl: "",
      concern: "Headache"
    };
    let bookingRequest = await axios.post("/api/createBookingRequest", reqBody);

    if (!bookingRequest.err) {
      message.success("Successfully booked your appointment");
      setTimeout(() => this.props.history.push("/member/home"), 2000);
    }
  };

  render() {
    return (
      <Modal
        title="Confirm Appointment"
        visible={this.props.confirmationModalVisible}
        // onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="auto"
        className="confirmBookingRequestModel"
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={this.handleConfirmAppointment}
          >
            Confirm Appointment
          </Button>
        ]}
      >
        <div className="scheduleAppointmentBody">
          <div className="providerDetailBox">
            <div className="providerImageDiv">
              <img
                className="providerImage"
                src={this.props.provider.photoUrl}
                alt="providerImage"
              />
            </div>
            <div className="providerDetails">
              <h2>
                <b>
                  Dr. {this.props.provider.firstName}{" "}
                  {this.props.provider.lastName}
                </b>
              </h2>
              <h2>
                <b>{this.props.provider.specialityId.specialityName}</b>
              </h2>
              <h2>
                <b>{this.props.provider.bio}</b>
              </h2>
            </div>
            <div className="dateTimeSlotDiv">
              <h3>Date: {this.props.bookingDate}</h3>
              <h3>Time: {this.props.bookingSlot} : 00 Hour</h3>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = ({ memberReducer }) => {
  return {
    memberId: memberReducer.data._id
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { fetchMember }
  )(ConfirmBookingRequestModal)
);
