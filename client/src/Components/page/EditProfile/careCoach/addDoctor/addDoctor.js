import React from "react";
import "../style.less";
import "../../style.less";
import { Form, Select, Modal, Input } from "antd";
import { doRequest } from "../../../../../Helper/network";
import { Auth } from "../../../../../Helper/urls";
import { REQUEST_TYPE } from "../../../../../constant";
import { injectIntl } from "react-intl";
import { MobileInput } from "../../../../MobileInput";
import CountryCity from "../../../../../Containers/countryCity";
import messages from "../../message";
import CommonError from "../../../../CommonError";

import dropDown from "../../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import searchIcon from "../../../../../Assets/images/ico-search.svg";
import moment from "moment";
const dropdownIcon = <img alt="" src={dropDown} />;
const SearchIcon = <img alt="" src={searchIcon} />;

const DOCTOR_EMAIL = "email";
const DOCTOR_PROGRAM = "programId";
const DOCTOR_NAME = "name";
const DOCTOR_PHONE_NUMBER = "contactNo.phoneNumber";
const DOCTOR_COUNTRY_CODE = "contactNo.countryCode";
const DOCTOR_COUNTRY = "country";
const DOCTOR_CITY = "city";
const DOCTOR_SPECIALITY = "speciality";
const DOCTOR_LICENSE = "licenseNumber";
const HOSPITAL = "hospital";

//don't remove mobile no from here
//to remove something from required, change the rule props of that field
const ERROR_PRONE_FIELDS = [
  DOCTOR_EMAIL,
  DOCTOR_PROGRAM,
  DOCTOR_COUNTRY,
  DOCTOR_CITY,
  HOSPITAL,
  DOCTOR_COUNTRY_CODE,
  DOCTOR_PHONE_NUMBER
];

const { Option } = Select;
let errMessage = {};

class AddDoctor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: true, is_link_send: false, is_error: false };
    this.handleOk = this.handleOk.bind(this);
  }

  getParentNode = t => {
    return t.parentNode;
  };

  componentDidMount() {
    const { fetchProgramsData } = this.props;
    fetchProgramsData();
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

  onChangeCity = (countryId, cityId) => {
    const { resetFields, validateFields } = this.props.form;
    resetFields(HOSPITAL);
    validateFields();
    this.props.fetchHospitals(countryId, cityId);
  };

  onChangeCountry = countryId => {
    const { resetFields, validateFields } = this.props.form;
    resetFields(HOSPITAL);
    validateFields();
  };

  getHospitalsData = () => {
    const {
      form: { getFieldValue },
      hospitals: hospitalsData
    } = this.props;
    let options = [];
    for (const key in hospitalsData) {
      const hospital = hospitalsData[key];
      const countryId = getFieldValue(DOCTOR_COUNTRY);
      const cityId = getFieldValue(DOCTOR_CITY);
      if (hospital.cityId === cityId && hospital.countryId === countryId) {
        options.push(
          <Option key={`${hospital.id}`} value={hospital.id}>
            {hospital.name}
          </Option>
        );
      }
    }
    return options;
  };

  handleOk() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let formData = {};
        formData = values;
        formData.userCategory = "doctor";
        if (formData.city === "") {
          formData.city = undefined;
        }
        const {
          // form: { resetFields },
          handleCancel
        } = this.props;

        // eslint-disable-next-line no-unused-vars
        const response = doRequest({
          method: REQUEST_TYPE.POST,
          data: formData,
          url: Auth.addDoctorURL()
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

    // const { work = {} } = this.props.user_data;
    // const { speciality, licenseNumber } = work;
    const specialities = [
      <Option key={1} value="Neurologist">
        Neurologist
      </Option>,
      <Option key={2} value="Heart Surgeon">
        Heart Surgeon
      </Option>,
      <Option key={3} value="Orthopaedic">
        Orthopaedic
      </Option>
    ];

    return (
      <div>
        {/* <div>
          {this.state.is_link_send && (
            <CommonMessage
              msg={formatMessage(messages.newDoctorSuccess)}
              className={"carecoach-new-user-success-message top60"}
              close={this.clearMsg}
            />
          )}
        </div> */}

        <Modal
          title={formatMessage(messages.newDoctor)}
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
          <div className="end-padding hihhihhihhhihh">
            <Form className="full-width">
              <Form.Item
                validateStatus={fieldError[DOCTOR_EMAIL] ? "error" : ""}
                help={fieldError[DOCTOR_EMAIL] || ""}
                label={formatMessage(messages.doctorEmail)}
              >
                {getFieldDecorator(DOCTOR_EMAIL, {
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
                validateStatus={fieldError[DOCTOR_PROGRAM] ? "error" : ""}
                help={fieldError[DOCTOR_PROGRAM] || ""}
                label={formatMessage(messages.program)}
              >
                {getFieldDecorator(DOCTOR_PROGRAM, {
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
                    //onChange={this.onChangeCity}
                    getPopupContainer={this.getParentNode}
                  >
                    {this.getProgramsData()}
                  </Select>
                )}
              </Form.Item>
              <div className="optional">Optional</div>
              <Form.Item label={formatMessage(messages.fullName)}>
                {getFieldDecorator(DOCTOR_NAME, {
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
                phoneField={DOCTOR_PHONE_NUMBER}
                countryCodeField={DOCTOR_COUNTRY_CODE}
                {...this.props}
              />
              <div />

              <div className="mt20 flex row align-items-center">
                <div className="full-width ">
                  <Form.Item label={formatMessage(messages.licenseId)}>
                    {getFieldDecorator(DOCTOR_LICENSE)(<Input />)}
                  </Form.Item>
                </div>
              </div>

              <div className="mt20">
                <Form.Item label={formatMessage(messages.speciality)}>
                  {getFieldDecorator(DOCTOR_SPECIALITY, {})(
                    <Select
                      className={"full-width iqvia-style-select fontsize14"}
                      suffixIcon={dropdownIcon}
                      placeholder=""
                      getPopupContainer={this.getParentNode}
                    >
                      {specialities}
                    </Select>
                  )}
                </Form.Item>
              </div>

              <CountryCity
                form={this.props.form}
                getFieldDecorator={getFieldDecorator}
                cityLabel={formatMessage(messages.city)}
                countryLabel={formatMessage(messages.country)}
                cityField={DOCTOR_CITY}
                countryField={DOCTOR_COUNTRY}
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
                onChangeCountry={this.onChangeCountry}
                onChangeCity={this.onChangeCity}
              />

              <div className="end">
                <Form.Item
                  label="Hospital(s) doctor work at"
                  help={fieldError[HOSPITAL] || ""}
                  validateStatus={fieldError[HOSPITAL] ? "error" : ""}
                >
                  {getFieldDecorator(HOSPITAL, {})(
                    <Select
                      className={"full-width iqvia-style-select fontsize14"}
                      suffixIcon={SearchIcon}
                      showSearch
                      autoComplete="off"
                      mode="multiple"
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
              </div>
            </Form>
            <div>
              {this.state.is_error && (
                <CommonError
                  msg={errMessage}
                  className={"carecoach-new-user-failure-message"}
                  close={this.clearMsg}
                />
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default injectIntl(Form.create()(AddDoctor));
