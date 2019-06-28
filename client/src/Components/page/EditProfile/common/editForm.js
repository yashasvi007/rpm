import React, { Component, Fragment } from "react";
import { Form, Button, Row, Col } from "antd";
import forIn from "lodash-es/forIn";
import DoctorSection from "../doctor";
import CareCoachSection from "../careCoach";
import PatientSection from "../patient";
import ProgramAdminSection from "../programAdmin";
import { injectIntl } from "react-intl";
import messages from "./message";
import goBackIcon from "../../../../Assets/images/ico-back.svg";
//import AppointmentsHistory from "../../../AppointmentsHistory";

//fields
const EMERGENCY_CONTACT_NAME = "contacts.emergencyContact.name";
const EMERGENCY_CONTACT_COUNTRY_CODE =
  "contacts.emergencyContact.contactNo.countryCode";
const EMERGENCY_CONTACT_PHONE_NUMBER =
  "contacts.emergencyContact.contactNo.phoneNumber";
const SPECIALITY = "work.speciality";
const CITY = "homeAddress.city";
const COUNTRY = "homeAddress.country";
const ADDRESSLINE2 = "homeAddress.addressLine2";
const ZIP_CODE = "homeAddress.zipCode";
const DOB = "dob";
const GENDER = "gender";
const NAME = "name";
const PHONE_NUMBER = "contactNo.phoneNumber";
const COUNTRY_CODE = "contactNo.countryCode";

const DOCTOR = "doctor";
const CARECOACH = "careCoach";
const PATIENT = "patient";
const PROGRAMADMIN = "programAdmin";

const WORK_CITY = "work.officeAddress.city";
const WORK_COUNTRY = "work.officeAddress.country";
const HOSPITALS = "hospitals";

const REQUIRED_FIELD = {
  [DOCTOR]: [
    NAME,
    COUNTRY,
    CITY,
    SPECIALITY,
    WORK_CITY,
    WORK_COUNTRY,
    HOSPITALS
  ],
  [CARECOACH]: [
    NAME,
    COUNTRY,
    CITY,
    PHONE_NUMBER,
    COUNTRY_CODE,
    ADDRESSLINE2,
    ZIP_CODE
  ],
  [PATIENT]: [
    NAME,
    COUNTRY,
    CITY,
    PHONE_NUMBER,
    COUNTRY_CODE,
    ADDRESSLINE2,
    ZIP_CODE,
    DOB,
    GENDER,
    EMERGENCY_CONTACT_COUNTRY_CODE,
    EMERGENCY_CONTACT_PHONE_NUMBER,
    EMERGENCY_CONTACT_NAME
  ],
  [PROGRAMADMIN]: [NAME, COUNTRY, CITY]
};

