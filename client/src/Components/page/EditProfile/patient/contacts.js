import React from "react";
import Form from "antd/lib/form";
import { Input, Radio, Checkbox } from "antd";
// import messageIcon from "../../../../Assets/images/ico-message.svg";
// import callIcon from "../../../../Assets/images/ico-phone.svg";
import { MobileInput } from "../../../MobileInput";
import { Element } from "react-scroll";
import { injectIntl } from "react-intl";
import messages from "../message";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const PHONE_NUMBER = "contactNo.phoneNumber";
const COUNTRY_CODE = "contactNo.countryCode";

const RELATIVES_NAME = "contacts.relatives.name";
const RELATIVES_COUNTRY_CODE = "contacts.relatives.contactNo.countryCode";
const RELATIVES_PHONE_NUMBER = "contacts.relatives.contactNo.phoneNumber";
const RELATIVES_RELATION = "contacts.relatives.relation";

const CONTACT_RELATIVE_IN_EMERGENCY = "contacts.useRelativeAsEmergencyContact";
const EMERGENCY_CONTACT_NAME = "contacts.emergencyContact.name";
const EMERGENCY_CONTACT_COUNTRY_CODE =
  "contacts.emergencyContact.contactNo.countryCode";
const EMERGENCY_CONTACT_PHONE_NUMBER =
  "contacts.emergencyContact.contactNo.phoneNumber";

const FIELDS = [
  EMERGENCY_CONTACT_NAME,
  EMERGENCY_CONTACT_COUNTRY_CODE,
  EMERGENCY_CONTACT_PHONE_NUMBER,
  RELATIVES_COUNTRY_CODE,
  RELATIVES_PHONE_NUMBER,
  RELATIVES_NAME
];

class ContactSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  isAnyContactAvailable = () => {
    const form = this.props.form;

