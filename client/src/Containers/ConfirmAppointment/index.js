import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Icon, message } from "antd";
import axios from "axios";
import AppHeader from "../../Commons/AppHeader";
import AppFooter from "../../Commons/AppFooter";
import { fetchMember } from "../../Actions/memberActions";

class ConfirmAppointment extends Component {
  constructor() {
    super();
    this.state = {
      provider: null,
      bookingDate: null,
      bookingSlotSelected: null,
      documentNames: null,
      documentUrls: null
    };
  }

  componentDidMount() {
    this.props.fetchMember();
    const provider = JSON.parse(localStorage.getItem("provider"));
    const bookingDate = localStorage.getItem("bookingDate");
    const bookingSlotSelected = localStorage.getItem("bookingSlotSelected");
    const documentNames = JSON.parse(localStorage.getItem("documentNames"));
    const documentUrls = JSON.parse(localStorage.getItem("documentUrls"));
    //
    if (!(provider && bookingDate && bookingSlotSelected)) {
      this.props.history.push("/member/search");
    } else {
      this.setState({
        provider,
        bookingDate,
        bookingSlotSelected,
        documentNames,
        documentUrls
      });
    }
  }

  async confirmAppointment() {
    let reqBody = {
      providerId: this.state.provider._id,
      memberId: this.props.memberId,
      date: this.state.bookingDate,
      time: this.state.bookingSlotSelected,
      cityId: this.state.provider.cityId._id,
      hasConsented: true,
      documentNames: this.state.documentNames,
      documentUrls: this.state.documentUrls,
      concern: "Headache"
    };
    let bookingRequest = await axios.post("/api/createBookingRequest", reqBody);

    if (!bookingRequest.err) {
      message.success("Successfully booked your appointment");
      setTimeout(() => this.props.history.push("/member/home"), 2000);
    }
  }

  render() {
    {
      return this.state.provider ? (
        <div>
          <AppHeader />
          <div className="scheduleAppointmentBody">
            <div className="providerDetailBox">
              <div className="providerImageDiv">
                <img
                  className="providerImage"
                  src={this.state.provider.photoUrl}
                  alt="providerImage"
                />
              </div>
              <div className="providerDetails">
                <h2>
                  <b>
                    Dr. {this.state.provider.firstName}{" "}
                    {this.state.provider.lastName}
                  </b>
                </h2>
                <h2>
                  <b>{this.state.provider.specialityId.specialityName}</b>
                </h2>
                <h2>
                  <b>{this.state.provider.bio}</b>
                </h2>
              </div>
              <div className="dateTimeSlotDiv">
                <h3>Date: {this.state.bookingDate}</h3>
                <h3>Time: {this.state.bookingSlotSelected} : 00 Hour</h3>
                <Button
                  type="primary"
                  onClick={() => this.confirmAppointment()}
                >
                  Confirm Appointment
                  <Icon type="right" />
                </Button>
              </div>
            </div>
          </div>
          <AppFooter />
        </div>
      ) : (
        ""
      );
    }
  }
}
const mapStateToProps = ({ memberReducer }) => {
  if (memberReducer.data) {
    return {
      memberId: memberReducer.data._id
    };
  } else {
    return {};
  }
};
export default withRouter(
  connect(
    mapStateToProps,
    { fetchMember }
  )(ConfirmAppointment)
);
