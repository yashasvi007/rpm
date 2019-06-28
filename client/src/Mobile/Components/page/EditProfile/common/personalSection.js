import React, { Component } from "react";
import moment from "moment";
import debounce from "lodash-es/debounce";
import ReactCountryFlag from "react-country-flag";
import callingCountries from "country-data";
import { injectIntl } from "react-intl";
import {
  Input,
  Select,
  Button,
  Form,
  Modal,
  Icon,
  Radio,
  DatePicker
} from "antd";
import { Element } from "react-scroll";

import verifiedIcon from "../../../../../Assets/images/ico-verified.svg";
import notVerifiedIcon from "../../../../../Assets/images/ico-caution.svg";
import placeHolder from "../../../../../Assets/images/ico_placeholder_userdp.png";
import calendar from "../../../../../Assets/images/button-select-date.svg";
import upload from "../../../../../Assets/images/upload_icon_bg.png";
import MobileVerification from "../../../../Containers/VerifyOtp";
import CountryCity from "../../../../Containers/CountryCity";
import { USER_CATEGORY } from "../../../../../constant";
import messages from "../message";

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { PATIENT, CARE_COACH, DOCTOR } = USER_CATEGORY;

//fields
const NAME = "name";
const DOB = "dob";
const GENDER = "gender";
const COUNTRY_CODE = "contactNo.countryCode";
const PHONE_NUMBER = "contactNo.phoneNumber";
const ADDRESSLINE1 = "homeAddress.addressLine1";
const ADDRESSLINE2 = "homeAddress.addressLine2";
const ZIP_CODE = "homeAddress.zipCode";
const CITY = "homeAddress.city";
const COUNTRY = "homeAddress.country";
const RELATIVES_PHONE_NUMBER = "contacts.relatives.contactNo.phoneNumber";
const EMERGENCY_CONTACT_PHONE_NUMBER =
  "contacts.emergencyContact.contactNo.phoneNumber";

const FIELDS = [
  NAME,
  DOB,
  GENDER,
  COUNTRY_CODE,
  PHONE_NUMBER,
  ADDRESSLINE1,
  ADDRESSLINE2,
  ZIP_CODE,
  CITY,
  COUNTRY
];
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1);
    n -= 1; // to make eslint happy
  }
  return new File([u8arr], filename, { type: mime });
};

function getParsedCountryCode() {
  const a = [];
  for (let countryCode in callingCountries.callingCountries.all) {
    const cc = callingCountries.callingCountries.all[countryCode];

    if (cc.countryCallingCodes.length > 0) {
      cc.code = cc.countryCallingCodes[0];
      a.push(cc);
    }
  }

  return a;
}

const ParsedCountryCodes = getParsedCountryCode();
function disabledDate(current) {
  // Can not select days after today
  return current && current > moment().endOf("day");
}

class PersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCropPic: false,
      showOtpModal: false,
      loading: false,
      suggestedCountryCodes: [],
      showDropDown: false
    };
    this.showOtpModal = this.showOtpModal.bind(this);
    this.hideOtpModal = this.hideOtpModal.bind(this);
    this.handleOtpVerify = this.handleOtpVerify.bind(this);
    this.croppie = null;
    this.searchCountryCode = debounce(this.searchCountryCode, 300);
  }

  formatMessage = data => {
    this.props.intl.formatMessage(data);
  };

  componentDidMount() {
    this.setInitialCountryCode();
  }

  notBlank = (rule, value, callback) => {
    if (!value || value.length === 0) {
      callback(this.formatMessage(messages.notBlank));
    } else {
      callback();
    }
  };

  uploadNewPhoto = e => {
    if (this.originalImageRef) {
      this.originalImageRef.click();
    }
  };

  onOriginalFileSelect = e => {
    if (this.originalImageRef.files.length > 0) {
      this.setState({ openCropPic: true });
    }
  };

  loadCroppedImage = () => {
    if (window.Croppie && window.FileReader) {
      if (!this.croppie) {
        this.croppie = new window.Croppie(this.croppieContainer, {
          viewport: {
            width: 200,
            height: 200,
            type: "circle"
          },
          boundary: { width: 308, height: 322 },
          showZoomer: true,
          enableExif: false,
          enforceBoundary: true
        });
      }
      const croppie = this.croppie;

      try {
        const reader = new FileReader();
        reader.onload = e => {
          croppie.bind({ url: e.target.result });
        };

        reader.readAsDataURL(this.originalImageRef.files[0]);
      } catch (e) {}
    } else {
    }
  };

  setOriginalRef = ref => {
    this.originalImageRef = ref;
  };

  setCroppieContainer = ref => {
    this.croppieContainer = ref;

    if (ref) {
      this.loadCroppedImage();
    }
  };

  hideProfilePicModal = () => {
    this.originalImageRef.value = null;
    this.croppie = null;
    this.setState({ openCropPic: false });
  };

  handleProfilePicSubmit = async e => {
    const data = await this.croppie.result({
      type: "base64",
      format: "png"
    });

    this.uploadProfilePic(data);
    this.hideProfilePicModal();
  };

  uploadProfilePic = b64 => {
    const {
      changeProfilePic,
      userData: {
        basicInfo: { _id }
      }
    } = this.props;
    const file = dataURLtoFile(b64);
    const data = new FormData();
    data.append("profile-pic", file, file.name);
    // now upload
    changeProfilePic(data, _id);
  };

  showOtpModal(e) {
    const {
      sendOtp,
      userData: {
        basicInfo: { _id }
      },
      form,
      openOtpModal
    } = this.props;
    const { getFieldValue } = form;

    e.preventDefault();
    openOtpModal();
    sendOtp(
      {
        countryCode: getFieldValue(COUNTRY_CODE),
        phoneNumber: getFieldValue(PHONE_NUMBER)
      },
      _id
    );
  }

  hideOtpModal() {
    const { cleanOtpState, closeOtpModal } = this.props;
    cleanOtpState();
    closeOtpModal();
  }

  async handleOtpVerify(otp) {
    const { verifyOtp } = this.props;
    verifyOtp(otp);
  }

  selectedCountryCode = val => {
    if (val.length === 0) {
      this.setState({
        showDropDown: false,
        suggestedCountryCodes: []
      });
    } else {
      this.setState({
        showDropDown: false,
        suggestedCountryCodes: ParsedCountryCodes.filter(a => {
          return a.code.indexOf(val) > -1;
        })
      });
    }
  };

  setInitialCountryCode = () => {
    const { getFieldValue } = this.props.form;

    const val = getFieldValue(COUNTRY_CODE) || "";

    if (val.length === 0) {
      this.setState({
        suggestedCountryCodes: []
      });
    } else {
      this.setState({
        suggestedCountryCodes: ParsedCountryCodes.filter(a => {
          return a.code.indexOf(val) > -1;
        })
      });
    }
  };

  searchCountryCode = val => {
    if (val.length === 0) {
      this.setState({
        suggestedCountryCodes: []
      });
    } else {
      this.setState({
        showDropDown: true,
        suggestedCountryCodes: ParsedCountryCodes.filter(a => {
          return a.code.indexOf(val) > -1;
        })
      });
    }
  };

  enableVerifyButton = () => {
    const {
      form: { getFieldValue, getFieldError } = {},
      userData: { personalInfo: { contactNo = {} } = {} } = {}
    } = this.props;

    const {
      countryCode = "+91",
      phoneNumber = "",
      verified = false
    } = contactNo;
    const countryCodeField = getFieldValue(COUNTRY_CODE) || "";
    const phoneNumberField = getFieldValue(PHONE_NUMBER) || "";

    if (
      verified
        ? (countryCodeField !== countryCode ||
            phoneNumberField !== phoneNumber) &&
          !getFieldError(PHONE_NUMBER)
        : phoneNumberField.length > 0 &&
          countryCodeField.length > 0 &&
          !getFieldError(PHONE_NUMBER)
    ) {
      return false;
    } else {
      return true;
    }
  };

  setCalendarRef = ref => {
    this.calendarRef = ref;
  };

  openCalendar = e => {
    e.preventDefault();
    window.document
      .getElementsByClassName("ant-calendar-picker-input")[0]
      .click();
  };

  isNumber = (rule, value, callback) => {
    const { validateFields } = this.props.form;
    const { basicInfo = {} } = this.props.userData || {};

    const { category } = basicInfo;

    if (value && value.length > 0 && value.match("^[0-9]+$") === null) {
      callback("Enter valid phone number");
    } else {
      if (category === PATIENT) {
        validateFields([
          RELATIVES_PHONE_NUMBER,
          EMERGENCY_CONTACT_PHONE_NUMBER
        ]);
      }
      callback();
    }
  };
  notBlank = (rule, value, callback) => {
    const { validateFields } = this.props.form;
    const { basicInfo = {} } = this.props.userData || {};

    const { category } = basicInfo;
    if (!value || value.length === 0) {
      callback(this.props.intl.formatMessage(messages.notBeBlank));
    } else {
      if (category === PATIENT) {
        validateFields([
          RELATIVES_PHONE_NUMBER,
          EMERGENCY_CONTACT_PHONE_NUMBER
        ]);
      }
      callback();
    }
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const { show_otp_modal } = this.props;
    const { basicInfo = {}, personalInfo = {} } = this.props.userData;

    const { profilePicLink = placeHolder, _id, name, category } = basicInfo;
    const {
      contactNo = {},
      email,
      homeAddress = {},
      dob: dateOfBirth,
      gender
    } = personalInfo;
    const { addressLine1, addressLine2, city, country, zipCode } = homeAddress;

    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched,
      getFieldValue
    } = this.props.form;

    const { suggestedCountryCodes, showDropDown } = this.state;

    const fieldError = {};
    const { customFieldsError = {} } = this.props;

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

    const { countryCode, phoneNumber = "" } = contactNo;
    let dob;
    if (dateOfBirth !== undefined && dateOfBirth != null)
      dob = moment(dateOfBirth);
    if (!dob || !dob._isValid) {
      dob = null;
    }

    const phoneNoRule =
      category === CARE_COACH || category === PATIENT
        ? [
            {
              required: true,
              message:
                category === PATIENT
                  ? formatMessage(messages.phoneNumberRule)
                  : formatMessage(messages.careCoachphoneNumberRule)
            },
            {
              validator: this.isNumber
            }
          ]
        : [
            {
              validator: this.isNumber
            }
          ];

    const addressLine2Rule =
      category === CARE_COACH || category === PATIENT
        ? [
            {
              required: true,
              message: formatMessage(messages.localityRule)
            }
          ]
        : [];
    const zipCodeRule =
      category === CARE_COACH || category === PATIENT
        ? [
            {
              required: true,
              message: formatMessage(messages.zipcodeRule)
            }
          ]
        : [];
    const mobileNumberRequiredClass =
      category === DOCTOR ? "" : "ant-form-item-required";

    return (
      <div>
        <Modal
          title={formatMessage(messages.selectPhotoTitle)}
          visible={this.state.openCropPic}
          onOk={this.handleProfilePicSubmit}
          onCancel={this.hideProfilePicModal}
          okButtonProps={{ className: "bold set_profile_pic_button" }}
          okText={formatMessage(messages.photoOKText)}
          wrapClassName={"upload_profile_picture"}
          cancelButtonProps={{ className: "cancel-button hidden" }}
          destroyOnClose={true}
          width={800}
        >
          <h6 className={"subdued fontsize12"}>
            {formatMessage(messages.cropImage)}
          </h6>
          <div className={"main_content_holder"}>
            <div ref={this.setCroppieContainer} />
            <div
              className={
                "profile_pic_disclaimer mt40 flex align-items-center justify-content-center"
              }
            >
              <Icon
                type="eye"
                className={"subdued"}
                style={{ fontSize: "20px" }}
              />
              <h6 className={"subdued pl10 mb0"}>
                {formatMessage(messages.photoVisibleInfo)}
              </h6>
            </div>
          </div>
        </Modal>
        {show_otp_modal && (
          <MobileVerification
            handleCancel={this.hideOtpModal}
            visible={show_otp_modal}
            id={_id}
            contactNo={{
              countryCode: getFieldValue(COUNTRY_CODE),
              phoneNumber: getFieldValue(PHONE_NUMBER)
            }}
          />
        )}

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
              <img alt="" src={profilePicLink} className={"block w100"} />
              <div
                className={"absolute"}
                style={{ bottom: 0, right: 0, width: "30px", height: "30px" }}
                onClick={this.uploadNewPhoto}
              >
                <img alt="" src={upload} className={"block w100"} />
                <input
                  ref={this.setOriginalRef}
                  onChange={this.onOriginalFileSelect}
                  className={"hidden originalImageFileType"}
                  type="file"
                  accept="image/*"
                  name="original"
                />
              </div>
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
              <div className={"fontsize12"} style={{ color: "#43b02a" }}>
                {formatMessage(messages.verified)}
              </div>
            </label>
            <div className={"fontsize16 dark pt4"}>{email}</div>
          </div>

          <div className={"mt20"}>
            <label
              className={`flex row align-items-center justify-content-start ${mobileNumberRequiredClass} mb5`}
            >
              <div className="mr-10 fontsize12 label-color">
                {formatMessage(messages.mobile)}
              </div>
              <img
                alt=""
                style={{ width: "13px", marginRight: "5px" }}
                src={
                  contactNo.verified === true ? verifiedIcon : notVerifiedIcon
                }
              />
              {contactNo.verified === true ? (
                <div className={"fontsize12"} style={{ color: "#43b02a" }}>
                  {formatMessage(messages.verified)}
                </div>
              ) : (
                <div className={"fontsize12"} style={{ color: "#fe8a12" }}>
                  {formatMessage(messages.notVerified)}
                </div>
              )}
            </label>

            <div className="flex content-space-between align-items-start">
              <div className="flex flex-1 pr10">
                <FormItem
                  help={""}
                  validateStatus={fieldError[COUNTRY_CODE] ? "error" : ""}
                  style={{ width: "90px", margin: "0 10px 0 0" }}
                >
                  {getFieldDecorator(COUNTRY_CODE, {
                    validateTrigger: ["onChange", "onBlur"],
                    initialValue: countryCode,
                    type: "string",
                    rules: [
                      {
                        required: category === DOCTOR ? false : true,
                        message: formatMessage(messages.phoneNumberRule)
                      },
                      { validator: category === DOCTOR ? "" : this.notBlank }
                    ]
                  })(
                    <Select
                      className="country_code_value_placeholder"
                      showSearch
                      placeholder={
                        <div
                          className={
                            "country_code_value flex row align-items-center justify-content-start w100"
                          }
                        >
                          <ReactCountryFlag code={"IN"} svg />
                          <div className={"pl5"}>+91</div>
                        </div>
                      }
                      notFoundContent={null}
                      filterOption={false}
                      onSearch={this.searchCountryCode}
                      style={{ width: "100%" }}
                      onSelect={this.selectedCountryCode}
                      showArrow={false}
                      dropdownStyle={{ width: "200px" }}
                      dropdownClassName={
                        "select_country_code_dropdown" +
                        (showDropDown ? "  " : " hide_drop_down")
                      }
                      optionLabelProp={"children"}
                    >
                      {suggestedCountryCodes.map(d => {
                        return (
                          <Option
                            value={d.code}
                            key={d.alpha2 + d.code}
                            title={d.code}
                          >
                            <div
                              className={
                                "flex row align-items-start justify-content-center"
                              }
                            >
                              <div
                                className={
                                  "country_code_select flex row align-items-center justify-content-start w100"
                                }
                              >
                                <ReactCountryFlag code={d.alpha2} svg />
                                <div className={"pl5"}>
                                  {" "}
                                  {d.code} {d.name}
                                </div>
                              </div>
                              <div
                                className={
                                  "country_code_value flex row align-items-center justify-content-start w100"
                                }
                              >
                                <ReactCountryFlag code={d.alpha2} svg />
                                <div className={"pl5"}>{d.code}</div>
                              </div>
                            </div>
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  className={"flex-1"}
                  style={{ marginBottom: "0" }}
                  validateStatus={fieldError[PHONE_NUMBER] ? "error" : ""}
                  help={fieldError[PHONE_NUMBER] || ""}
                >
                  {getFieldDecorator(PHONE_NUMBER, {
                    rules: phoneNoRule,
                    initialValue: phoneNumber
                  })(
                    <Input
                      placeholder=""
                      className={"phone_number_main mb0 pb0"}
                    />
                  )}
                </FormItem>
              </div>
              <Button
                disabled={this.enableVerifyButton()}
                className={"send_otp_button"}
                onClick={this.showOtpModal}
              >
                {formatMessage(messages.sendOTP)}
              </Button>
            </div>
          </div>
          <div className={"mt20"}>
            <FormItem
              label={formatMessage(messages.fullName)}
              validateStatus={fieldError[NAME] ? "error" : ""}
              help={fieldError[NAME] || ""}
            >
              {getFieldDecorator(NAME, {
                rules: [
                  {
                    required: true,
                    message: formatMessage(messages.nameRule)
                  }
                ],

                initialValue: name
              })(<Input placeholder="" />)}
            </FormItem>
          </div>

          {category === PATIENT && (
            <div>
              <div className="mt20 flex row align-items-center iqvia-date-picker">
                <div className="full-width ">
                  <FormItem
                    label={formatMessage(messages.dateOfBirth)}
                    validateStatus={fieldError[DOB] ? "error" : ""}
                    help={fieldError[DOB] || ""}
                  >
                    {getFieldDecorator(DOB, {
                      rules: [
                        {
                          required: true,
                          message: formatMessage(messages.dobRule)
                        }
                      ],
                      initialValue: dob,
                      onChange: () => {
                        this.setState({ open: false });
                      }
                    })(
                      <DatePicker
                        showToday={false}
                        disabledDate={disabledDate}
                        className="full-width"
                      />
                    )}

                    <img
                      alt=""
                      className="calendar"
                      onClick={this.openCalendar}
                      src={calendar}
                    />
                  </FormItem>
                </div>
              </div>

              <div className="">
                <div className="fontsize12 label-color ant-form-item-required">
                  Gender
                </div>

                <div>
                  <FormItem
                    validateStatus={fieldError[GENDER] ? "error" : ""}
                    help={fieldError[GENDER] || ""}
                  >
                    {getFieldDecorator(GENDER, {
                      rules: [
                        {
                          required: true,
                          message: formatMessage(messages.genderRule)
                        }
                      ],
                      initialValue: gender
                    })(
                      <RadioGroup className="full-width male_female_radio_group">
                        <Radio.Button
                          className="full-width check-box-right flex fontsize16 "
                          value={"M"}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "8px"
                          }}
                        >
                          {formatMessage(messages.male)}
                        </Radio.Button>
                        <Radio.Button
                          className="full-width check-box-right flex fontsize16 pt8"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "8px"
                          }}
                          value={"F"}
                        >
                          {formatMessage(messages.female)}
                        </Radio.Button>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </div>
            </div>
          )}

          <div className={"mt20"}>
            <FormItem
              label={formatMessage(messages.addressLine1)}
              validateStatus={fieldError[ADDRESSLINE1] ? "error" : ""}
              help={fieldError[ADDRESSLINE1] || ""}
            >
              {getFieldDecorator(ADDRESSLINE1, {
                rules: [],
                initialValue: addressLine1
              })(<Input placeholder="" />)}
            </FormItem>
          </div>

          <div className={"mt20"}>
            <FormItem
              label={formatMessage(messages.addressLine2)}
              validateStatus={fieldError[ADDRESSLINE2] ? "error" : ""}
              help={fieldError[ADDRESSLINE2] || ""}
            >
              {getFieldDecorator(ADDRESSLINE2, {
                rules: addressLine2Rule,
                initialValue: addressLine2
              })(<Input placeholder="" />)}
            </FormItem>
          </div>
          <div className={"mt20"}>
            <FormItem
              label={formatMessage(messages.zipcode)}
              validateStatus={fieldError[ZIP_CODE] ? "error" : ""}
              help={fieldError[ZIP_CODE] || ""}
            >
              {getFieldDecorator(ZIP_CODE, {
                rules: zipCodeRule,
                initialValue: zipCode
              })(<Input placeholder="" />)}
            </FormItem>
          </div>

          <CountryCity
            form={this.props.form}
            getFieldDecorator={getFieldDecorator}
            cityLabel={formatMessage(messages.city)}
            countryLabel={formatMessage(messages.country)}
            city={city}
            country={country}
            cityField={CITY}
            countryField={COUNTRY}
            fieldError={fieldError}
            cityRules={[
              { required: true, message: formatMessage(messages.cityRule) },
              { validator: this.notBlank }
            ]}
            countryRules={[
              { required: true, message: formatMessage(messages.countryRule) },
              { validator: this.notBlank }
            ]}
          />
        </Element>
      </div>
    );
  }
}

export default injectIntl(PersonalInfo);