    return form.getFieldValue(RELATIVES_NAME).length &&
      form.getFieldValue(RELATIVES_PHONE_NUMBER).length > 0
      ? true
      : false;
  };

  handleChangeEmergencyContact = value => {
    //to force validate Emergency Contact field
    this.props.form.validateFields();
    this.setState(
      {
        isEnableEmergencyContact: value.target.checked
      },
      () => {
        let countryCode = "";
        const {
          validateFields,
          setFieldsValue,
          getFieldValue
        } = this.props.form;
        if (this.state.isEnableEmergencyContact) {
          countryCode = getFieldValue(RELATIVES_COUNTRY_CODE);
          setFieldsValue({
            [EMERGENCY_CONTACT_COUNTRY_CODE]: countryCode,
            [EMERGENCY_CONTACT_PHONE_NUMBER]: getFieldValue(
              RELATIVES_PHONE_NUMBER
            ),
            [EMERGENCY_CONTACT_NAME]: getFieldValue(RELATIVES_NAME)
          });
          validateFields([RELATIVES_PHONE_NUMBER]);
        } else {
          setFieldsValue({
            [EMERGENCY_CONTACT_COUNTRY_CODE]: undefined,
            [EMERGENCY_CONTACT_PHONE_NUMBER]: undefined,
            [EMERGENCY_CONTACT_NAME]: undefined
          });
          validateFields([
            EMERGENCY_CONTACT_COUNTRY_CODE,
            EMERGENCY_CONTACT_NAME,
            EMERGENCY_CONTACT_PHONE_NUMBER
          ]);
        }
        this.setState({
          emergencyContactCountryCode: countryCode
        });
      }
    );
  };

  isRelativeNotEqlToPersonalPhone = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;

    const {
      intl: { formatMessage }
    } = this.props;
    const personalNumber = getFieldValue(PHONE_NUMBER);
    const personalCountryCode = getFieldValue(COUNTRY_CODE);

    const relativeCountryCode = getFieldValue(RELATIVES_COUNTRY_CODE);
    if (value && value.length > 0) {
      if (
        personalCountryCode === relativeCountryCode &&
        value === personalNumber
      ) {
        callback(formatMessage(messages.relativeNumberError));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  isRelativeCodeNotEqlToPersonalPhone = (rule, value, callback) => {
    const { validateFields } = this.props.form;
    if (value && value.length > 0) {
      validateFields([RELATIVES_PHONE_NUMBER]);
      callback();
    } else {
      callback();
    }
  };

  isEmergencyNotEqlToPersonalPhone = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const {
      intl: { formatMessage }
    } = this.props;

    const personalNumber = getFieldValue(PHONE_NUMBER);
    const personalCountryCode = getFieldValue(COUNTRY_CODE);

    const emergencycountryCode = getFieldValue(EMERGENCY_CONTACT_COUNTRY_CODE);
    if (value && value.length > 0) {
      if (
        personalCountryCode === emergencycountryCode &&
        value === personalNumber
      ) {
        callback(formatMessage(messages.emergencyNumberError));
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  isEmergencyCodeNotEqlToPersonalPhone = (rule, value, callback) => {
    const { validateFields } = this.props.form;

    if (value && value.length > 0) {
      validateFields([EMERGENCY_CONTACT_PHONE_NUMBER]);
      callback();
    } else {
      callback(this.props.intl.formatMessage(messages.notBeBlank));
    }
  };

  canUseEmergencyCheckboxEnable = () => {
    const { getFieldValue } = this.props.form;
    const rname = getFieldValue(RELATIVES_NAME);
    const rcountrycode = getFieldValue(RELATIVES_COUNTRY_CODE);
    const rcontactno = getFieldValue(RELATIVES_PHONE_NUMBER);

    if (
      rname &&
      rcountrycode &&
      rcontactno &&
      rname.length > 0 &&
      rcountrycode.length > 0 &&
      rcontactno.length > 0
    ) {
      return false;
    }
    return true;
  };

  notBlank = (rule, value, callback) => {
    if (!value || value.length === 0) {
      callback(this.props.intl.formatMessage(messages.notBeBlank));
    } else {
      callback();
    }
  };

  render() {
    const {
      personalInfo: { contacts = {} }
    } = this.props.userData;
    const {
      careCoaches = {},
      caseDoctors = {},
      hospitals = {},
      userData: { programIds = [] },
      intl: { formatMessage }
    } = this.props;

    let careCoach = {};
    let caseDoctor = {};
    let hospital = {};

    if (programIds.length > 0) {
      const {
        careCoach: careCoachId,
        doctor: doctorId,
        hospitalId
      } = programIds[0];
      careCoach = careCoaches[careCoachId] || {};
      caseDoctor = caseDoctors[doctorId] || {};
      hospital = hospitals[hospitalId];
    }
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const {
      relatives = {},
      emergencyContact = {},
      useRelativeAsEmergencyContact: isEmergencyContactSet = false
    } = contacts;

    const {
      name: relativeName,
      contactNo: relativeContactNo = {},
      relation: relativeRelation = "Parent"
    } = relatives;
    const {
      name: emergencyContactName,
      contactNo: emergencyContactNo = {}
    } = emergencyContact;

    const forEmergencyContactName = this.state.isEnableEmergencyContact
      ? getFieldValue(EMERGENCY_CONTACT_NAME)
      : emergencyContactName;

    const emergencyCountryCode =
      this.state.emergencyContactCountryCode === undefined
        ? emergencyContactNo.countryCode
        : this.state.emergencyContactCountryCode;

    const fieldError = {};
    const { isFieldTouched, getFieldError } = this.props.form;
    const { customFieldsError } = this.props;
    FIELDS.forEach(field => {
      if (customFieldsError) {
        if (!isFieldTouched(field) && customFieldsError[field]) {
          fieldError[field] = getFieldError(field);
        } else {
          fieldError[field] = isFieldTouched(field) && getFieldError(field);
        }
      } else {
        fieldError[field] = isFieldTouched(field) && getFieldError(field);
      }
    });

    return (
      <div id="contact">
        <Element name="contact">
          <div>
            <div className="bold mt40 pb16 fontsize18">
              {formatMessage(messages.contacts)}
            </div>
            <div className="mt10">
              <div className={"mb0 label-color fontsize12"}>
                {formatMessage(messages.caseDoctor)}
              </div>
              {caseDoctor.name === undefined ? (
                <div className="fontsize16 blacks ">
                  {formatMessage(messages.notAssigned)}
                </div>
              ) : (
                <div className="flex row justify-content-space-between align-items-center">
                  <div className="fontsize16 black">{caseDoctor.name}</div>

                  <div>
                    <div>
                      {/* <img
                        alt=""
                        className="call-message pr4"
                        src={messageIcon}
                      />
                      <img alt="" className="call-message" src={callIcon} /> */}
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
                {careCoach.name === undefined ? (
                  <div className="fontsize16 blacks ">
                    {formatMessage(messages.notAssigned)}
                  </div>
                ) : (
                  <div className="flex row justify-content-space-between align-items-center">
                    <div className="fontsize16 black">{careCoach.name}</div>

                    {/* <div>
                      <div>
                        <img
                          alt=""
                          className="call-message pr4"
                          src={messageIcon}
                        />
                        <img alt="" className="call-message" src={callIcon} />
                      </div>
                    </div> */}
                  </div>
                )}
              </div>
            </div>
            <div className="mt10">
              <div>
                <div className={"mb0 label-color fontsize12"}>
                  {formatMessage(messages.hospital)}
                </div>
                {hospital === undefined ? (
                  <div className="fontsize16 blacks ">
                    {formatMessage(messages.notAssigned)}
                  </div>
                ) : (
                  <div className="flex row justify-content-space-between align-items-center">
                    <div className="fontsize16 black">{hospital.name}</div>
                    {/* <div>
                      <div>
                        <img
                          alt=""
                          className="call-message pr4"
                          src={messageIcon}
                        />
                        <img alt="" className="call-message" src={callIcon} />
                      </div>
                    </div> */}
                  </div>
                )}
              </div>
            </div>
            <div className="mt24">
              <div className="flex row align-items-center justify-content-space-between">
                <div className={"label-color fontsize12 pb5"}>
                  {formatMessage(messages.relativeName)}
                </div>
                <FormItem className={"tab-radio-button"}>
                  {getFieldDecorator(RELATIVES_RELATION, {
                    initialValue: relativeRelation,
                    type: "string"
                  })(
                    <RadioGroup size="small">
                      <RadioButton value="Parent">
                        {formatMessage(messages.parent)}
                      </RadioButton>
                      <RadioButton value="Spouse">
                        {formatMessage(messages.spouse)}
                      </RadioButton>
                      <RadioButton value="Guardian">
                        {formatMessage(messages.guardian)}
                      </RadioButton>
                    </RadioGroup>
                  )}
                </FormItem>
              </div>
              <FormItem
                validateStatus={fieldError[RELATIVES_NAME] ? "error" : ""}
                help={fieldError[RELATIVES_NAME] || ""}
              >
                {getFieldDecorator(RELATIVES_NAME, {
                  initialValue: relativeName
                })(<Input placeholder="" className="mt2" />)}
              </FormItem>

              <div className="fontsize12 pb5 label-color">
                {formatMessage(messages.relativeMobile)}
              </div>
              <MobileInput
                fieldError={fieldError}
                countryCode={
                  relativeContactNo.countryCode === null
                    ? undefined
                    : relativeContactNo.countryCode
                }
                phoneNumber={relativeContactNo.phoneNumber}
                phoneField={RELATIVES_PHONE_NUMBER}
                countryCodeField={RELATIVES_COUNTRY_CODE}
                rulesCountryCode={[
                  { validator: this.isRelativeCodeNotEqlToPersonalPhone }
                ]}
                rulesPhoneNumber={[
                  {
                    message: formatMessage(messages.phoneNumberRule)
                  },
                  {
                    validator: this.isRelativeNotEqlToPersonalPhone
                  }
                ]}
                {...this.props}
              />
            </div>
            <div className="mt24">
              <div>
                <div className="content-space-between full-width flex align-items-center settings">
                  <FormItem className={"mb0"}>
                    {getFieldDecorator(CONTACT_RELATIVE_IN_EMERGENCY, {
                      valuePropName: "checked",
                      initialValue: isEmergencyContactSet || false,
                      onChange: this.handleChangeEmergencyContact
                    })(
                      <Checkbox
                        className={"calendar_sync_line settings-checkbox"}
                        disabled={this.canUseEmergencyCheckboxEnable()}
                      >
                        <div className={"label-color medium fontsize14"}>
                          {formatMessage(messages.contactRelative)}
                        </div>
                      </Checkbox>
                    )}
                  </FormItem>
                </div>
                <div className="mt10">
                  <FormItem
                    label={formatMessage(messages.emergencyContactName)}
                    validateStatus={
                      fieldError[EMERGENCY_CONTACT_NAME] ? "error" : ""
                    }
                    help={fieldError[EMERGENCY_CONTACT_NAME] || ""}
                  >
                    {getFieldDecorator(EMERGENCY_CONTACT_NAME, {
                      rules: [
                        {
                          required: true,
                          message: formatMessage(messages.emergencyContactRule)
                        }
                      ],
                      initialValue: forEmergencyContactName
                    })(
                      <Input
                        placeholder=""
                        disabled={
                          this.state.isEnableEmergencyContact === undefined
                            ? isEmergencyContactSet
                            : this.state.isEnableEmergencyContact
                        }
                      />
                    )}
                  </FormItem>
                </div>
                <div className="mt10">
                  <label className="mb5 fontsize12 label-color ant-form-item-required">
                    {formatMessage(messages.emergencyContactMobile)}
                  </label>
                  <MobileInput
                    fieldError={fieldError}
                    countryCode={emergencyCountryCode}
                    phoneNumber={emergencyContactNo.phoneNumber}
                    phoneField={EMERGENCY_CONTACT_PHONE_NUMBER}
                    countryCodeField={EMERGENCY_CONTACT_COUNTRY_CODE}
                    disabled={
                      this.state.isEnableEmergencyContact === undefined
                        ? isEmergencyContactSet
                        : this.state.isEnableEmergencyContact
                    }
                    rulesCountryCode={[
                      {
                        required: true,
                        message: formatMessage(messages.phoneNumberRule)
                      }
                      // { validator: this.isEmergencyCodeNotEqlToPersonalPhone }
                    ]}
                    rulesPhoneNumber={[
                      {
                        required: true,
                        message: formatMessage(messages.phoneNumberRule)
                      },
                      { validator: this.isEmergencyNotEqlToPersonalPhone }
                    ]}
                    {...this.props}
                  />
                </div>
              </div>
            </div>
          </div>
        </Element>
      </div>
    );
  }
}

export default injectIntl(ContactSection);
