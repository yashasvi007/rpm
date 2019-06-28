import React, { Component, Fragment } from "react";
import { Form, Select, Input, DatePicker, TimePicker, Radio } from "antd";
import moment from "moment";
import { injectIntl } from "react-intl";
import { doRequest } from "../../../Helper/network";
import { User } from "../../../Helper/urls";
import { USER_CATEGORY, SEVERITY } from "../../../constant";
import messages from "./message";
import calendar from "../../../Assets/images/button-select-date.svg";
import dropDownIcon from "../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import userPlaceHolder from "../../../Assets/images/ico-placeholder-userdp.svg";

const { Item: FormItem } = Form;
const { TextArea } = Input;
const { Option } = Select;

const { Group: RadioGroup, Button: RadioButton } = Radio;
const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;

const PATIENT = "patient";
const SEVERITY_FIELD = "severity";
const ON = "on";
const AT = "at";
const DESCRIPTION = "description";

class AdverseEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      category: ""
    };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    const { auth } = this.props;
    let userCategory;
    if (auth) {
      const {
        basicInfo: { category }
      } = auth;
      userCategory = category;
      this.setState({ category: userCategory });
    }
    this.props.form.validateFields();
    if (userCategory !== PATIENT) {
      doRequest({
        url: User.getRelatedMembersURL()
      })
        .then(res => {
          const { payload: { data: { members = {} } = {} } = {} } = res;
          const patients = members.filter(value => {
            const { basicInfo: { category } = {} } = value;
            return category === USER_CATEGORY.PATIENT;
          });
          this.setState({ patients: patients });
        })
        .catch(err => {});
    }
  }

  getParentNode = t => t.parentNode;

  getSeverityOption = () => {
    const { formatMessage } = this;
    const options = [
      { label: formatMessage(messages.mild), value: SEVERITY.MILD },
      { label: formatMessage(messages.moderate), value: SEVERITY.MODERATE },
      { label: formatMessage(messages.severe), value: SEVERITY.SEVERE },
      {
        label: formatMessage(messages.verySevere),
        value: SEVERITY.VERY_SEVERE
      },
      { label: formatMessage(messages.fatal), value: SEVERITY.FATAL }
    ];
    return options.map(option => {
      return (
        <RadioButton
          key={option.value}
          value={option.value}
          className="full-width"
        >
          {option.label}
        </RadioButton>
      );
    });
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  componentDidUpdate() {}

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleSubmit = e => {
    e.preventDefault();
    // const { handleSubmit } = this.props;
    // const { selectedDays } = this.state;

    // this.props.form.validateFields((err, values) => {
    //
    //   if (!err) {
    //     handleSubmit({ ...values, [REPEAT_PARAM_WEEKLY]: selectedDays });
    //   }
    // });
  };

  getPatientOption = () => {
    const { patients = [] } = this.state;

    return patients.map(data => {
      const {
        basicInfo: { _id, name, profilePicLink = userPlaceHolder },
        personalInfo: { dob, gender }
      } = data;
      const years = dob && moment().diff(dob, "years", false);
      return (
        <Option key={_id} value={_id} name={name}>
          <div className="flex justify-content-start align-items-center iqvia-user-snippet">
            <img alt={"user"} src={profilePicLink} />
            <div className="deep-sea-blue fontsize12 mr8">{`${name}${
              years ? ` (${years} ${gender})` : ""
            }`}</div>
          </div>
        </Option>
      );
    });
  };

  openCalendar = e => {
    e.preventDefault();
    window.document
      .getElementsByClassName("ant-calendar-picker-input")[0]
      .click();
  };

  getLatestMedication = () => {
    const {
      medications = {},
      products,
      form: { getFieldValue },
      intl: { formatMessage }
    } = this.props;
    const {
      auth: {
        basicInfo: { _id: loggedInUser }
      },
      userId: creatingUser
    } = this.props;
    const userId =
      loggedInUser === creatingUser ? loggedInUser : getFieldValue(PATIENT);
    if (userId) {
      const medication = medications[userId];
      if (medication) {
        const { medicine = {} } = medication;
        const allKeys = Object.keys(medicine) || [];
        const medicines = allKeys.filter(value => value !== "updatedAt");
        const { updatedAt } = medicine;
        const updatedOnDate = moment(updatedAt);
        return (
          <Fragment>
            <div className="flex align-items-center mb12">
              <div className="fontsize14 dark bold">
                {formatMessage(messages.medicationDetails)}
              </div>
              {allKeys.length > 0 ? (
                <div className="fontsize12 label-color ml8">
                  {`${formatMessage(
                    messages.lastMedicatedOn
                  )} ${updatedOnDate.format("DD/MM/YYYY hh:mm A")}`}
                </div>
              ) : (
                ""
              )}
            </div>
            {medicines.map((value, index) => {
              const { product_id, often, upto } = medicine[value];
              const product_detail = products[product_id] || {};
              const medicatedTill = moment(upto).format("L");
              const daysLeftForMedication =
                moment().diff(upto, "days", false) * -1;
              return (
                <Fragment key={product_id}>
                  <div className="dark fontsize14">{product_detail.name}</div>
                  <div className="mb20 dark fontsize14">
                    {`${often}, ${
                      daysLeftForMedication > 0 ? daysLeftForMedication : 0
                    } ${formatMessage(
                      messages.daysOfMedicationLeftTill
                    )} ${medicatedTill}`}
                  </div>
                </Fragment>
              );
            })}
          </Fragment>
        );
      }
    }
    return null;
  };

  onChangePatient = value => {
    const { fetchUserRecentMedication } = this.props;
    fetchUserRecentMedication(value);
  };

  disabledDate = current => {
    // Can not select days after today
    return current && current >= moment();
  };

  validateTime = async (rule, current, cb) => {
    if (current > moment()) {
      cb("reporting event for future is not allowed");
    } else {
      cb();
    }
  };

  render() {
    const { form, userId } = this.props;
    const { getFieldDecorator, getFieldError, isFieldTouched } = form;
    const {
      formatMessage,
      handleSubmit,
      getSeverityOption,
      getPatientOption,
      openCalendar,
      getLatestMedication,
      onChangePatient,
      validateTime
    } = this;

    const { category } = this.state;

    const patientError = isFieldTouched(PATIENT) && getFieldError(PATIENT);
    const descriptionError =
      isFieldTouched(DESCRIPTION) && getFieldError(DESCRIPTION);

    const timeError = isFieldTouched(AT) && getFieldError(AT);

    return (
      <Form className="event-form" onSubmit={handleSubmit}>
        {category !== PATIENT && (
          <div ref={this.setParticipantRef} id={"asasa"}>
            <FormItem
              label={formatMessage(messages.tagAPatient)}
              validateStatus={patientError ? "error" : ""}
              help={patientError || ""}
            >
              {getFieldDecorator(PATIENT, {
                rules: [
                  {
                    required: true,
                    message: "Enter a patient"
                  }
                ],
                initialValue: userId
              })(
                <Select
                  className="user-select"
                  onChange={onChangePatient}
                  disabled={userId ? true : false}
                  placeholder={formatMessage(messages.tagAPatient)}
                  showSearch
                  autoComplete="off"
                  optionFilterProp="name"
                  suffixIcon={DropDownIcon}
                  filterOption={(input, option) =>
                    option.props.name
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={this.getParentNode}
                >
                  {getPatientOption()}
                </Select>
              )}
            </FormItem>
          </div>
        )}

        <FormItem
          validateStatus={descriptionError ? "error" : ""}
          help={descriptionError || ""}
          label={formatMessage(messages.whatHappen)}
        >
          {getFieldDecorator(DESCRIPTION, {
            rules: [
              {
                required: true,
                message: "Enter a description"
              }
            ]
          })(
            <TextArea
              //placeholder={formatMessage(messages.whatHappen)}
              autosize={{ minRows: 1, maxRows: 6 }}
            />
          )}
        </FormItem>

        <div className="flex justify-content-space-between mb4">
          <div className="flex-1 flex row align-items-end iqvia-date-picker">
            <div className="full-width " ref={this.setDatePickerRef}>
              <FormItem
                className="flex-1 date-picker"
                label={formatMessage(messages.on)}
              >
                {getFieldDecorator(ON, {
                  rules: [],
                  initialValue: moment()
                })(
                  <DatePicker
                    format="DD/MM/YYYY, ddd"
                    disabledDate={this.disabledDate}
                    showToday={false}
                    className="full-width"
                    suffixIcon={null}
                    getCalendarContainer={this.getParentNode}
                  />
                )}

                <img
                  alt=""
                  className="calendar"
                  onClick={openCalendar}
                  src={calendar}
                />
              </FormItem>
            </div>
          </div>
          <div ref={this.setTimePickerRef}>
            <FormItem
              label={formatMessage(messages.at)}
              validateStatus={timeError ? "error" : ""}
              help={timeError || ""}
            >
              {getFieldDecorator(AT, {
                rules: [
                  {
                    validator: validateTime
                  }
                ],
                initialValue: moment()
              })(
                <TimePicker
                  use12Hours
                  format="h:mm A"
                  style={{ width: "100%" }}
                  suffixIcon={null}
                  alowClear={false}
                  clearIcon={null}
                  getPopupContainer={this.getParentNode}
                  // onChange={checkTime}
                />
              )}
            </FormItem>
          </div>
        </div>

        <FormItem label={formatMessage(messages.severity)}>
          {getFieldDecorator(SEVERITY_FIELD, {
            rules: [],
            initialValue: SEVERITY.MILD
          })(
            <RadioGroup className="radio-group-tab " buttonStyle="solid">
              {getSeverityOption()}
            </RadioGroup>
          )}
        </FormItem>
        <div>{getLatestMedication()}</div>
      </Form>
    );
  }
}

export default injectIntl(AdverseEventForm);
