import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import moment from "moment";
import isEmpty from "lodash-es/isEmpty";
import { Select, DatePicker, Input, Row, Col } from "antd";
import throttle from "lodash-es/throttle";
import DownArrow from "../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import search from "../../../Assets/images/ico-search.svg";
import PatientCard from "../Cards/patientCard";
import getPatientCardData from "../../../Helper/dataFormater/patientCard";
import messages from "./message";

// const data = {
//   id: "123546",
//   profilePicLink: placeholder,
//   title: "patient",
//   age: "23",
//   gender: "M",
//   doctor: "Doctor",
//   hospital: "hospital"
// };

const Option = Select.Option;

function disabledDate(current) {
  // Can not select days after today
  return current && current < moment().endOf("day");
}

class PatientPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      patients: [],
      surveyEndDate: null
    };

    this.getpatient = throttle(this.getpatient.bind(this), 1000);
  }

  // componentDidMount(){
  //   const {
  //     getValidProgramForSurvey,
  //   } = this.props;
  //   const templateId = this.props.match.params.templateId;
  //   getValidProgramForSurvey(templateId);
  // }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedProgram !== prevProps.selectedProgram) {
      const { programs_data, selectedProgram } = this.props;
      const { patients } =
        selectedProgram !== "" ? programs_data[selectedProgram] : [];
      this.setState({ patients });
    }
    if (this.props.selectedsurvey !== prevProps.selectedsurvey) {
      const { selectedsurvey } = this.props;
      if (!isEmpty(selectedsurvey)) {
        const { startDate = null, endDate = null } = selectedsurvey;
        this.setState({ surveyEndDate: endDate, surveyStartDate: startDate });
      }
    }
    if (this.props.programs_data !== prevProps.programs_data) {
      const { programs_data, selectedProgram } = this.props;
      const { patients } =
        selectedProgram !== "" ? programs_data[selectedProgram] : [];
      this.setState({ patients: patients });
    }
  }

  getProgramsOption = () => {
    const { programs_data, availableProgram, selectedsurvey } = this.props;

    if (isEmpty(selectedsurvey)) {
      const options = [];
      if (availableProgram) {
        availableProgram.forEach(programId => {
          const { name, expiresOn } = programs_data[programId];
          const checkIfExpired = moment().diff(expiresOn, "years", true);
          if (checkIfExpired < 0) {
            options.push(
              <Option key={programId} value={programId}>
                {name}
              </Option>
            );
          }
        });
      }
      return options;
    } else {
      const { program } = selectedsurvey;
      const { name } = !isEmpty(programs_data) ? programs_data[program] : {};
      const option = (
        <Option key={program} value={program}>
          {name}
        </Option>
      );
      return option;
    }
  };

  handleSearchChange = e => {
    e.preventDefault();
    this.setState({ query: e.target.value });
    this.getpatient(e.target.value);
  };

  getpatient(query) {
    const { handleSearch } = this.props;
    handleSearch(query);
    // const { programs_data, selectedProgram, selectedsurvey } = this.props;
    // let currentProgram = selectedProgram;
    // if (currentProgram !== "") {
    //   if (!isEmpty(selectedsurvey)) {
    //     const { program = "" } = selectedsurvey;
    //     currentProgram = program;
    //   }
    //   const { patients: patientsList = {} } = programs_data[currentProgram];
    //   let patientData = [];
    //   const { users } = this.props;
    //   patientData = patientsList.filter(patient => {
    //     const { basicInfo } = users[patient];
    //     const { name } = basicInfo;
    //     const regex = new RegExp("(" + query + ")", "gi");
    //     // console.log("---name---", regex,regex.test(name))

    //     if (regex.test(name)) {
    //       return true;
    //     }
    //     return false;
    //   });
    //   this.setState({ patients: patientData });
    // }
  }

  getProgramPatient = patients => {
    const patientData = [];
    const { users, hospitals_data, user_data: currentUser } = this.props;
    patients.forEach(patient => {
      let data = {};
      data = getPatientCardData({
        users,
        hospitals: hospitals_data,
        currentUser,
        patient: users[patient] ? users[patient] : ""
      });
      patientData.push(data);
    });
    return patientData;
  };

  getParentNode = t => t.parentNode;

  render() {
    const {
      handleOnCheck,
      handleOnSelect,
      selectedProgram = "",
      programs_data,
      handleSelectChange,
      handleSortByChange,
      selectedPatient,
      intl: { formatMessage },
      uncheckAll,
      showSendSurveyBarToggle,
      handleDateChange,
      selectedsurvey,
      startDate,
      endDate
    } = this.props;
    // const { patients: patientsList = [] } = programs_data[selectedProgram]
    //   ? programs_data[selectedProgram]
    //   : {};
    const { patients: patientsList = [] } = this.state;
    const { getProgramsOption, getProgramPatient, handleSearchChange } = this;
    let surveyStartDate = moment();
    let surveyEndDate;
    let surveyPaticipants = [];
    let surveyProgram = selectedProgram;
    let programPatients = [];
    if (!isEmpty(selectedsurvey)) {
      const { participants = [], program = "" } = selectedsurvey;

      surveyPaticipants = participants;
      surveyProgram = program;
      let { patients: surveyPatients } = programs_data[program]
        ? programs_data[program]
        : [];
      programPatients = surveyPatients ? getProgramPatient(surveyPatients) : [];
    }
    const programOptions = getProgramsOption();

    if (patientsList.length > 0) {
      surveyStartDate = moment();
      surveyEndDate = null;
      programPatients = getProgramPatient(patientsList);
    }
    let patientCount = "";
    if (selectedProgram !== "") {
      const { patients } = programs_data[selectedProgram];
      if (patients) {
        patientCount = patients.length;
      }
    }
    let programName = "";
    let programCountry = "";
    if (selectedProgram !== "") {
      const currentProgram = programs_data[selectedProgram];
      if (currentProgram) {
        const { name, targetLocation = {} } = currentProgram;
        const { country = "" } = targetLocation;
        programName = name;
        programCountry = country;
      }
    }
    if (startDate) {
      surveyStartDate = moment(startDate);
    }
    if (endDate) {
      surveyEndDate = moment(endDate);
    }

    return (
      <Fragment>
        <div className="patients-selection">
          <Row gutter={{ sm: 24, md: 24 }} className="w100">
            <Col sm={12} md={6}>
              <div className="w100 mb8">
                <div className="fontsize12 label-color mb8">
                  {formatMessage(messages.program)}
                </div>
                <Select
                  className="select-program w100"
                  onChange={handleOnSelect}
                  suffixIcon={
                    <img
                      alt=""
                      src={DownArrow}
                      className="arrow-img-program-select"
                    />
                  }
                  value={surveyProgram}
                  disabled={!isEmpty(selectedsurvey)}
                  getPopupContainer={this.getParentNode}
                >
                  {programOptions}
                </Select>
              </div>
            </Col>
            <Col sm={12} md={6}>
              <div className="flex align-items-center justify-content-center mb8">
                <div>
                  <div className="fontsize12 label-color mb8 ">
                    {formatMessage(messages.surveys)}
                  </div>
                  <div className="range-picker ">
                    <DatePicker
                      format="DD/MM/YYYY"
                      size={"small"}
                      separator="-"
                      showToday={false}
                      className=""
                      suffixIcon={null}
                      disabled
                      defaultValue={moment()}
                      value={surveyStartDate}
                      getCalendarContainer={this.getParentNode}
                    />
                  </div>
                </div>
                <div>
                  <div className="fontsize12 label-color mb8 ml16">
                    {formatMessage(messages.endDate)}{" "}
                    <span className="warning-color fontsize12">*</span>
                  </div>
                  <div className="range-picker ml16">
                    <DatePicker
                      format="DD/MM/YYYY"
                      size={"small"}
                      separator="-"
                      showToday={false}
                      className=""
                      suffixIcon={null}
                      allowClear={false}
                      onChange={handleDateChange}
                      value={surveyEndDate}
                      disabledDate={disabledDate}
                      getCalendarContainer={this.getParentNode}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="mt24 mb16">
            {selectedProgram !== "" && (
              <div className="fontsize18 bold dark mt24 mb16">
                {formatMessage(messages.chooseFrom)} {patientCount}
                {formatMessage(messages.patientAt)} {programName}
                {formatMessage(messages.programAt)} {programCountry}
                {formatMessage(messages.programIn)}
              </div>
            )}
          </div>
          {/* <div className="flex justify-content-center align-items-center flex-wrap"> */}
          <Row gutter={{ sm: 12, md: 24 }} className="w100">
            <Col sm={12} md={4}>
              <Input
                className="survey-detail-input w100 mb16"
                placeholder="Search patients"
                prefix={<img alt="" src={search} className="search-icons" />}
                onChange={handleSearchChange}
              />
            </Col>
            <Col sm={6} md={4}>
              <div className=" survey-detail-select flex align-items-center ">
                <div className="fontsize14 medium dark pl8 ">
                  {formatMessage(messages.showing)}
                </div>
                <Select
                  optionFilterProp="children"
                  suffixIcon={
                    <img alt="" src={DownArrow} className="arrow-img" />
                  }
                  defaultValue="All"
                  className="flex align-items-center flex-grow-1"
                  onChange={handleSelectChange}
                  getPopupContainer={this.getParentNode}
                >
                  <Option key="All">{formatMessage(messages.all)}</Option>
                  <Option key="Enrolled">
                    {formatMessage(messages.enrolled)}
                  </Option>
                  {/* <Option key="Inactive">
                  {formatMessage(messages.inactive)}
                </Option> */}
                  <Option key="Discharged">
                    {formatMessage(messages.discharged)}
                  </Option>
                </Select>
              </div>
            </Col>
            <Col sm={6} md={4}>
              <div className=" survey-detail-select flex align-items-center">
                <div className="fontsize14 medium dark pl8">
                  {formatMessage(messages.sortBy)}{" "}
                </div>
                <Select
                  optionFilterProp="children"
                  suffixIcon={
                    <img alt="" src={DownArrow} className="arrow-img" />
                  }
                  onChange={handleSortByChange}
                  defaultValue="name"
                  className="flex align-items-center flex-grow-1"
                  getPopupContainer={this.getParentNode}
                >
                  <Option key="name">{formatMessage(messages.name)}</Option>
                  {/*<Option key="Location">*/}
                  {/*  {formatMessage(messages.location)}*/}
                  {/*</Option>*/}
                  <Option key="createdAt">
                    {formatMessage(messages.dateAdded)}
                  </Option>
                </Select>
              </div>
            </Col>
          </Row>
          {/* </div> */}
          <div className="the-cards flex align-items-center flex-wrap">
            <Row gutter={8} className="w100">
              {programPatients.map((patient, index) => {
                let checkbox = false;
                let disabled = false;
                if (selectedPatient && selectedPatient.includes(patient.id)) {
                  checkbox = true;
                }
                const particpantIndex = surveyPaticipants.findIndex(
                  participant => participant.participantId === patient.id
                );
                if (particpantIndex !== -1) {
                  disabled = true;
                  checkbox = true;
                }
                return (
                  <PatientCard
                    key={patient.id}
                    data={patient}
                    onPatientCardSelect={handleOnCheck}
                    onPatientCardDeselect={handleOnCheck}
                    uncheckAll={uncheckAll}
                    showDischargeBarToggle={showSendSurveyBarToggle}
                    classname={"patient-cards"}
                    selectedPatient={selectedPatient}
                    handleOnClick={true}
                    checkbox={checkbox}
                    disabled={disabled}
                  />
                );
              })}
            </Row>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(PatientPane);
