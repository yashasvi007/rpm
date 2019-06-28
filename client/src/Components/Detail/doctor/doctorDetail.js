import React, { Component, Fragment } from "react";
import { Button } from "antd";
import { injectIntl } from "react-intl";
import messages from "./message";
import placeholder from "../../../Assets/images/ico-placeholder-userdp.svg";
import verified from "../../../Assets/images/ico-verified.svg";
import notverified from "../../../Assets/images/ico-err.svg";
import mail from "../../../Assets/images/ico-mail-line.svg";
import call from "../../../Assets/images/ico-phone.svg";
import isEmpty from "lodash-es/isEmpty";

class PatientDetail extends Component {
  onClickEditProfile = e => {
    e.preventDefault();
    const { handleEditProfile } = this.props;
    handleEditProfile();
  };

  render() {
    const { onClickEditProfile } = this;
    const {
      intl: { formatMessage },
      user_data: { basicInfo = {}, personalInfo = {}, work = {} },
      countrySelector,
      citySelector
    } = this.props;

    const {
      about,
      organizationName,
      officeAddress = {},
      speciality,
      licenseNumber
    } = work;

    const { addressLine1, addressLine2, city, country } = officeAddress;

    const { profilePicLink = placeholder, name } = basicInfo;
    const { contactNo, email } = personalInfo;
    const { countryCode, phoneNumber, verified: iscontactVerified } = contactNo;
    const workCountryName = !isEmpty(officeAddress)
      ? countrySelector(country)
      : "";
    const workCityName = !isEmpty(officeAddress)
      ? citySelector(country, city)
      : "";

    return (
      <Fragment>
        <div className="patientDetail">
          <div className="flex imageandButton">
            <img alt="" src={profilePicLink} className="patientDp" />
            <Button
              className="editProfile"
              size="small"
              onClick={onClickEditProfile}
            >
              {formatMessage(messages.EditProfile)}
            </Button>
          </div>
          {licenseNumber && (
            <div className="dark fontsize12 license flex align-items-center mt16 pl8 pr8 ">{`License: ${licenseNumber}`}</div>
          )}
          <div className="dark fontsize22 mt4">{`Dr. ${name}`}</div>
          <div className="dark medium mt4">{speciality}</div>
          <div className="dark">{organizationName}</div>
          <div className="steel-grey fontsize12">{`${
            addressLine1 ? addressLine1 + "," : ""
          } ${addressLine2 ? addressLine2 + "," : ""} ${
            workCityName !== "" ? workCityName + "," : ""
          }, ${workCountryName ? workCountryName + "," : ""}`}</div>
          <div className="fontsize12 black mt16">{about}</div>
          <div className="contact">{"Contact"}</div>
          <div className="flex justify-content-space-between align-items-center mt8">
            <div className="contact-detail">
              <img alt="" src={mail} className="contact-icon-mail" />
              {email}
            </div>
            <div className="verified flex align-items-center">
              <img className="verifiedImg mr5" alt="" src={verified} />{" "}
              {formatMessage(messages.Verified)}
            </div>
          </div>
          <div className="flex justify-content-space-between align-items-center mt8">
            <div className="contact-detail">
              <img alt="" src={call} className="contact-icon-call" />
              {countryCode}
              {phoneNumber}
            </div>
            <div>
              {iscontactVerified ? (
                <div className="verified flex align-items-center">
                  <img className="verifiedImg mr5" alt="" src={verified} />
                  {formatMessage(messages.Verified)}
                </div>
              ) : (
                <div className="notVerified  flex align-items-center">
                  <img
                    className="verifiedImg mr5 flex align-items-center"
                    alt=""
                    src={notverified}
                  />{" "}
                  {formatMessage(messages.NotVerified)}
                </div>
              )}
            </div>
          </div>
          <div className="horizontalLine" />
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(PatientDetail);
