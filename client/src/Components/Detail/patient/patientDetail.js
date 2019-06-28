import React, { Component, Fragment } from "react";
import { Button } from "antd";
import moment from "moment";
import { injectIntl } from "react-intl";
import messages from "./message";
import placeholder from "../../../Assets/images/ico-placeholder-userdp.svg";
import next from "../../../Assets/images/ico-calendar-nav-next.svg";
import verified from "../../../Assets/images/ico-verified.svg";
import notverified from "../../../Assets/images/ico-err.svg";
import mail from "../../../Assets/images/ico-mail-line.svg";
import call from "../../../Assets/images/ico-phone.svg";
import DoctorCard from "./doctorCard";
import { USER_CATEGORY, USER_STATUS } from "../../../constant";

class PatientDetail extends Component {
  onClickEditProfile = e => {
    e.preventDefault();
    const { handleEditProfile } = this.props;
    handleEditProfile();
  };

  handleClickDischarge = e => {
    e.preventDefault();
    const {
      openDischargePatient,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;
    //
    openDischargePatient([_id]);
  };

  handleClickVerify = e => {
    e.preventDefault();
    const {
      openDocumentsVerification,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;
    openDocumentsVerification(_id);
  };

  onClickDoctorCard = (entity, id) => {
    this.props.history.push(`/${entity}/${id}`);
  };

  render() {
    const {
      onClickEditProfile,
      handleClickDischarge,
      handleClickVerify,
      onClickDoctorCard
    } = this;
    const {
      intl: { formatMessage },
      user_data: {
        basicInfo = {},
        personalInfo = {},
        //createdAt,
        documents = {},
        programIds = [],
        status,
        insurance: { provider = "", policy, expiresOn } = {}
      },
      medicals_data: { basicCondition: { chiefComplaint } = {} } = {},
      countrySelector,
      citySelector,
      insurance_provider_data = {},
      case_doctors,
      care_coaches = {},
      hospitals_data,
      currentUser: { basicInfo: { category } = {} } = {}
    } = this.props;
    const {
      profilePicLink = placeholder,
      name: patientName,
      createdAt
    } = basicInfo;
    const {
      contactNo = {},
      dob,
      gender,
      homeAddress: patientHomeAddress = {},
      contacts = {},
      email
    } = personalInfo;
    const { consentFormVerified, idProofVerified } = documents;
    //idProofVerified consentFormVerified
    let isdocumentsVerified = false;
    if (documents) {
      //const { verified: isconsentFormVerified = false } = consentForm[0];
      //const { verified: isidProofVerified = false } = idProof[0];
      isdocumentsVerified = consentFormVerified && idProofVerified;
    }
    const insuranceProviderName = provider
      ? insurance_provider_data[provider].name
      : "";

    const policyExpireOn =
      expiresOn === null ? "" : moment(expiresOn).format("L");
    const {
      addressLine1,
      addressLine2,
      city = false,
      country = false
    } = patientHomeAddress;

    const {
      countryCode = "",
      phoneNumber = "",
      verified: iscontactVerified
    } = contactNo;
    const {
      doctor: doctorId,
      hospitalId,
      careCoach: careCoachId
    } = programIds[0];
    let casedoctorName = false;
    let speciality = false;
    let caseDoctorHomeAddress = false;
    let CaseDoctorCityName = false;
    let CaseDoctorCountryName = false;
    let doctorProfileDp = false;
    let caseDoctorId;
    let careCoach;
    if (category === USER_CATEGORY.DOCTOR && careCoachId) {
      const {
        _id,
        name: careCoachName,
        homeAddress: careCoachHomeAddress,
        profilePicLink: careCoachDp = placeholder
      } = care_coaches[careCoachId];
      careCoach = {
        _id: _id,
        name: careCoachName,
        dp: careCoachDp
      };

      if (careCoachHomeAddress) {
        const {
          city: careCoachCity = false,
          country: careCoachCountry = false
        } = careCoachHomeAddress;

        const careCoachCityName = careCoachCity
          ? citySelector(careCoachCountry, careCoachCity)
          : "";

        const careCoachCountryName = careCoachCountry
          ? countrySelector(careCoachCountry)
          : "";
        careCoach = {
          ...careCoach,
          country: careCoachCountryName,
          city: careCoachCityName
        };
      }
    }
    if (category === USER_CATEGORY.CARE_COACH && doctorId) {
      const {
        _id,
        name: doctorName,
        homeAddress: doctorhomeAddress,
        speciality: doctorspeciality,
        profilePicLink: doctorDp = placeholder
      } = case_doctors[doctorId];
      caseDoctorId = _id;
      casedoctorName = doctorName;
      speciality = doctorspeciality;
      caseDoctorHomeAddress = doctorhomeAddress;
      doctorProfileDp = doctorDp;

      let caseDoctorCity = false;
      let caseDoctorCountry = false;
      if (caseDoctorHomeAddress) {
        const {
          city: DoctorCity = false,
          country: DoctorCountry = false
        } = caseDoctorHomeAddress;
        caseDoctorCity = DoctorCity;
        caseDoctorCountry = DoctorCountry;
      }
      CaseDoctorCityName = caseDoctorCity
        ? citySelector(caseDoctorCountry, caseDoctorCity)
        : "";

      CaseDoctorCountryName = caseDoctorCountry
        ? countrySelector(caseDoctorCountry)
        : "";
    }

    const {
      emergencyContact: {
        name: emergencyContactName,
        contactNo: emergencyContactNo = {}
      } = {},
      relatives: { relation } = {},
      useRelativeAsEmergencyContact
    } = contacts;

    const {
      countryCode: emergencyContactCountryCode,
      phoneNumber: emergencyContactphoneNumber
    } = emergencyContactNo;

    let hospitalName = "";
    if (hospitalId) {
      const { name: hospital } = hospitals_data[hospitalId];
      hospitalName = hospital;
    }
    //
    const homeCountryName = country ? countrySelector(country) : "";

    const homeCityName = city ? citySelector(country, city) : "";

    // const homeCountryName = "";
    // const homeCityName = ""
    const enrolledOnDate = moment(createdAt).format("L");

    const enrolledOnTime = moment(createdAt).format("LT");
    const patientAge = dob !== null ? moment().diff(dob, "years", false) : "";
    const isDisabled = status !== USER_STATUS.ENROLLED ? true : false;
    const isDischargeDisabled =
      status === USER_STATUS.DISCHARGED ? true : false;

    return (
      <Fragment>
        <div className="patientDetail">
          <div className="flex imageandButton">
            <img alt="" src={profilePicLink} className="patientDp" />
            {category === USER_CATEGORY.CARE_COACH && (
              <Button
                className="editProfile fontsize14 dark bold"
                size="small"
                onClick={onClickEditProfile}
                disabled={isDisabled}
              >
                {formatMessage(messages.EditProfile)}
              </Button>
            )}
          </div>
          <div className="fontsize12 enrolledon">
            {formatMessage(messages.EnrolledOn)} {enrolledOnDate},{" "}
            {enrolledOnTime}
          </div>
          <div className="fontsize22 name">
            {patientName} ({patientAge} {gender})
          </div>
          <div className="fontsize14 disease word-break-break-all">
            {chiefComplaint}
          </div>
          <div className="fontsize12 address word-break-break-all">
            {addressLine1},{addressLine2},{homeCityName},{homeCountryName}
          </div>
          <div className="horizontalLine" />
          <div
            className={`flex justify-content-space-between align-items-center 
            ${
              isDisabled
                ? "document-verification-disabled"
                : "document-verification"
            }`}
            disabled={isDischargeDisabled}
            onClick={!isDischargeDisabled ? handleClickVerify : undefined}
          >
            <div className="fontsize14 consent">
              {formatMessage(messages.ConsentIdVerification)}{" "}
              <img alt="" src={next} className="clickable" />
            </div>
            <div>
              {isdocumentsVerified ? (
                <div className="verified">
                  <img className="verifiedImg mr5" alt="" src={verified} />{" "}
                  {formatMessage(messages.Verified)}
                </div>
              ) : (
                <div className="notVerified flex align-items-center">
                  <img className="verifiedImg mr5" alt="" src={notverified} />{" "}
                  {formatMessage(messages.NotVerified)}
                </div>
              )}
            </div>
            <div />
          </div>
          <div className="horizontalLine" />
          <div className="insurance">{formatMessage(messages.Insurance)}</div>
          <div>
            <div className="insuranceData">
              {formatMessage(messages.MedicalInsuranceProvider)}
            </div>
            <div>{insuranceProviderName}</div>
            <div className="insuranceData">
              {formatMessage(messages.InsurancePolicy)}
            </div>
            <div>{policy}</div>
            <div className="insuranceData">
              {formatMessage(messages.ValidTill)}
            </div>
            <div>{policyExpireOn}</div>
          </div>
          <div className="contact">{formatMessage(messages.Contacts)}</div>
          <div className="personal">{formatMessage(messages.Personal)}</div>
          <div className="flex justify-content-space-between align-items-center">
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
            {phoneNumber && (
              <div>
                {iscontactVerified ? (
                  <div className="verified flex align-items-center">
                    <img
                      className="verifiedImg mr5 flex align-items-center"
                      alt=""
                      src={verified}
                    />
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
            )}
          </div>
          <div className="others">{formatMessage(messages.Others)}</div>
          <div className="flex justify-content-space-between align-items-center mb8">
            <div className="othersDataTitle">
              {`${
                category === USER_CATEGORY.CARE_COACH
                  ? formatMessage(messages.CaseDoctor)
                  : formatMessage(messages.careCoach)
              }`}
            </div>
            {/* <img alt="" src={call} className="others-call-icon" /> */}
          </div>
          {category === USER_CATEGORY.DOCTOR && careCoach && (
            <div className="mb16">
              {
                <DoctorCard
                  name={careCoach.name}
                  id={careCoach.id}
                  city={careCoach.city}
                  country={careCoach.country}
                  doctorDp={careCoach.dp}
                />
              }
            </div>
          )}
          {category === USER_CATEGORY.CARE_COACH && casedoctorName && (
            <div className="mb16">
              {
                <DoctorCard
                  name={casedoctorName}
                  id={caseDoctorId}
                  city={CaseDoctorCityName}
                  country={CaseDoctorCountryName}
                  speciality={speciality}
                  doctorDp={doctorProfileDp}
                  onClick={onClickDoctorCard}
                />
              }
            </div>
          )}

          <div className="othersDataTitle mb4">
            {formatMessage(messages.Hospital)}
          </div>
          <div className="flex justify-content-space-between align-items-center">
            <div>{hospitalName}</div>
            {/* {hospitalName && (
              <img alt="" src={call} className="others-call-icon" />
            )} */}
          </div>
          <div className="othersDataTitle mb4 mt16">
            {formatMessage(messages.EmergencyContact)}
          </div>
          <div className="flex justify-content-space-between align-items-center word-break-break-all">
            <div>
              {emergencyContactName}
              {useRelativeAsEmergencyContact && `(${relation})`}
            </div>
            {/* {emergencyContactName && (
              <img alt="" src={call} className="others-call-icon" />
            )} */}
          </div>
          <div className="dark fontsize14 mt8">
            {emergencyContactCountryCode}
            {emergencyContactphoneNumber}
          </div>
          <div className="horizontalLine mt40" />
          {category === USER_CATEGORY.CARE_COACH && (
            <div className="dischage">
              <Button
                className="dischageButton"
                type="danger"
                ghost
                onClick={handleClickDischarge}
                disabled={isDischargeDisabled}
              >
                {formatMessage(messages.Discharge)}
              </Button>
            </div>
          )}
        </div>
        {/* <CommonSuccessMsg className={"dashboard-success-msg"} /> */}
      </Fragment>
    );
  }
}

export default injectIntl(PatientDetail);
