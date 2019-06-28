import React from "react";
import map from "lodash-es/map";
import without from "lodash-es/without";
import forEach from "lodash-es/forEach";
import moment from "moment";
import "../style.less";
import "../../style.less";
import { Form, Select, DatePicker, Modal, Input, Radio } from "antd";
import { doRequest } from "../../../../../Helper/network";
import { Auth } from "../../../../../Helper/urls";
import { REQUEST_TYPE } from "../../../../../constant";
import { injectIntl } from "react-intl";
import calendar from "../../../../../Assets/images/button-select-date.svg";
import { MobileInput } from "../../../../MobileInput";
import CountryCity from "../../../../../Containers/countryCity";
import messages from "../../message";
import CommonError from "../../../../CommonError";

import dropDown from "../../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import searchIcon from "../../../../../Assets/images/ico-search.svg";
const SearchIcon = <img alt="" src={searchIcon} />;
const dropdownIcon = <img alt="" src={dropDown} />;

const PATIENT_EMAIL = "email";
const PATIENT_PROGRAM = "programId";
const PATIENT_NAME = "name";
const PATIENT_PHONE_NUMBER = "contactNo.phoneNumber";
const PATIENT_COUNTRY_CODE = "contactNo.countryCode";
const PATIENT_DOB = "dob";
const PATIENT_GENDER = "gender";
const PATIENT_COUNTRY = "country";
const PATIENT_CITY = "city";
const DOCTOR = "doctor";
const HOSPITAL = "hospital";

//don't remove mobile no from here
//to remove something from required, change the rule props of that field
const ERROR_PRONE_FIELDS = [
  PATIENT_EMAIL,
  PATIENT_PROGRAM,
  PATIENT_PHONE_NUMBER,
  DOCTOR,
  HOSPITAL,
  PATIENT_COUNTRY_CODE
];

const { Option } = Select;
let errMessage = {};

function disabledDate(current) {
  // Can not select days after today
  return current && current > moment().endOf("day");
}