const SkipAndGotoDashBoard = ({
  gotoDashBoard,
  getFieldsError,
  isProfileCompleted,
  intl,
  editingOtherUser
}) => {
  const disabled = getFieldsError();
  const { formatMessage } = intl;
  return (
    <div className="pull-right">
      {!editingOtherUser && isProfileCompleted ? (
        <Button
          className="iqvia-outline-btn"
          onClick={e => {
            e.preventDefault();
            gotoDashBoard();
          }}
          ghost
        >
          {formatMessage(messages.goToDashBoard)}
        </Button>
      ) : null}
      <Button
        type="primary"
        htmlType="submit"
        className="ml10 iqvia-primary-btn"
        disabled={disabled}
      >
        {formatMessage(messages.save)}
      </Button>
    </div>
  );
};

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: []
    };
    this.hasErrors = this.hasErrors.bind(this);
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      onSave,
      form: { validateFields }
    } = this.props;
    console.log("this.props", this.props);
    try {
      validateFields((err, values) => {
        console.log("err", err, values);
        if (!err) {
          onSave(values);
        }
      });
    } catch (error) {
      console.log("error============>", error);
    }
  };

  hasErrors() {
    const { getFieldError } = this.props.form;
    const {
      basicInfo: { category }
    } = this.props.userData;
    const required = REQUIRED_FIELD[category];
    for (let field in required) {
      if (getFieldError(required[field])) {
        return true;
      }
    }
    return false;
  }

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

  getComponentToShow = category => {
    let component = null;
    switch (category) {
      case DOCTOR: {
        const { PersonalSection, WorkSection, SettingSection } = DoctorSection;
        component = (
          <div>
            <PersonalSection {...this.props} />
            <WorkSection {...this.props} />
            <SettingSection {...this.props} />
          </div>
        );
        break;
      }
      case CARECOACH: {
        const {
          PersonalSection,
          WorkSection,
          SettingSection
        } = CareCoachSection;
        component = (
          <div>
            <PersonalSection {...this.props} />
            <WorkSection {...this.props} />
            {/* <ServiceSection {...this.props} /> */}
            <SettingSection {...this.props} />
          </div>
        );
        break;
      }

      case PATIENT: {
        const {
          PersonalSection,
          MedicalSection,
          ContactSection,
          SettingSection,
          InsuranceSections
        } = PatientSection;
        component = (
          <div>
            <PersonalSection {...this.props} />
            <InsuranceSections {...this.props} />
            <ContactSection {...this.props} />
            <MedicalSection {...this.props} />
            <SettingSection {...this.props} />
          </div>
        );
        break;
      }

      case PROGRAMADMIN: {
        const {
          PersonalSection,
          WorkSection,
          SettingSection
        } = ProgramAdminSection;
        component = (
          <div>
            <PersonalSection {...this.props} />
            <WorkSection {...this.props} />
            <SettingSection {...this.props} />
          </div>
        );
        break;
      }

      default:
        break;
    }
    return component;
  };

  setFieldsError = errors => {
    if (errors) {
      const { setFields } = this.props.form;
      let fieldsError = {};
      forIn(errors, (value, key) => {
        fieldsError[key] = {
          value: value.value,
          errors: [value.msg]
        };
      });
      setFields(fieldsError);
    }
  };

  render() {
    const {
      intl: { formatMessage, locale },
      editingOtherUser,
      handleGoBack
    } = this.props;

    //
    // const { getFieldsError } = this.props.form;
    const { gotoDashBoard, userData } = this.props;
    const {
      basicInfo = {},
      // settings = {},
      isProfileCompleted = false
    } = userData;
    const { category, name } = basicInfo;
    // const {
    //   isCalendarSynced = false,
    //   preferences: {
    //     smsAlerts = false,
    //     emailAlerts = false,
    //     pushAlerts = false,
    //     reminderAlerts = false
    //   }
    // } = settings;
    const Menubar = this.getMenuBar(category);
    const Sections = this.getComponentToShow(category);
    const disabled = this.hasErrors();

    return (
      <Form id="edit-form" onSubmit={this.handleSubmit}>
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
                {editingOtherUser ? (
                  <div
                    className={
                      "flex align-items-center justify-content-start h100 pl20"
                    }
                  >
                    <img
                      className={"mr16 clickable"}
                      alt="go back"
                      src={goBackIcon}
                      onClick={handleGoBack}
                    />
                    <div className="fontsize12 dark">{`Edit ${name}'s Details`}</div>
                  </div>
                ) : (
                  <div
                    className={
                      "flex align-items-center justify-content-start h100 fontsize22 regular pl20"
                    }
                  >
                    {formatMessage(messages.myProfile)}
                  </div>
                )}
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
                  {!editingOtherUser && isProfileCompleted ? (
                    <Button
                      className="iqvia-outline-btn"
                      ghost
                      onClick={e => {
                        e.preventDefault();
                        gotoDashBoard();
                      }}
                    >
                      {formatMessage(messages.goToDashBoard)}
                    </Button>
                  ) : null}

                  <Button
                    type="primary"
                    htmlType="submit"
                    className="ml10 iqvia-primary-btn"
                    disabled={disabled}
                  >
                    {formatMessage(messages.save)}
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="flex align-items-center justify-content-center">
          <div className="main-iqvia-container">
            <Row type="flex" justify="center" className="pt66">
              <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
                <Row>
                  {!editingOtherUser && (
                    <Fragment>
                      <Col span={24}>
                        <div className="fonsize14 mb8">
                          {formatMessage(messages.profileSetupText)}
                        </div>
                      </Col>
                      <Col span={24} className={"mb30"}>
                        <div className={" fontsize 12 subdued"}>
                          {formatMessage(messages.subduedProfileSetupText)}
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={0} xl={0} xxl={0}>
                        <div className={"fontsize22 pb10 "}>
                          {formatMessage(messages.myProfile)}
                        </div>
                      </Col>
                    </Fragment>
                  )}
                  <Col className="iqvia-form " span={12}>
                    {Sections}
                  </Col>
                </Row>
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
                gotoDashBoard={gotoDashBoard}
                editingOtherUser={editingOtherUser}
                getFieldsError={this.hasErrors}
                category={this.props.userData.category}
                isProfileCompleted={isProfileCompleted}
                intl={{ formatMessage, locale }}
              />
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default injectIntl(EditForm);
