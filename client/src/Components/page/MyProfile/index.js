import React, { Component } from "react";
import { Button, Col, Row, List } from "antd";
import moment from "moment";
import forIn from "lodash-es/forIn";
import isEmpty from "lodash-es/isEmpty";
import { Element } from "react-scroll";
import { injectIntl } from "react-intl";

import verifiedIcon from "../../../Assets/images/ico-verified.svg";
import notVerifiedIcon from "../../../Assets/images/ico-caution.svg";
import placeHolder from "../../../Assets/images/ico_placeholder_userdp.png";
import messageIcon from "../../../Assets/images/ico-message.svg";
import rightArrow from "../../../Assets/images/material-icons-black-arrow-drop-down.png";
import checkBoxTrue from "../../../Assets/images/checked-box.svg";
import checkBoxFalse from "../../../Assets/images/unchecked-box.svg";
import callIcon from "../../../Assets/images/ico-phone.svg";

import DoctorSection from "../EditProfile/doctor";
import CareCoachSection from "../EditProfile/careCoach";
import PatientSection from "../EditProfile/patient";
import ProgramAdminSection from "../EditProfile/programAdmin";
import AppHeader from "../../../Containers/Header";
import { MobileLabel } from "../../MobileInput";
import messages from "./message";
import { path } from "../../../constant";
import config from "../../../config";
const DOCTOR = "doctor";
const CARECOACH = "careCoach";
const PATIENT = "patient";
const PROGRAMADMIN = "programAdmin";
const CONTENTFORM = "ContentForm";
const IDPROOF = "IdProof";

// const testTemplate = {
//   ABI_TEST: {
//     content: {
//       arm: {
//         content: {
//           left: "Left",
//           right: "Right",
//           suffix: "mmHg"
//         },
//         label: "Arm"
//       },
//       leftAnkle: {
//         content: {
//           pt: "PT",
//           dt: "DT",
//           suffix: "mmHg"
//         },
//         label: "Left Ankle"
//       },
//       rightAnkle: {
//         content: {
//           pt: "PT",
//           dt: "DT",
//           suffix: "mmHg"
//         },
//         label: "Right Ankle"
//       },
//       abiIndex: {
//         content: {
//           overAllAbiIndex: "Over All ABI Index",
//           suffix: "mmHg"
//         },
//         label: "ABI Index"
//       }
//     },
//     label: "ABI Test"
//   }
// };

const isBlank = data => {
  return data.length === 0 ? true : false;
};

const SkipAndGotoDashBoard = ({ gotoDashBoard, gotoEditProfile, intl }) => {
  const { formatMessage } = intl;
  return (
    <div className="pull-right">
      <Button
        className="iqvia-outline-btn"
        ghost
        onClick={() => {
          gotoDashBoard();
        }}
      >
        {formatMessage(messages.goToDashBoard)}
      </Button>
      <Button
        type="primary"
        className="ml10 iqvia-primary-btn"
        onClick={gotoEditProfile}
      >
        {formatMessage(messages.edit)}
      </Button>
    </div>
  );
};

