import React, { Component } from "react";
import AppHeader from "../../Commons/AppHeader";
import AppFooter from "../../Commons/AppFooter";
import axios from "axios";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { Button, DatePicker, Icon, message } from "antd";
import { fetchMember } from "../../Actions/memberActions";
import "./style.css";

class ScheduleAppointmentContainer extends Component {
  constructor() {
    super();
    this.state = {
      // provider: {
      //   languages: [
      //     {
      //       _id: "5ba1cf5b7d45940708c63ec2",
      //       name: "English",
      //       createdAt: "2018-09-19T04:23:55.542Z",
      //       updatedAt: "2018-09-19T04:23:55.542Z",
      //       __v: 0
      //     },
      //     {
      //       _id: "5ba1cf5b7d45940708c63ec3",
      //       name: "Hindi",
      //       createdAt: "2018-09-19T04:23:55.586Z",
      //       updatedAt: "2018-09-19T04:23:55.586Z",
      //       __v: 0
      //     },
      //     {
      //       _id: "5ba1cf5b7d45940708c63ec4",
      //       name: "Odia",
      //       createdAt: "2018-09-19T04:23:55.636Z",
      //       updatedAt: "2018-09-19T04:23:55.636Z",
      //       __v: 0
      //     }
      //   ],
      //   _id: "5ba1d8bbc733a007f1377003",
      //   firstName: "Kunal",
      //   lastName: "Kumar",
      //   specialityId: {
      //     _id: "5ba1cf7bff629407096b262c",
      //     specialityName: "Cardiologist",
      //     createdAt: "2018-09-19T04:24:27.579Z",
      //     updatedAt: "2018-09-19T04:24:27.579Z",
      //     __v: 0
      //   },
      //   cityId: {
      //     _id: "5ba1d338db834907b66794e8",
      //     name: "Bengaluru",
      //     countryId: "5ba1d2eadb834907b66794e7",
      //     createdAt: "2018-09-19T04:40:24.395Z",
      //     updatedAt: "2018-09-19T04:40:24.395Z",
      //     __v: 0
      //   },
      //   bio: "I am Kunal, Dr. Kunal. This is my Bio.",
      //   photoUrl:
      //     "https://resolvingdiscoverydisputes.lexblogplatform.com/wp-content/uploads/sites/95/2015/01/Doctor.jpg",
      //   education: "",
      //   email: "kunal@gmail.com",
      //   phone: "1234567890",
      //   tags: "cardio",
      //   createdAt: "2018-09-19T05:03:55.272Z",
      //   updatedAt: "2018-09-19T05:03:55.272Z",
      //   __v: 0
      // },
      provider: null,
      bookingSlots: null,
      bookingSlotSelected: null,
      confirmationModalVisible: false,
      bookingDate: null
    };
    this.setConfirmationModelDisplay = this.setConfirmationModelDisplay.bind(
      this
    );
  }

  componentDidMount() {
    this.props.fetchMember();
    const provider = JSON.parse(localStorage.getItem("provider"));
    if (provider) {
      this.setState({ provider });
    } else {
      this.props.history.push("/member/search");
    }
  }

  async selectDate(date, dateString) {
    if (dateString) {
      let bookingSlots = await axios.post("/api/getBookingSlots", {
        providerId: this.state.provider._id,
        date: dateString
      });

      this.setState({
        bookingSlots: bookingSlots.data,
        bookingDate: dateString
      });
    }
  }

  handleSlotSelection(slot, id, slotBooked) {
    if (slotBooked) {
      message.error("This slot is already booked. Please try some other slot");
      return;
    }

    this.setState({ bookingSlotSelected: slot });
    var selectedBookingSlotBoxes = document.getElementsByClassName(
      "selectedBookingSlot"
    );
    for (var i = 0; i < selectedBookingSlotBoxes.length; i++) {
      selectedBookingSlotBoxes[i].classList.remove("selectedBookingSlot");
    }
    document.getElementById(id).classList.add("selectedBookingSlot");
  }

  renderBookingSlot() {
    return Object.keys(this.state.bookingSlots).map((slot, index) => {
      let slotClass = "";
      let slotBooked = false;
      if (this.state.bookingSlots[slot]["status"] == "pending") {
        slotClass = "availableSlotBox";
      } else if (this.state.bookingSlots[slot]["status"] == "booked") {
        slotClass = "bookedSlotBox";
        slotBooked = true;
      }
      return (
        <div
          className={slotClass}
          key={index}
          id={`availableSlotBox-${index}`}
          onClick={() => {
            this.handleSlotSelection(
              slot,
              `availableSlotBox-${index}`,
              slotBooked
            );
          }}
        >
          {slot} : 00
        </div>
      );
    });
  }

  setConfirmationModelDisplay(value) {
    this.setState({ confirmationModalVisible: value });
  }

  renderDocumentUpload() {
    localStorage.setItem("bookingDate", this.state.bookingDate);
    localStorage.setItem("bookingSlotSelected", this.state.bookingSlotSelected);
    this.props.history.push("/member/documentUpload");
  }

  renderNextButton() {
    if (this.state.bookingSlotSelected) {
      return (
        <div className="nextButton">
          {/* <Button
            type="primary"
            onClick={() => this.setConfirmationModelDisplay(true)}
          >
            Next
            <Icon type="right" />
          </Button> */}
          <Button type="primary" onClick={() => this.renderDocumentUpload()}>
            Next
            <Icon type="right" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className="nextButton">
          <Button type="primary" disabled>
            Next
            <Icon type="right" />
          </Button>
        </div>
      );
    }
  }

  disabledDate(current) {
    // Can not select days before today and today
    //
    return current < moment().add(-1, "days");
  }

  render() {
    //const provider = this.props.location.provider;
    {
      return this.state.provider ? (
        <div>
          <AppHeader />
          {/* {JSON.stringify(this.props.location.provider)} */}
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
              <div className="selectDateDiv">
                <h3>Appointment Date:&nbsp;</h3>
                <DatePicker
                  disabledDate={this.disabledDate}
                  onChange={(date, dateString) =>
                    this.selectDate(date, dateString)
                  }
                />
              </div>
            </div>
          </div>
          <div className="bookingSlotsDiv">
            {this.state.bookingSlots ? (
              <div className="bookingSlots">
                <div className="slotsHeading">Choose Slot:</div>
                {this.renderBookingSlot()}
                {this.renderNextButton()}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="bookingSlotDetailDiv">
            {this.state.bookingSlotSelected ? (
              <h2>
                Your chosen slot is:
                <b> {this.state.bookingSlotSelected} : 00 Hour</b>
              </h2>
            ) : (
              ""
            )}
          </div>
          <AppFooter />
          {/* <ConfirmBookingRequestModal
          confirmationModalVisible={this.state.confirmationModalVisible}
          setConfirmationModelDisplay={this.setConfirmationModelDisplay}
          provider={provider}
          bookingDate={this.state.bookingDate}
          bookingSlot={this.state.bookingSlotSelected}
        /> */}
        </div>
      ) : (
        <div />
      );
    }
  }
}

export default withRouter(
  connect(
    null,
    { fetchMember }
  )(ScheduleAppointmentContainer)
);
