import React, { Component, Fragment } from "react";
import moment from "moment";
import placeholder from "../../../../Assets/images/ico-placeholder-userdp.svg";
import Calendar from "../../../Containers/Calendar";
import AppointmentsHistory from "../../../Containers/AppointmentsHistory";
import Spin from "antd/es/spin";
import Footer from "./footer";
import "../style.less";

const CALENDAR = "calendar";

class PatientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      isLoading: true,
      showHistory: false,
      currentTab: CALENDAR
    };
  }

  componentDidMount() {
    const { userId } = this.props;
    this.setState({ userId });
    this.props.fetchUser(userId).then(() => {
      this.setState({ isLoading: false });
    });
  }

  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  toggleHistory = () => {
    this.setState(prevState => {
      return { showHistory: !prevState.showHistory };
    });
  };

  selectMenu = key => {
    this.setState({ currentTab: key });
  };

  openVerificationModal = () => {
    const { openDocumentsVerification, userId } = this.props;
    openDocumentsVerification(userId);
  };

  openAddAppointment = () => {};

  render() {
    const {
      userId: id,
      userData = {},
      medicalsData: { basicCondition: { chiefComplaint } = {} } = {},
      countrySelector,
      citySelector,
      showCalendar
    } = this.props;
    const {
      basicInfo: { profilePicLink = placeholder, name } = {},
      personalInfo: { dob, gender, homeAddress = {} } = {}
    } = userData;
    const age = dob !== null ? moment().diff(dob, "years", false) : "";
    const {
      addressLine1 = "",
      addressLine2 = "",
      city = false,
      country = false
    } = homeAddress;
    const homeCountryName = country ? countrySelector(country) : "";
    const homeCityName = city ? citySelector(country, city) : "";
    const { isLoading, showHistory, currentTab } = this.state;
    console.log("---- Patient Details Page Props ----", this.props);

    return (
      <Fragment>
        {isLoading && (
          <div className="loading">
            <Spin />
          </div>
        )}
        <div className="patient-details-body hide-scroll">
          {!isLoading && (
            <Fragment>
              <div className="profile-info">
                <div className="profile-brief">
                  <div className="display-picture">
                    <img
                      alt=""
                      src={profilePicLink}
                      className="display-picture"
                    />
                  </div>
                  <div className="brief-section">
                    <div className="fontsize22 main-text">
                      {name} ({age} {gender})
                    </div>
                    {chiefComplaint && (
                      <div className="fontsize14 chief-complaint">
                        {chiefComplaint}
                      </div>
                    )}
                    {homeAddress && (
                      <div className="fontsize12 address">
                        {addressLine1},{addressLine2},{homeCityName},
                        {homeCountryName}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className="view-profile-button"
                  onClick={this.openVerificationModal}
                >
                  View Profile
                </div>
              </div>
              {!showHistory && currentTab === CALENDAR && showCalendar && (
                <Calendar {...this.props} calendarUserId={id} />
              )}
              {showHistory && currentTab === CALENDAR && showCalendar && (
                <AppointmentsHistory userId={id} />
              )}
            </Fragment>
          )}
        </div>
        <Footer
          showHistory={showHistory}
          currentTab={currentTab}
          {...this.props}
          toggleHistory={this.toggleHistory}
          selectMenu={this.selectMenu}
          openAddAppointment={this.openAddAppointment}
          goBack={this.goBack}
        />
      </Fragment>
    );
  }
}

export default PatientProfile;
