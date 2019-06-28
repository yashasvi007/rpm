import React, { Component, Fragment } from "react";
import { Select, Button } from "antd";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import isEmpty from "lodash-es/isEmpty";
import messages from "./message";
import AppHeader from "../../Containers/Header";
import SurveyDetailHeader from "./createSurveyHeader";
import PatientPane from "../SurveyTabs/patientPane";
import moment from "moment";

const Option = Select.Option;

class CreateSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPatient: [],
      selectedProgram: "",
      filterBasedOn: "All",
      sortBasedOn: "name",
      uncheckAll: false,
      startDate: moment(),
      endDate: "",
      templateId: "",
      is_error: false,
      query: ""
    };
  }

  updateBrowserhistory = () => {
    const { templateId } = this.state;
    const {
      history: { location, replace }
    } = this.props;

    replace(location.pathname, {
      templateId
    });
  };

  componentDidMount() {
    const {
      fetchProgramsData,
      fetchQuestions,
      fetchSurveyTemplates,
      getValidProgramForSurvey
    } = this.props;
    fetchSurveyTemplates();
    const templateId = this.props.match.params.templateId;
    if (!isEmpty(templateId)) {
      this.setState({ templateId: templateId }, this.updateBrowserhistory);
      fetchQuestions(templateId);
      fetchProgramsData().then(status => {
        if (status) {
          getValidProgramForSurvey(templateId);
        }
      });
    }
  }

  showSendSurveyBarToggle = value => {
    if (!value) {
      this.setState(this.updateBrowserhistory);
    }
    this.setState(
      {
        uncheckAll: !value
      },
      this.updateBrowserhistory
    );
  };

  handleOnCheck = data => {
    const { selectedPatient } = this.state;
    if (selectedPatient.includes(data)) {
      const index = selectedPatient.indexOf(data);
      if (index > -1) {
        this.setState((prevState, props) => {
          const { selectedPatient: prevSelectedPatient } = prevState;
          prevSelectedPatient.splice(index, 1);
          if (prevSelectedPatient.length > 0) {
            return { selectedPatient: prevSelectedPatient, uncheckAll: true };
          }
          return { selectedPatient: prevSelectedPatient };
        });
      }
    } else {
      this.setState((prevState, props) => {
        const { selectedPatient } = prevState;
        let prevSelectedPatient = selectedPatient;
        prevSelectedPatient.push(data);
        return { selectedPatient: prevSelectedPatient, uncheckAll: false };
      });
    }
  };

  handleOnSelect = e => {
    this.setState({ selectedProgram: e });
    this.setState({ selectedPatient: [] }, this.fetchPatientList);
  };

  handleSelectChange = e => {
    this.setState(
      (prevState, props) => ({
        filterBasedOn: e,
        selectedPatient: []
      }),
      this.fetchPatientList
    );
  };

  handleSortByChange = e => {
    this.setState(
      (prevState, props) => ({
        sortBasedOn: e
      }),
      this.fetchPatientList
    );
  };

  handleSearch = query => {
    this.setState({ query, selectedPatient: [] }, this.fetchPatientList);
  };

  fetchPatientList = () => {
    const { filterBasedOn, sortBasedOn, selectedProgram, query } = this.state;
    const { fetchProgramPatient } = this.props;
    fetchProgramPatient(selectedProgram, filterBasedOn, sortBasedOn, query);
  };

  formatPaticipants = async () => {
    const { selectedPatient } = this.state;

    const allParticipants = selectedPatient.map(patient => {
      return {
        participantId: patient,
        participantCategory: "patient",
        status: "INPROGRESS",
        surveySentDate: moment()
      };
    });
    return allParticipants;
  };

  handleOnSentSurvey = async () => {
    const { startDate, endDate, selectedProgram, templateId } = this.state;
    const { createSurveys } = this.props;
    let data = {};
    data.startDate = startDate;
    data.endDate = endDate;
    data.template = templateId;
    data.program = selectedProgram;
    const allParticipants = await this.formatPaticipants();
    data.participants = allParticipants;
    createSurveys(data).then(status => {
      if (status === true) {
        this.props.history.replace("/surveys/Inprogress");
      } else {
        this.setState({ is_error: true });
      }
    });
  };

  handleGoBack = e => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  handleDateChange = dates => {
    this.setState({ endDate: dates });
  };

  getProgramsOption = () => {
    const { programs_data } = this.props;
    const programIds = programs_data ? Object.keys(programs_data) : [];
    const options = [];
    programIds.forEach(programId => {
      const { name } = programs_data[programId];
      options.push(<Option key={programId}>{name}</Option>);
    });
    return options;
  };

  handleUnselectAll = () => {
    this.setState({ selectedPatient: [], uncheckAll: true });
  };

  handleOnPreviewClick = () => {
    const { templateId } = this.props.match.params;
    this.props.history.push(`/survey/${templateId}/questionnaire`);
  };

  render() {
    const {
      handleOnCheck,
      handleOnSelect,
      handleGoBack,
      handleSelectChange,
      handleSortByChange,
      showSendSurveyBarToggle,
      handleDateChange,
      handleOnSentSurvey,
      handleUnselectAll,
      handleSearch
    } = this;
    let surveytemplateId = "";
    const {
      selectedProgram,
      selectedPatient,
      uncheckAll,
      templateId,
      startDate,
      endDate,
      is_error
    } = this.state;
    const {
      intl: { formatMessage }
    } = this.props;
    if (templateId !== "") {
      surveytemplateId = templateId;
    }
    return (
      <Fragment>
        <AppHeader setTabDashboard={this.props.setTabDashboard} />
        <div className="createSurvey">
          <SurveyDetailHeader
            handleGoBack={handleGoBack}
            selectedPatient={selectedPatient}
            showSendSurveyBarToggle={handleUnselectAll}
            handleOnSentSurvey={handleOnSentSurvey}
            is_error={is_error}
            endDate={endDate}
            surveytemplateId={surveytemplateId}
            {...this.props}
          />
          <div className="previewQuestionnaire">
            <Button onClick={this.handleOnPreviewClick}>
              <span className="dark fontsize14 medium">
                {formatMessage(messages.previewQuestionnaire)}
              </span>
            </Button>
          </div>
          <div span={6} className="patient-pane w100">
            <PatientPane
              handleOnCheck={handleOnCheck}
              handleOnSelect={handleOnSelect}
              {...this.props}
              selectedProgram={selectedProgram}
              handleSelectChange={handleSelectChange}
              handleSortByChange={handleSortByChange}
              selectedPatient={selectedPatient}
              uncheckAll={uncheckAll}
              showSendSurveyBarToggle={showSendSurveyBarToggle}
              handleDateChange={handleDateChange}
              startDate={startDate}
              endDate={endDate}
              handleSearch={handleSearch}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(withRouter(CreateSurvey));