class AddPatient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      is_link_send: false,
      is_error: false,
      toggleAddPatient: true
    };
    this.handleOk = this.handleOk.bind(this);
  }

  getParentNode = t => {
    return t.parentNode;
  };

  componentDidMount() {
    const { fetchProgramsData } = this.props;
    fetchProgramsData();
    //to disable end button intially
    const { validateFields } = this.props.form;
    validateFields();
  }

  componentWillUnmount() {
    const { resetFields } = this.props.form;
    resetFields();
  }

  formatMessage = data => {
    this.props.intl.formatMessage(data);
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let formData = {};
        formData = values;
        if (formData.city === "") {
          formData.city = undefined;
        }
        formData.userCategory = "patient";
        const { handleCancel } = this.props;

        doRequest({
          method: REQUEST_TYPE.POST,
          data: formData,
          url: Auth.addPatientURL()
        }).then(response => {
          errMessage = response.payload.error
            ? response.payload.error.message
            : "";
          !response.status
            ? this.setState({ visible: true, is_error: true })
            : this.setState({ visible: false, is_link_send: true }, () => {
                setTimeout(async () => {
                  //await resetFields();
                  await handleCancel();
                }, 3000);
              });
        });
      } else if (err) {
        this.setState({
          visible: true,
          is_error: true
        });
      }
    });
  }

  getProgramsData = () => {
    const programsData = this.props.programs;
    let options = [];

    for (const key in programsData) {
      const program = programsData[key];
      //To resolve duplicate key warnings
      if (program._id !== undefined && moment().isBefore(program.expiresOn)) {
        options.push(
          <Option key={`${program._id}`} value={program._id}>
            {program.name}
          </Option>
        );
      }
    }
    return options;
  };

  getDoctorsData = () => {
    //

    const {
      users,
      form: { getFieldValue }
    } = this.props;
    const programId = getFieldValue(PATIENT_PROGRAM);
    console.log("programId", programId);
    const { doctors = {} } = this.props.programs[programId] || {};
    //
    //
    console.log("doctors=====>", doctors);
    let doctorsData = [];
    forEach(doctors, doctor => {
      const doctorId = doctor._id;
      if (doctor && doctorId && users[doctorId]) {
        doctorsData.push(users[doctorId]);
      }
    });

    //const doctorsData = this.props.programs.programDoctors;
    let options = [];
    forEach(doctorsData, doctor => {
      options.push(
        <Option key={`${doctor._id}`} value={doctor._id}>
          {doctor.name}
        </Option>
      );
    });
    return options;
  };

  getHospitalsData = () => {
    const {
      form: { getFieldValue },
      hospitals = {},
      users = {}
    } = this.props;
    let hospitalsData = hospitals;
    const selectedDoctor = getFieldValue(DOCTOR);

    if (selectedDoctor && users[selectedDoctor]) {
      const doctor = users[selectedDoctor];
      let visitingHospitals = doctor.visitingHospitals;
      hospitalsData = map(hospitalsData, hospital => {
        if (visitingHospitals.includes(hospital.id)) return hospital;
      });
      hospitalsData = without(hospitalsData, undefined);
    }

    let options = [];
    for (const key in hospitalsData) {
      const hospital = hospitalsData[key];
      options.push(
        <Option key={`${hospital.id}`} value={hospital.id}>
          {hospital.name}
        </Option>
      );
    }
    return options;
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
    const { resetFields } = this.props.form;
    resetFields();
    this.props.handleCancel();
  };

  clearMsg = e => {
    //e.preventDefault();
    this.setState({
      is_link_send: false,
      is_error: false
    });
  };

  openCalendar = e => {
    //e.preventDefault();
    window.document
      .getElementsByClassName("ant-calendar-picker-input")[0]
      .click();
  };

  isError = () => {
    const { getFieldError } = this.props.form;
    for (const k in ERROR_PRONE_FIELDS) {
      const key = ERROR_PRONE_FIELDS[k];
      if (getFieldError(key)) {
        return true;
      }
    }
    return false;
  };

  onChangeProgram = value => {
    const {
      fetchProgramDoctors,
      form: { resetFields, validateFields }
    } = this.props;
    fetchProgramDoctors(value);
    resetFields([DOCTOR, HOSPITAL]);
    validateFields([DOCTOR, HOSPITAL]);
  };

  onChangeDoctor = value => {
    const {
      form: { resetFields, validateFields },
      fetchDoctorHospitals
    } = this.props;
    resetFields([HOSPITAL]);
    fetchDoctorHospitals(value);
    validateFields([HOSPITAL]);
  };

  isText = (rule, value, callback) => {
    if (value && value.length > 0 && value.match("^[A-Za-z ]+$") === null) {
      callback("Enter valid name");
    } else {
      callback();
    }
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;

    const {
      getFieldDecorator,
      isFieldTouched,
      getFieldError
    } = this.props.form;
    const { isError } = this;

    let fieldError = {};

    ERROR_PRONE_FIELDS.forEach(field => {
      fieldError[field] = isFieldTouched(field) && getFieldError(field);
    });

    return (
      <div>
        {/* <div>
          {this.state.is_link_send && (
            <CommonMessage
              msg={formatMessage(messages.newPatientSuccess)}
              className={"carecoach-new-user-success-message top60"}
              close={this.clearMsg}
            />
          )}
        </div> */}

        <Modal
          title={formatMessage(messages.newPatient)}
          visible={this.state.visible}
          onOk={this.handleOk}
          okButtonProps={{
            disabled: isError()
          }}
          onCancel={this.handleCancel}
          okText="Send Invite"
          wrapClassName={"add-modals"}
          destroyOnClose={true}
        >
          <Form className="full-width">
            <Form.Item
              validateStatus={fieldError[PATIENT_EMAIL] ? "error" : ""}
              help={fieldError[PATIENT_EMAIL] || ""}
              label={formatMessage(messages.patientEmail)}
            >
              {getFieldDecorator(PATIENT_EMAIL, {
                rules: [
                  {
                    type: "email",
                    required: true,
                    message: formatMessage(messages.incorrectEmail)
                  }
                ]
              })(<Input />)}
            </Form.Item>

            <Form.Item
              validateStatus={fieldError[PATIENT_PROGRAM] ? "error" : ""}
              help={fieldError[PATIENT_PROGRAM] || ""}
              label={formatMessage(messages.program)}
            >
              {getFieldDecorator(PATIENT_PROGRAM, {
                rules: [
                  {
                    required: true,
                    message: formatMessage(messages.programError)
                  }
                ]
              })(
                <Select
                  className={"full-width iqvia-style-select fontsize14"}
                  suffixIcon={dropdownIcon}
                  showSearch
                  autoComplete="off"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={this.onChangeProgram}
                  getPopupContainer={this.getParentNode}
                >
                  {this.getProgramsData()}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              label={formatMessage(messages.caseDoctor)}
              validateStatus={fieldError[DOCTOR] ? "error" : ""}
              help={fieldError[DOCTOR] || ""}
            >
              {getFieldDecorator(DOCTOR, {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  className={"full-width iqvia-style-select fontsize14"}
                  suffixIcon={SearchIcon}
                  showSearch
                  autoComplete="off"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={this.onChangeDoctor}
                  getPopupContainer={this.getParentNode}
                >
                  {this.getDoctorsData()}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              label={formatMessage(messages.hospital)}
              validateStatus={fieldError[HOSPITAL] ? "error" : ""}
              help={fieldError[HOSPITAL] || ""}
            >
              {getFieldDecorator(HOSPITAL, {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  className={"full-width iqvia-style-select fontsize14"}
                  suffixIcon={SearchIcon}
                  showSearch
                  autoComplete="off"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={this.getParentNode}
                >
                  {this.getHospitalsData()}
                </Select>
              )}
            </Form.Item>

            <div className="optional">Optional</div>
            <Form.Item label={formatMessage(messages.fullName)}>
              {getFieldDecorator(PATIENT_NAME, {
                rules: [
                  {
                    validator: this.isText
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <div className="mobile-gender">
              {formatMessage(messages.mobile)}
            </div>
            <MobileInput
              fieldError={fieldError}
              phoneField={PATIENT_PHONE_NUMBER}
              countryCodeField={PATIENT_COUNTRY_CODE}
              {...this.props}
            />
            <div />

            <div className="mt20 flex row align-items-center iqvia-date-picker">
              <div className="full-width ">
                <Form.Item label={formatMessage(messages.dateOfBirth)}>
                  {getFieldDecorator(PATIENT_DOB, {
                    onChange: () => {
                      this.setState({ open: false });
                    }
                  })(
                    <DatePicker
                      showToday={false}
                      disabledDate={disabledDate}
                      className="full-width"
                      getCalendarContainer={this.getParentNode}
                    />
                  )}
                  <img
                    alt=""
                    className="calendar"
                    onClick={this.openCalendar}
                    src={calendar}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="">
              <div className="mobile-gender">Gender</div>
              <Form.Item>
                {getFieldDecorator(PATIENT_GENDER, {})(
                  <Radio.Group className="full-width male_female_radio_group">
                    <Radio.Button
                      className="full-width check-box-right flex fontsize16"
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
                  </Radio.Group>
                )}
              </Form.Item>
            </div>

            <CountryCity
              form={this.props.form}
              getFieldDecorator={getFieldDecorator}
              cityLabel={formatMessage(messages.city)}
              countryLabel={formatMessage(messages.country)}
              cityField={PATIENT_CITY}
              countryField={PATIENT_COUNTRY}
              fieldError={fieldError}
              cityRules={[
                {
                  required: false,
                  message: formatMessage(messages.cityRule)
                }
              ]}
              countryRules={[
                {
                  required: false,
                  message: formatMessage(messages.countryRule)
                }
              ]}
            />

            {/* <Form.Item
              label="Doctor"
              validateStatus={fieldError[DOCTOR] ? "error" : ""}
              help={fieldError[DOCTOR] || ""}
            >
              {getFieldDecorator(DOCTOR, {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  className={"full-width iqvia-style-select fontsize14"}
                  suffixIcon={SearchIcon}
                  showSearch
                  autoComplete="off"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={this.onChangeDoctor}
                >
                  {this.getDoctorsData()}
                </Select>
              )}
            </Form.Item> */}

            <div className="end-padding">
              {/* <Form.Item
                label="Hospital"
                validateStatus={fieldError[HOSPITAL] ? "error" : ""}
                help={fieldError[HOSPITAL] || ""}
              >
                {getFieldDecorator(HOSPITAL, {
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <Select
                    className={"full-width iqvia-style-select fontsize14"}
                    suffixIcon={SearchIcon}
                    showSearch
                    autoComplete="off"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.getHospitalsData()}
                  </Select>
                )}
              </Form.Item> */}
            </div>

            <div className="end-padding">
              {this.state.is_error && (
                <CommonError
                  msg={errMessage}
                  className={"carecoach-new-user-failure-message"}
                  close={this.clearMsg}
                />
              )}
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default injectIntl(Form.create()(AddPatient));
