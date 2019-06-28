import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Select, Radio, Form, Checkbox } from "antd";
import moment from "moment";
import {
  USER_CATEGORY,
  EVENT_TYPE,
  USER_STATUS,
  ACTIVITY_TYPE,
  APPOINTMENT_TYPE
} from "../../../../../constant";
import messages from "../message";
// import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import userPlaceHolder from "../../../../../Assets/images/ico-placeholder-userdp.svg";
import searchIcon from "../../../../../Assets/images/ico-search.svg";

// const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;
const SearchIcon = <img src={searchIcon} alt="s" className="w18 h18" />;

const { Group: RadioGroup, Button: RadioButton } = Radio;
const { Option, OptGroup } = Select;
const { Item: FormItem } = Form;

class Participants extends Component {
  getParentNode = t => t.parentNode;

  insertUserEntry = users => {
    const userOptions = [];
    users.forEach(user => {
      const {
        basicInfo: { _id, name, profilePicLink = userPlaceHolder },
        personalInfo: { dob, gender }
      } = user;
      const years = dob && moment().diff(dob, "years", false);
      userOptions.push(
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
    return userOptions;
  };

  getParticipantOption = () => {
    const { members = [] } = this.props;
    console.log(" ---- members", members);
    let options = [];
    const doctors = members.filter(member => {
      return member.basicInfo.category === USER_CATEGORY.DOCTOR;
    });
    const patients = members.filter(member => {
      return (
        member.basicInfo.category === USER_CATEGORY.PATIENT &&
        member.status === USER_STATUS.ENROLLED
      );
    });
    const careCoach = members.filter(member => {
      return member.basicInfo.category === USER_CATEGORY.CARE_COACH;
    });
    if (doctors.length > 0) {
      options.push(
        <OptGroup key={"doctor"} label={`Doctors (${doctors.length})`}>
          {this.insertUserEntry(doctors)}
        </OptGroup>
      );
    }
    if (patients.length > 0) {
      options.push(
        <OptGroup key={"patient"} label={`Patients (${patients.length})`}>
          {this.insertUserEntry(patients)}
        </OptGroup>
      );
    }

    if (careCoach.length > 0) {
      options.push(
        <OptGroup key={"careCoach"} label={`Carecoaches (${careCoach.length})`}>
          {this.insertUserEntry(careCoach)}
        </OptGroup>
      );
    }

    return options;
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  onChangeParticpantRadioGroup = e => {
    e.preventDefault();
    const { setParticipantTwo, members = [] } = this.props;
    const value = e.target.value;
    const { onChangeActivityType } = this.props;
    let category;
    members.forEach(member => {
      const { basicInfo: { _id, category: memberCategory } = {} } = member;
      if (_id === value) {
        category = memberCategory;
      }
    });
    if (category === USER_CATEGORY.DOCTOR) {
      // onChangeActivityMode(APPOINTMENT_TYPE.FOLLOWUP);
      onChangeActivityType({
        activityMode: ACTIVITY_TYPE.CHAT,
        activityType: APPOINTMENT_TYPE.FOLLOWUP
      });
    }
    setParticipantTwo(value);
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError },
      currentUser: { basicInfo: { category }, programIds = [] } = {},
      fieldName,
      participantTwo,
      userId,
      eventMode,
      disabledForEdit,
      remindCareCoach,
      setParticipantTwo
    } = this.props;
    const {
      getParticipantOption,
      formatMessage,
      onChangeParticpantRadioGroup
    } = this;

    const participantError =
      isFieldTouched(fieldName) && getFieldError(fieldName);
    const { careCoach, doctor } = programIds[0] || {};

    if (
      eventMode === EVENT_TYPE.REMINDER &&
      category === USER_CATEGORY.PATIENT
    ) {
      return (
        <div className="flex justify-content-space-between mb24">
          <div className="fontsize14 black">
            {formatMessage(messages.remindMyCareCoach)}
          </div>
          <Checkbox
            defaultChecked={!participantTwo ? false : true}
            disabled={disabledForEdit}
            onChange={remindCareCoach}
          />
        </div>
      );
    }

    return (
      <Fragment>
        <div ref={this.setref}>
          {(USER_CATEGORY.CARE_COACH === category ||
            USER_CATEGORY.DOCTOR === category) && (
            <FormItem
              label={`${
                eventMode === EVENT_TYPE.APPOINTMENT
                  ? formatMessage(messages.alongWithLabelAppointment)
                  : formatMessage(messages.alongWithLabelReminder)
              }`}
              validateStatus={participantError ? "error" : ""}
              help={participantError || ""}
            >
              {getFieldDecorator(fieldName, {
                rules: [
                  {
                    required: true,
                    message: "Enter particpant"
                  }
                ],
                initialValue: participantTwo || userId
              })(
                <Select
                  className="user-select"
                  disabled={disabledForEdit || userId !== undefined}
                  placeholder={formatMessage(messages.alongWithPlaceHolder)}
                  showSearch
                  autoComplete="off"
                  optionFilterProp="name"
                  suffixIcon={SearchIcon}
                  onChange={setParticipantTwo}
                  getPopupContainer={this.getParentNode}
                >
                  {getParticipantOption()}
                </Select>
              )}
            </FormItem>
          )}
        </div>
        {USER_CATEGORY.PATIENT === category && (
          <Fragment>
            <div className="label-color pb5 fontsize12">
              {formatMessage(messages.alongWithLabelAppointment)}
            </div>
            <FormItem style={{ marginBottom: "16px" }}>
              {getFieldDecorator(fieldName, {
                rules: [
                  {
                    required: true,
                    message: "Enter particpant"
                  }
                ],
                initialValue: careCoach || participantTwo || userId
              })(
                <RadioGroup
                  className="radio-group-tab mb24"
                  buttonStyle="solid"
                  disabled={disabledForEdit}
                  onChange={onChangeParticpantRadioGroup}
                >
                  <RadioButton
                    key={"careCoach"}
                    className="full-width"
                    value={careCoach}
                  >
                    My Care Coach
                  </RadioButton>
                  <RadioButton
                    key={"doctor"}
                    className="full-width"
                    value={doctor}
                  >
                    My Doctor
                  </RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default injectIntl(Participants);
