import React, { Component, Fragment } from "react";
import { Select, Input, Row } from "antd";
import { injectIntl } from "react-intl";
import moment from "moment";
import throttle from "lodash-es/throttle";
import search from "../../../../Assets/images/ico-search.svg";
import DownArrow from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import PatientCard from "../../Cards/patientCard";
import getPatientCardData from "../../../../Helper/dataFormater/patientCard";
import { USER_STATUS } from "../../../../constant";

const { Option } = Select;

class ShareToPatients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      program: ""
    };
    this.onSearch = throttle(this.onSearch.bind(this), 1000);
  }

  componentDidMount() {
    const { fetchProgramsData } = this.props;
    fetchProgramsData();
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  getParentNode = t => {
    return t.parentNode;
  };

  handleSearchChange = e => {
    e.preventDefault();
    this.onSearch(e.target.value);
  };

  onSearch(query) {
    this.setState({ query }, this.fetchPatientList);
  }

  handleCardSelect = data => {
    const { id } = data;
    const { handleCheck } = this.props;
    handleCheck(true, id);
  };

  handleCardDeSelect = id => {
    const { handleCheck } = this.props;
    handleCheck(false, id);
  };

  handleOnProgramSelect = e => {
    const { deselectAll } = this.props;
    deselectAll();
    console.log("e :", e);
    this.setState({ program: e }, this.fetchPatientList);
  };

  handleSelectAll = () => {
    const { programs = {}, selectAll } = this.props;
    const { program } = this.state;
    const { patients = [] } = programs[program] || {};
    console.log("programs[program] :", programs[program]);
    selectAll(patients);
  };

  fetchPatientList = () => {
    const { program, query } = this.state;
    const { fetchPatient } = this.props;
    fetchPatient(program, query);
  };

  getProgramsOption = () => {
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

  getPatientCards = () => {
    const { program } = this.state;
    const { handleCardSelect, handleCardDeSelect } = this;
    const {
      selectedPatients,
      programs,
      users = {},
      hospitals = {},
      article = {},
      currentUser
    } = this.props;
    const { patients = [] } = programs[program] || {};
    const { participants } = article;
    const participantsList = Object.keys(participants);
    const patientCards = [];
    patients.forEach(patient => {
      const patientData = users[patient] || {};
      const formatPatientCard = getPatientCardData({
        users,
        hospitals,
        currentUser,
        patient: patientData
      });
      const { basicInfo: { _id } = {}, status } = patientData;
      let checkbox = false;
      let disabled = false;
      if (selectedPatients.length > 0 && selectedPatients.includes(_id)) {
        checkbox = true;
      }

      if (participantsList.length > 0 && participantsList.includes(_id)) {
        checkbox = true;
        disabled = true;
      }

      if (_id && status === USER_STATUS.ENROLLED) {
        patientCards.push(
          <PatientCard
            key={_id}
            data={formatPatientCard}
            onPatientCardSelect={handleCardSelect}
            onPatientCardDeselect={handleCardDeSelect}
            className={"full-width i"}
            selectedPatient={selectedPatients}
            handleOnClick={false}
            checkbox={checkbox}
            disabled={disabled}
          />
        );
      }
    });
    return patientCards;
  };

  render() {
    const {
      selectedPatients = [],
      deselectAll,
      programs = {},
      users = {},
      article: { participants = {} } = {}
    } = this.props;
    const {
      getProgramsOption,
      getPatientCards,
      handleOnProgramSelect,
      handleSearchChange,
      handleSelectAll
    } = this;
    const { program } = this.state;
    const { patients = [] } = programs[program] || {};
    const alreadyShare = Object.keys(participants);

    const totalPatients = patients.filter(id => {
      if (alreadyShare.length > 0 && alreadyShare.includes(id)) {
        return false;
      }
      const { status } = users[id] || {};
      if (status === USER_STATUS.ENROLLED) {
        return true;
      } else return false;
    });
    const selected = selectedPatients.length;
    const total = totalPatients.length;

    return (
      <Fragment>
        <div className="full-width mt8 mb8">
          <div className="relative">
            <Select
              className="full-width"
              placeholder="Select program"
              suffixIcon={
                <img
                  alt=""
                  src={DownArrow}
                  className="arrow-img-program-select"
                />
              }
              onChange={handleOnProgramSelect}
              getPopupContainer={this.getParentNode}
            >
              {getProgramsOption()}
            </Select>
          </div>
        </div>
        <div className="mt8 mb8  full-width">
          <div className="mt16 mb16 flex justify-content-space-between align-items-center">
            {total > 0 && (
              <div className="flex justify-content-start align-items-center medium fontsize16 dark">{`${selected} of ${total} patients selected`}</div>
            )}
            <div className="flex justify-content-end align-items-center">
              {selected > 0 && (
                <div className="dark clickable ml8 mr8" onClick={deselectAll}>
                  Deselect all
                </div>
              )}
              {selected !== total && (
                <div className="dark clickable" onClick={handleSelectAll}>
                  Select all
                </div>
              )}
            </div>
          </div>
          <Input
            className=""
            placeholder="Search patients"
            onChange={handleSearchChange}
            prefix={<img alt="" src={search} className="search-icons" />}
          />
          <Row gutter={16} className="w100 pt16">
            {getPatientCards()}
          </Row>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(ShareToPatients);