const UPDATEDAT = "updatedAt";

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testTemplate: {}
    };
    this.gotoDashBoard = this.gotoDashBoard.bind(this);
    this.gotoEditProfile = this.gotoEditProfile.bind(this);
  }

  componentDidMount() {
    const { getData } = this.props;
    getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.clinicalTestTemplates_data !==
      prevProps.clinicalTestTemplates_data
    ) {
      const {
        clinicalTestTemplates_data,
        user_data: { programIds }
      } = this.props;
      const { id: programId } = programIds[0];

      this.setState({ testTemplate: clinicalTestTemplates_data[programId] });
    }
  }

  gotoDashBoard() {
    this.props.history.push(path.DASHBOARD.HOME);
  }

  gotoEditProfile() {
    this.props.history.push(path.EDIT_PROFILE);
  }

  openConsentForm = purpose => {
    // e.preventDefault();

    // this.props.history.push(path.CONSENT_FORM);
    const {
      openDocumentsVerification,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;

    openDocumentsVerification(_id, purpose);
  };

  openIdProof = e => {
    e.preventDefault();
    this.props.history.push(path.ID_PROOF);
  };

  getMenuBar = category => {
    let menubar = null;
    switch (category) {
      case DOCTOR:
        menubar = DoctorSection.Menubar;
        break;
      case CARECOACH:
        menubar = CareCoachSection.Menubar;
        break;
      case PATIENT:
        menubar = PatientSection.Menubar;
        break;
      case PROGRAMADMIN:
        menubar = ProgramAdminSection.Menubar;
        break;
      default:
        break;
    }
    return menubar;
  };

  getTags = (data = []) => {
    let content = [];

    data.forEach((value, index) => {
      if (!isBlank(value)) {
        content.push(
          <span className="iqvia-tag mr8" key={index}>
            {value}
          </span>
        );
      }
    });
    return content;
  };

  getInputElement = (currentContext, content) => {
    let inputs = [];

    //
    forIn(content, (value, key) => {
      inputs.push(
        <div key={key} className="mt8">
          <div className="fontSize12 label-color">{currentContext[key]}</div>
          <div className="flex baseline mr30">
            <span className=" fontsize16 mr8">{value}</span>
            <span className=" fontsize12 subdued">{currentContext.suffix}</span>
          </div>
        </div>
      );
    });
    return inputs;
  };

  getReadingAttributeForTest = (currentContext, content) => {
    let contents = [];
    // (currentContext, content)
    forIn(content, (value, key) => {
      if (key !== UPDATEDAT) {
        contents.push(
          <div key={key} className="mb20">
            <div className="fontsize14 medium">{currentContext[key].label}</div>
            <div className="flex">
              {this.getInputElement(currentContext[key].content, value)}
            </div>
          </div>
        );
      }
    });
    return contents;
  };
  getClinicalReadings = (data, currentTest) => {
    let medicalReadings = [];
    const { testTemplate } = this.state;

    if (testTemplate) {
      data.forEach((element, index) => {
        medicalReadings.push(
          <div key={index} className="mt16">
            <div
              className="fontsize14 mt10 mb10 "
              style={{ fontFamily: "AvenirNext-Bold" }}
            >
              {testTemplate[currentTest].label}
            </div>
            <div>
              {this.getReadingAttributeForTest(
                testTemplate[currentTest].content,
                element
              )}
            </div>
          </div>
        );
      });
    }
    return medicalReadings;
  };

  openChangePassword = e => {
    e.preventDefault();
    this.props.history.push("/change-password");
  };

  handleOpenChangePasswordModal = () => {
    const {
      openChangePassword,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;

    openChangePassword(_id);
  };

  gotoMyProfile = e => {
    e.preventDefault();
    this.props.history.push("/my-profile");
  };

  render() {
    const {
      user_data,
      isLoading = true,
      citySelector,
      countrySelector,
      care_coaches,
      case_doctors,
      hospital_data: hospitals = {},
      medicals_data: medicalsData = {},
      insurance_provider_data = {},
      intl: { formatMessage, locale }
    } = this.props;

    if (isLoading) {
      return <div />;
    }
    const {
      basicInfo = {},
      work = {},
      settings = {},
      personalInfo = {},
      programIds = [],
      documents = {},
      insurance: { provider, policy, expiresOn: validTill } = {}
    } = user_data;

    let expiresOn;
    if (validTill) {
      expiresOn = new moment(validTill).format("DD/MM/YYYY");
    }

    let providerName;
    if (provider) {
      const providerData = insurance_provider_data[provider];
      providerName = providerData.name;
    }

    const { idProof = [], consentForm = [] } = documents;

    let idProofUploadDate;
    let consentFormUploadDate;
    const { uploadedOn: idProofUploadedOn } = idProof[0] || {};
    const { uploadedOn: consentFormUploadedOn } = consentForm[0] || {};

    if (idProofUploadedOn)
      idProofUploadDate = new moment(idProofUploadedOn).format(
        "DD/MM/YYYY hh:mm A"
      );
    if (consentFormUploadedOn)
      consentFormUploadDate = new moment(consentFormUploadedOn).format(
        "DD/MM/YYYY hh:mm A"
      );

    let careCoach = {};
    let caseDoctor = {};
    let hospital = {};
    if (programIds.length > 0) {
      const {
        careCoach: careCoachId,
        doctor: doctorId,
        hospitalId
      } = programIds[0];
      careCoach = care_coaches[careCoachId] || {};
      caseDoctor = case_doctors[doctorId] || {};
      hospital = hospitals[hospitalId] || {};
    }

    // let hospital = {};
    // if (hospitalId) {
    //   hospital = hospitals[hospitalId];
    // }

    const {
      category,
      name,
      //id: currentUserId,
      profilePicLink = placeHolder
    } = basicInfo;
    const {
      homeAddress = {},
      contactNo = {},
      email,
      dob: DOB,
      gender
    } = personalInfo;
    const {
      isCalendarSynced = false,
      preferences: {
        smsAlerts = false,
        emailAlerts = false,
        pushAlerts = false,
        reminderAlerts = false
      } = {}
    } = settings;

    const {
      organizationName,
      speciality,
      officeAddress = {},
      licenseNumber,
      about,
      services: servicesValue = ""
    } = work;

    const {
      addressLine1: workAddressLine1,
      addressLine2: workAddressLine2,
      city: workCity = false,
      country: workCountry = false,
      zipCode: workZipCode
    } = officeAddress;

    const {
      addressLine1,
      addressLine2,
      city = false,
      country = false,
      zipCode
    } = homeAddress;

    const homeCountryName = country ? countrySelector(country) : "";
    const homeCityName = city ? citySelector(country, city) : "";

    console.log("ajsbfkjashfkjasf", homeCityName);

    const workCountryName = workCountry ? countrySelector(workCountry) : "";
    const workCityName = workCity ? citySelector(workCountry, workCity) : "";

    const Menubar = this.getMenuBar(category);

    const { services = {}, personalInfo: { contacts = {} } = {} } = user_data;
    const dateOfBirth = moment(DOB);

    let dob = "";
    if (dateOfBirth.isValid()) {
      const today = moment();
      const age = today.get("year") - dateOfBirth.get("year");
      dob = `${dateOfBirth.format("DD/MM/YYYY")}, ${age}  years old`;
    }

    const { countryCode = "+91", phoneNumber = "" } = contactNo;

    let accountsContent = [];
    accountsContent.push(
      <div
        key="1"
        className="content-space-between full-width flex align-items-center settings clickable"
        onClick={this.handleOpenChangePasswordModal}
      >
        <div className="fontsize14">
          {formatMessage(messages.changePassword)}
        </div>
        <img alt="" style={{ marginRight: "-4px" }} src={rightArrow} />
      </div>
    );
    if (config.CALENDAR_SYNC === true) {
      accountsContent.push(
        <div
          key="2"
          className="content-space-between full-width flex align-items-center settings"
        >
          <div className="fontsize14">
            {formatMessage(messages.calendarSync)}
          </div>
          <img alt="" src={isCalendarSynced ? checkBoxTrue : checkBoxFalse} />
        </div>
      );
    }

    if (category === PATIENT) {
      accountsContent.push(
        <div
          key="3"
          onClick={e => this.openConsentForm(CONTENTFORM)}
          className="content-space-between full-width flex align-items-center"
        >
          <div className="full-width">
            <div>{formatMessage(messages.consentForm)}</div>
            <div className="fontsize12 cool-grey">{`${formatMessage(
              messages.uploadedOn
            )} ${consentFormUploadDate} `}</div>
          </div>
          <img alt="" style={{ marginRight: "-4px" }} src={rightArrow} />
        </div>
      );

      accountsContent.push(
        <div
          key="4"
          onClick={e => this.openConsentForm(IDPROOF)}
          className="content-space-between full-width flex align-items-center"
        >
          <div className="full-width">
            <div>{formatMessage(messages.idProof)}</div>
            <div className="fontsize12 cool-grey">{`${formatMessage(
              messages.uploadedOn
            )} ${idProofUploadDate} `}</div>
          </div>
          <img alt="" style={{ marginRight: "-4px" }} src={rightArrow} />
        </div>
      );
    }

    let notificationsContent = [];

    notificationsContent.push(
      <div key={1} className="full-width">
        <div className="content-space-between full-width flex align-items-center settings">
          <div className="fontsize14">{formatMessage(messages.smsAlerts)}</div>
          <img alt="" src={smsAlerts ? checkBoxTrue : checkBoxFalse} />
        </div>
        <div className=" fontsize12 subdued">
          {formatMessage(messages.smsAlertsDetail)}
        </div>
      </div>
    );
    notificationsContent.push(
      <div key={2} className="full-width">
        <div className="content-space-between full-width flex align-items-center settings">
          <div className="fontsize14" onClick={e => {}}>
            {formatMessage(messages.emailAlerts)}
          </div>
          <img alt="" src={emailAlerts ? checkBoxTrue : checkBoxFalse} />
        </div>
        <div className=" fontsize12 subdued">
          {formatMessage(messages.emailAlertsDetail)}
        </div>
      </div>
    );
    notificationsContent.push(
      <div key={3} className="full-width">
        <div className="content-space-between full-width flex align-items-center settings">
          <p className="fontsize14">{formatMessage(messages.pushAlerts)}</p>
          <img alt="" src={pushAlerts ? checkBoxTrue : checkBoxFalse} />
        </div>
        <div className=" fontsize12 subdued">
          {formatMessage(messages.pushAlertsDetail)}
        </div>
      </div>
    );
    notificationsContent.push(
      <div key={4} className="full-width">
        <div className="content-space-between full-width flex align-items-center settings">
          <div>{formatMessage(messages.reminderAlerts)}</div>
          <img alt="" src={reminderAlerts ? checkBoxTrue : checkBoxFalse} />
        </div>
        <div className="subdued">
          {formatMessage(messages.reminderAlertsDetail)}
        </div>
      </div>
    );

    const {
      homeHealthCare = {},
      specialCare = {},
      nonMedicalServices = {}
    } = services;

    const homeHealthCareServices = [
      {
        title: formatMessage(messages.nursingTitle),
        value: homeHealthCare.nursing || false,
        subtitle: formatMessage(messages.nursing)
      },
      {
        title: formatMessage(messages.physicalTherapyTitle),
        value: homeHealthCare.physicalTherapy || false,
        subtitle: formatMessage(messages.physicalTherapy)
      },
      {
        title: formatMessage(messages.occupationalTherapyTitle),
        value: homeHealthCare.occupationalTherapy || false,
        subtitle: formatMessage(messages.occupationalTherapy)
      },
      {
        title: formatMessage(messages.speechAndLanguagePathologyTitle),
        value: homeHealthCare.speechPathology || false,
        subtitle: formatMessage(messages.speechAndLanguagePathology)
      },
      {
        title: formatMessage(messages.medicalCounsellingTitle),
        value: homeHealthCare.medicalCounselling || false,
        subtitle: formatMessage(messages.medicalCounselling)
      },
      {
        title: formatMessage(messages.healthAideTitle),
        value: homeHealthCare.healthAide || false,
        subtitle: formatMessage(messages.healthAide)
      }
    ];

    const specialCareValues = [
      {
        title: formatMessage(messages.cardiacCareTitle),
        value: specialCare.cardiacCare || false,
        subtitle: formatMessage(messages.cardiacCare)
      },
      {
        title: formatMessage(messages.diabetesCareTitle),
        value: specialCare.diabetesCare || false,
        subtitle: formatMessage(messages.diabetesCare)
      },
      {
        title: formatMessage(messages.smokingCessationTitle),
        value: specialCare.smokingCessation || false,
        subtitle: formatMessage(messages.smokingCessation)
      }
    ];

    const nonMedicalService = [
      {
        title: formatMessage(messages.respiteCareTitle),
        value: nonMedicalServices.respiteCare || false,
        subtitle: formatMessage(messages.respiteCare)
      },
      {
        title: formatMessage(messages.homemakingTitle),
        value: nonMedicalServices.homeMaking || false,
        subtitle: formatMessage(messages.homemaking)
      }
    ];

    let homeHealthCareServiceContent = [];

    homeHealthCareServices.forEach((data, index) => {
      homeHealthCareServiceContent.push(
        <div key={index} className="full-width">
          <div className="content-space-between full-width flex align-items-center settings">
            <div className="fontsize14">{data.title}</div>
            <img alt="" src={data.value ? checkBoxTrue : checkBoxFalse} />
          </div>
          <div className=" fontsize12 subdued">{data.subtitle}</div>
        </div>
      );
    });

    let specialCareContent = [];

    specialCareValues.forEach((data, index) => {
      specialCareContent.push(
        <div key={index} className="full-width">
          <div className="content-space-between full-width flex align-items-center settings">
            <div className="fontsize14">{data.title}</div>
            <img alt="" src={data.value ? checkBoxTrue : checkBoxFalse} />
          </div>
          <div className=" fontsize12 subdued">{data.subtitle}</div>
        </div>
      );
    });

    const nonMedicalServiceContent = [];
    nonMedicalService.forEach((data, index) => {
      nonMedicalServiceContent.push(
        <div key={index} className="full-width">
          <div className="content-space-between full-width flex align-items-center settings">
            <div className="fontsize14">{data.title}</div>
            <img alt="" src={data.value ? checkBoxTrue : checkBoxFalse} />
          </div>
          <div className="fontsize12 subdued">{data.subtitle}</div>
        </div>
      );
    });

    const {
      relatives = {},
      emergencyContact = {},
      useRelativeAsEmergencyContact = false
    } = contacts;

    const {
      name: relativeName,
      contactNo: relativeContactNo = {},
      relation: relativeRelation
    } = relatives;

    const {
      countryCode: relativeCountryCode = "",
      phoneNumber: relativeNo = ""
    } = relativeContactNo;

    const relativePhoneNumber = relativeNo;

    const {
      name: emergencyContactName,
      contactNo: emergencyContactNo = {}
    } = emergencyContact;

    const {
      countryCode: emergencyCountryCode = "",
      phoneNumber: emergencyNo = ""
    } = emergencyContactNo;

    const emergencyPhoneNumber = emergencyNo;
    const {
      basicCondition = {},
      vitals = {},
      clinicalReadings = []
    } = medicalsData;
    const {
      chiefComplaint = "",
      allergies = "",
      surgeriesOrFracture = "",
      others = ""
    } = basicCondition;
    const {
      temperatureUnit = "c",
      temperature,
      respirationRate,
      pulse,
      bloodPressure
    } = vitals;

    let temperatureVal = "";

    if (temperature) {
      const val = parseInt(temperature);
      if (temperatureUnit === "c") {
        temperatureVal =
          temperature +
          "℃ / " +
          Math.round(((val * 9) / 5 + 32) * 100) / 100 +
          "℉";
      } else {
        temperatureVal =
          (Math.round(((val - 32) * 5) / 9) * 100) / 100 +
          "℃ / " +
          temperature +
          "℉";
      }
    }

    const testsTakenByPatient = Object.keys(clinicalReadings);
    const { testTemplate } = this.state;

    // let allTests = clinicalReadings;

    let medicalReadings = [];
    if (!isEmpty(testTemplate)) {
      medicalReadings = testsTakenByPatient.map(test => {
        let allTests = [];
        allTests.push(clinicalReadings[test].data);

        return this.getClinicalReadings(allTests, test);
      });
    }
    const allergiesTags = this.getTags(allergies.split(","));
    const surgeriesOrFractureTags = this.getTags(
      surgeriesOrFracture.split(",")
    );
    const othersTags = this.getTags(others.split(","));
    const servicesTags = this.getTags(servicesValue.split(","));

    return (
      <div id="my-profile">
        <AppHeader />

        <Row>
          <Col xs={0} sm={0} md={0} lg={12} xl={12} xxl={12} className="h100">
            <Row className={"fixed_header_sticky h100"}>
              <Col
                xs={0}
                sm={0}
                md={0}
                lg={2}
                xl={2}
                xxl={2}
                className={"h100"}
              >
                <div
                  className={
                    "flex align-items-center justify-content-start h100 fontsize22 regular pl20"
                  }
                >
                  {formatMessage(messages.myProfile)}
                </div>
              </Col>
              <Col
                xs={0}
                sm={0}
                md={0}
                lg={7}
                xl={7}
                xxl={7}
                className={"h100 menubar"}
              >
                <Menubar />
              </Col>
              <Col
                xs={0}
                sm={0}
                md={0}
                lg={3}
                xl={3}
                xxl={3}
                className={"h100"}
              >
                <div className="pull-right flex align-items-center justify-content-center h100 pr20">
                  <Button
                    className="iqvia-outline-btn"
                    ghost
                    onClick={this.gotoDashBoard}
                  >
                    {formatMessage(messages.goToDashBoard)}
                  </Button>
                  <Button
                    type="primary"
                    className="ml10 iqvia-primary-btn"
                    onClick={this.gotoEditProfile}
                  >
                    {formatMessage(messages.edit)}
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="flex column align-items-center">
          <div className=" main-iqvia-container flex row align-items-center justify-content-center pb-100 my_profile_wrapper ">
            <Row
              type="flex"
              align="middle"
              justify="center"
              className="full-width"
            >
              <Col
                xs={12}
                sm={12}
                md={7}
                lg={0}
                xl={0}
                xxl={0}
                className={"mt30"}
              >
                <div className={"fontsize22 pb10 "}>
                  {formatMessage(messages.myProfile)}
                </div>
              </Col>
              <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
                <div id="personal">
                  <Element name="personal">
                    <div className="bold pb10 fontsize18">
                      {formatMessage(messages.personal)}
                    </div>
                    <div
                      className="flex align-items-center justify-content-center relative"
                      style={{ margin: "20px 0" }}
                    >
                      <div
                        className={"block br50 relative"}
                        style={{ width: "100px", height: "100px" }}
                      >
                        <img
                          alt=""
                          src={profilePicLink}
                          className={"block w100"}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex">
                        <div className="mr-10 label-color fontsize12">
                          {formatMessage(messages.email)}
                        </div>
                        <img
                          alt=""
                          style={{ width: "13px", marginRight: "5px" }}
                          src={verifiedIcon}
                        />
                        <div
                          className={"fontsize12"}
                          style={{ color: "#43b02a" }}
                        >
                          {formatMessage(messages.verified)}
                        </div>
                      </label>
                      <div className={"fontsize16 "}>{email}</div>
                    </div>

                    <div className={"mt16"}>
                      <label className="flex row align-items-center justify-content-start  mb5">
                        <div className="mr-10 fontsize12 label-color">
                          {formatMessage(messages.mobile)}
                        </div>
                        <img
                          alt=""
                          style={{ width: "13px", marginRight: "5px" }}
                          src={
                            contactNo.verified === true
                              ? verifiedIcon
                              : notVerifiedIcon
                          }
                        />
                        {contactNo.verified === true ? (
                          <div
                            className={"fontsize12"}
                            style={{ color: "#43b02a" }}
                          >
                            {formatMessage(messages.verified)}
                          </div>
                        ) : (
                          <div
                            className={"fontsize12"}
                            style={{ color: "#fe8a12" }}
                          >
                            {formatMessage(messages.notVerified)}
                          </div>
                        )}
                      </label>

                      <MobileLabel
                        countryCode={countryCode}
                        phoneNumber={phoneNumber}
                      />
                    </div>
                    <div className={"mt16"}>
                      <div className={"fontsize12 label-color"}>
                        {formatMessage(messages.fullName)}
                      </div>
                      <div className={"fontsize16 "}>{name}</div>
                    </div>

                    {category === PATIENT && (
                      <div>
                        <div className="mt16">
                          <div className={"fontsize12 label-color"}>
                            {formatMessage(messages.dob)}
                          </div>
                          <div className={"fontsize16 "}>{dob}</div>
                        </div>

                        <div className="mt16">
                          <div className={"fontsize12 label-color"}>
                            {formatMessage(messages.gender)}
                          </div>
                          <div className={"fontsize16 "}>
                            {gender === "M" ? "Male" : "Female"}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={"mt16"}>
                      <div className={"fontsize12 label-color"}>
                        {formatMessage(messages.addressLine1)}
                      </div>
                      <div className={"fontsize16 "}>{addressLine1}</div>
                    </div>

                    <div className={"mt16"}>
                      <div className={"fontsize12 label-color"}>
                        {formatMessage(messages.addressLine2)}
                      </div>
                      <div className={"fontsize16 "}>{addressLine2}</div>
                    </div>
                    <div className={"mt16"}>
                      <div className={"fontsize12 label-color"}>
                        {formatMessage(messages.zipcode)}
                      </div>
                      <div className={"fontsize16 "}>{zipCode}</div>
                    </div>
                    <div className={"mt16"}>
                      {city && country && (
                        <div className={"fontsize14 medium"}>
                          {homeCityName + ", " + homeCountryName}
                        </div>
                      )}
                    </div>
                  </Element>
                </div>

                {category === PATIENT && (
                  <div id="insurance">
                    <Element name="insurance">
                      <div className="bold mt40 pb16 fontsize18">
                        {formatMessage(messages.insurance)}
                      </div>
                      <div className="pb16">
                        <div className="fontsize12 label-color">
                          {formatMessage(messages.insuranceProvider)}
                        </div>
                        <div className="fontsize16 ">{providerName}</div>
                      </div>

                      <div className="pb16">
                        <div className="fontsize12 label-color">
                          {formatMessage(messages.insurancePolicy)}
                        </div>
                        <div className="fontsize16 ">{policy}</div>
                      </div>

                      <div className="pb16">
                        <div className="fontsize12 label-color">
                          {formatMessage(messages.insuranceExpiresOn)}
                        </div>
                        <div className="fontsize16 ">{expiresOn}</div>
                      </div>
                    </Element>
                  </div>
                )}

                {category !== PATIENT && (
                  <div id="work">
                    <Element name="work">
                      <div className="bold mt40 pb16 fontsize18">
                        {formatMessage(messages.work)}
                      </div>
                      <div>
                        <div className="fontsize12 label-color">
                          {category === PROGRAMADMIN || category === CARECOACH
                            ? "Organisation"
                            : "Hospital"}
                        </div>
                        <div className="fontsize16 ">{organizationName}</div>
                      </div>
                      {category !== PROGRAMADMIN && (
                        <div>
                          <div className={"mt16"}>
                            <div className="fontsize12 label-color">
                              {formatMessage(messages.speciality)}
                            </div>
                            <div className="fontsize16 ">{speciality}</div>
                          </div>
                          <div className={"mt16"}>
                            <div className="fontsize12 label-color">
                              {formatMessage(messages.licenseNumber)}
                            </div>
                            <div className="fontsize16 ">{licenseNumber}</div>
                          </div>
                          <div className={"mt16"}>
                            <div className="fontsize12 label-color">
                              {formatMessage(messages.bio)}
                            </div>
                            <p className="">{about}</p>
                          </div>
                        </div>
                      )}

                      {category === CARECOACH && (
                        <div className="mt16">
                          <div className="fontsize12 label-color">Services</div>
                          <div className="fontsize14 mt8">{servicesTags}</div>
                        </div>
                      )}
                      <div className={"mt16"}>
                        <div className={"fontsize12 label-color"}>
                          {formatMessage(messages.addressLine1)}
                        </div>
                        <div className={"fontsize16 "}>{workAddressLine1}</div>
                      </div>

                      <div className={"mt16"}>
                        <div className={"fontsize12 label-color"}>
                          {formatMessage(messages.addressLine2)}
                        </div>
                        <div className={"fontsize16 "}>{workAddressLine2}</div>
                      </div>
                      <div className={"mt16"}>
                        <div className={"fontsize12 label-color"}>
                          {formatMessage(messages.zipcode)}
                        </div>
                        <div className={"fontsize16 "}>{workZipCode}</div>
                      </div>
                      <div className={"mt16"}>
                        {workCity && workCountry && (
                          <div className={"fontsize14 medium"}>
                            {workCityName + ", " + workCountryName}
                          </div>
                        )}
                      </div>
                    </Element>
                  </div>
                )}

                {/* {category === CARECOACH && (
                  <div id="services">
                    <Element name="services">
                      <div className="bold mt40 pb16 fontsize18">
                        {formatMessage(messages.services)}
                      </div>

                      <div className="content-space-between mt16">
                        <h4>{formatMessage(messages.medicalServices)}</h4>
                        <img
                          alt=""
                          src={medicalServices ? checkBoxTrue : checkBoxFalse}
                        />
                      </div>

                      <div className="mt16">
                        <h5>{formatMessage(messages.homeHealthCare)}</h5>
                        <List
                          span={24}
                          bordered
                          dataSource={homeHealthCareServiceContent}
                          renderItem={item => <List.Item>{item}</List.Item>}
                        />
                      </div>
                      <div className="mt16">
                        <h5>{formatMessage(messages.specialCare)}</h5>
                        <List
                          span={24}
                          bordered
                          dataSource={specialCareContent}
                          renderItem={item => <List.Item>{item}</List.Item>}
                        />
                      </div>
                      <div className="mt16">
                        <h5>{formatMessage(messages.nonMedicalServices)}</h5>
                        <List
                          span={24}
                          bordered
                          dataSource={nonMedicalServiceContent}
                          renderItem={item => <List.Item>{item}</List.Item>}
                        />
                      </div>
                    </Element>
                  </div>
                )} */}

                {category === PATIENT && (
                  <div>
                    <div id="contact">
                      <Element name="contact">
                        <div className="bold mt40 pb16 fontsize18">
                          {formatMessage(messages.contacts)}
                        </div>

                        <div className="mt10">
                          <div className={"mb0 label-color fontsize12"}>
                            {formatMessage(messages.caseDoctor)}
                          </div>
                          {isEmpty(caseDoctor) ? (
                            <div className="fontsize16 blacks">
                              {formatMessage(messages.notAssigned)}
                            </div>
                          ) : (
                            <div className="flex row justify-content-space-between align-items-center">
                              <div className="fontsize16 black">
                                {caseDoctor.name}
                              </div>

                              <div>
                                <div>
                                  {/* <img
                                    alt=""
                                    className="call-message pr4"
                                    src={messageIcon}
                                  />
                                  <img
                                    alt=""
                                    className="call-message"
                                    src={callIcon}
                                  /> */}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt10">
                          <div>
                            <div className={"mb0 label-color fontsize12"}>
                              {formatMessage(messages.careCoach)}
                            </div>
                            {isEmpty(careCoach) ? (
                              <div className="fontsize16 blacks">
                                {formatMessage(messages.notAssigned)}
                              </div>
                            ) : (
                              <div className="flex row justify-content-space-between align-items-center">
                                <div className="fontsize16 black">
                                  {careCoach.name}
                                </div>

                                <div>
                                  <div>
                                    {/* <img
                                      alt=""
                                      className="call-message pr4"
                                      src={messageIcon}
                                    />
                                    <img
                                      alt=""
                                      className="call-message"
                                      src={callIcon}
                                    /> */}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt10">
                          <div>
                            <div className={"mb0 label-color fontsize12"}>
                              {formatMessage(messages.hospital)}
                            </div>
                            {isEmpty(hospital) ? (
                              <div className="fontsize16 blacks">
                                {formatMessage(messages.notAssigned)}
                              </div>
                            ) : (
                              <div className="flex row justify-content-space-between align-items-center">
                                <div className="fontsize16 black">
                                  {hospital.name}
                                </div>

                                <div>
                                  <div>
                                    <img
                                      alt=""
                                      className="call-message pr4"
                                      src={messageIcon}
                                    />
                                    <img
                                      alt=""
                                      className="call-message"
                                      src={callIcon}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt20">
                          <div className="content-space-between">
                            <div className={"fontsize12 label-color"}>
                              {formatMessage(messages.relativeName)}
                            </div>
                            <div className="fontsize14 dark medium ">
                              {relativeName && relativeRelation}
                            </div>
                          </div>
                          <div className="fontsize16 ">{relativeName}</div>
                          <div className="mt16">
                            <div className={"fontsize12 label-color"}>
                              {formatMessage(messages.relativeNo)}
                            </div>
                            <div className="">
                              <MobileLabel
                                countryCode={relativeCountryCode}
                                phoneNumber={relativePhoneNumber}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt20">
                          <div>
                            <div className="content-space-between">
                              <div className="fontsize14 label-color medium">
                                {formatMessage(messages.isEmergencyContactSet)}
                              </div>
                              <img
                                alt=""
                                src={
                                  useRelativeAsEmergencyContact
                                    ? checkBoxTrue
                                    : checkBoxFalse
                                }
                              />
                            </div>
                            <div className="mt16">
                              <div className={"fontsize12 label-color"}>
                                {formatMessage(messages.emergencyContactName)}
                              </div>
                              <div className="fontsize16 ">
                                {emergencyContactName}
                              </div>
                            </div>
                            <div className="mt16">
                              <div className={"fontsize12 label-color"}>
                                {formatMessage(messages.emergencyContactNo)}
                              </div>
                              <div className="">
                                <MobileLabel
                                  countryCode={emergencyCountryCode}
                                  phoneNumber={emergencyPhoneNumber}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Element>
                    </div>

                    <div id="medical">
                      <Element name="medical">
                        <div className="bold mt40 pb16 fontsize18">
                          {formatMessage(messages.medical)}
                        </div>
                        <div className="fontsize16 medium">
                          {formatMessage(messages.basic)}
                        </div>
                        <div className="mt16">
                          <div className="mt10">
                            <div className={"fontsize12 label-color"}>
                              {formatMessage(messages.chiefComplaint)}
                            </div>
                            <div className="fontsize16 ">{chiefComplaint}</div>
                          </div>
                          <div className="mt10">
                            {allergiesTags.length === 0 ? (
                              <div className={"fontsize14 pt8 label-color"}>
                                {formatMessage(messages.noAllergies)}
                              </div>
                            ) : (
                              <div>
                                <div className={"fontsize12 label-color"}>
                                  {formatMessage(messages.allergies)}
                                </div>

                                <div className="mt16 pb24 ">
                                  <div className="fontsize14">
                                    {allergiesTags}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="mt10">
                            {surgeriesOrFractureTags.length === 0 ? (
                              <div className={"fontsize14 pt8 label-color"}>
                                {formatMessage(messages.noAllergies)}
                              </div>
                            ) : (
                              <div>
                                <div className={"fontsize12 label-color"}>
                                  {formatMessage(messages.noSurgeries)}
                                </div>

                                <div className="mt16 pb24 ">
                                  <div className="fontsize14">
                                    {surgeriesOrFractureTags}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="mt10">
                            {othersTags.length === 0 ? (
                              <div className={"fontsize14 pt8 label-color"}>
                                {formatMessage(messages.noOtherCondition)}
                              </div>
                            ) : (
                              <div>
                                <div className={"fontsize12 label-color"}>
                                  {formatMessage(messages.otherCondition)}
                                </div>
                                <div className="mt16 pb24 ">
                                  <div className="fontsize14">{othersTags}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt30">
                          <div className="fontsize16 medium">Vital</div>
                          <div className="mt16">
                            <div className="mt10">
                              <div className={"fontsize12 label-color"}>
                                {formatMessage(messages.bodyTemperature)}
                              </div>
                              <div className="flex baseline ">
                                <span
                                  className="fontsize16 mr8"
                                  style={{ color: "#ff530d" }}
                                >
                                  {temperatureVal}
                                </span>
                              </div>
                            </div>

                            <div className="mt10">
                              <div className={"fontsize12 label-color"}>
                                {formatMessage(messages.respirationRate)}
                              </div>
                              {respirationRate && (
                                <div className="flex baseline ">
                                  <span
                                    className="fontsize16 mr8"
                                    style={{ color: "#ff530d" }}
                                  >
                                    {respirationRate}
                                  </span>
                                  <span className="fontsize12 subdued">
                                    {formatMessage(messages.breathePerMinute)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mt10">
                              <div className={"fontsize12 label-color"}>
                                {formatMessage(messages.pulseRate)}
                              </div>
                              {pulse && (
                                <div className="flex baseline ">
                                  <span
                                    className="fontsize16 mr8"
                                    style={{ color: "#ff530d" }}
                                  >
                                    {pulse}
                                  </span>
                                  <span className="fontsize12 subdued">
                                    {formatMessage(messages.bpm)}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mt10">
                              <div className={"fontsize12 label-color"}>
                                {formatMessage(messages.bloodPressure)}
                              </div>
                              {bloodPressure && (
                                <div className="flex baseline ">
                                  <span
                                    className="fontsize16 mr8"
                                    style={{ color: "#ff530d" }}
                                  >
                                    {bloodPressure}
                                  </span>
                                  <span className="fontsize12 subdued">
                                    {formatMessage(messages.bpUnit)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {medicalReadings.length > 0 && (
                          <div className="mt30">
                            <div className="content-space-between bold mt30">
                              <div className="medium fontsize16">
                                {formatMessage(messages.clinicalReadings)}
                              </div>
                            </div>

                            <div className="mt16">
                              <div>{medicalReadings}</div>
                            </div>
                          </div>
                        )}
                      </Element>
                    </div>
                  </div>
                )}

                <div id="setting" className="mb210">
                  <Element name="setting">
                    <div className="bold mt40 pb16 fontsize18">
                      {formatMessage(messages.settings)}
                    </div>
                    <div>
                      <h4 className="medium mt10">
                        {formatMessage(messages.accounts)}
                      </h4>
                      <List
                        span={24}
                        bordered
                        dataSource={accountsContent}
                        renderItem={item => <List.Item>{item}</List.Item>}
                      />
                    </div>
                    <div className="mt24">
                      <h4 className="medium">
                        {formatMessage(messages.notifications)}
                      </h4>
                      <List
                        span={24}
                        bordered
                        dataSource={notificationsContent}
                        renderItem={item => <List.Item>{item}</List.Item>}
                      />
                    </div>
                  </Element>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <Row
          className="stick-bottom"
          style={{ backgroundColor: "white", borderTop: "solid 1px #d4d7d9" }}
        >
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={0}
            xl={0}
            xxl={0}
            className="nav-menu-flex"
          >
            <Menubar />
          </Col>
          <Col xs={12} sm={12} md={12} lg={0} xl={0} xxl={0}>
            <div className={"pt10 pb10 pr10 pl10 clearfix"}>
              <SkipAndGotoDashBoard
                gotoDashBoard={this.gotoDashBoard}
                gotoEditProfile={this.gotoEditProfile}
                intl={{ formatMessage, locale }}
              />
            </div>
          </Col>
        </Row>
        {/* <CommonMessage /> */}
      </div>
    );
  }
}

export default injectIntl(MyProfile);
