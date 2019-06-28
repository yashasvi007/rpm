import React, { Component, Fragment } from "react";
import { Select } from "antd";
import AppHeader from "../../Containers/Header";
import PatientSurveyResponse from "../PatientSurvey";
import SurveyDetailHeader from "./surveyDetailHeader";
import SendToMorePatient from "./sendToMorePatient";
import { SURVEY_STATUS } from "../../constant";
import Result from "./result";
import "./style.less";
import moment from "moment";

const Option = Select.Option;

class ParticularSurveyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentIs: "Result",
      selectedPatient: [],
      selectedProgram: "",
      filterBasedOn: "All",
      sortBasedOn: "name",
      uncheckAll: false,
      startDate: "",
      endDate: "",
      templateId: "",
      surveyId: "",
      patientStatus: "Completed",
      query: ""
    };
  }

  componentDidMount() {
    const { fetchSurveys } = this.props;
    const { patientStatus } = this.state;
    fetchSurveys(patientStatus);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.surveys !== prevProps.surveys) {
      const surveyId = this.props.match.params.surveyId;
      const {
        surveys,
        fetchQuestions,
        fetchProgramsData,
        fetchProgramPatient
      } = this.props;
      const { template = {}, program, startDate = "", endDate = "" } = surveys[
        surveyId
      ]
        ? surveys[surveyId]
        : {};
      const { filterBasedOn, sortBasedOn, query } = this.state;
      const { templateId } = template;
      this.setState({
        templateId: templateId,
        selectedProgram: program,
        surveyId: surveyId,
        startDate: startDate,
        endDate: endDate
      });
      fetchQuestions(templateId);
      fetchProgramsData();
      fetchProgramPatient(program, filterBasedOn, sortBasedOn, query);
    }
  }

  changeContent = value => {
    this.setState({
      contentIs: value
    });
  };

  changeStatus = value => {
    if (value === "1") {
      this.setState({
        patientStatus: "Completed"
      });
    } else if (value === "2") {
      this.setState({
        patientStatus: "Inprogress"
      });
    }
  };

  showSendSurveyBarToggle = value => {
    if (!value) {
      this.setState({
        patientSelectedForDischarge: {}
      });
    }
    this.setState({
      showDischarge: value,
      uncheckAll: !value
    });
  };

  handleSearch = query => {
    this.setState({ query, selectedPatient: [] }, this.fetchPatientList);
  };

  handleOnCheck = data => {
    const { selectedPatient } = this.state;
    const { id = "" } = data;
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
        const { selectedPatient: prevSelectedPatient } = prevState;
        prevSelectedPatient.push(id);
        return { selectedPatient: prevSelectedPatient, uncheckAll: false };
      });
    }
  };

  handleOnSelect = e => {
    this.setState({ selectedProgram: e, selectedPatient: [] });
    const { filterBasedOn, sortBasedOn, query } = this.state;
    const { fetchProgramPatient } = this.props;
    fetchProgramPatient(e, filterBasedOn, sortBasedOn, query);
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
    const { endDate, surveyId } = this.state;
    const { updateSurveys } = this.props;
    let data = {};
    data.endDate = endDate;
    const allParticipants = await this.formatPaticipants();
    data.participants = allParticipants;
    updateSurveys(data, surveyId).then(status => {
      if (status === true) {
        console.log("status in update survey", status);
        this.props.history.replace("/surveys/Inprogress");
      } else {
        this.setState({ is_error: true });
      }
    });
  };

  handleSortByChange = e => {
    this.setState({ sortBasedOn: e }, this.fetchPatientList);
  };

  // handleGoBack = e => {
  //   e.preventDefault();
  //   const { history } = this.props;
  //   history.goBack();
  // };

  handleRangeChange = (dates, dateStrings) => {
    const startDate = dates[0];
    const endDate = dates[1];
    let data = {};
    if (startDate) {
      data = { ...data, startDate: moment(startDate) };
    }
    if (endDate) {
      data = { ...data, endDate: moment(endDate) };
    }
    this.setState(data);
  };

  handleUnselectAll = () => {
    this.setState({ selectedPatient: [], uncheckAll: true });
  };

  handleEndSurvey = () => {
    const { surveyId, selectedProgram } = this.state;
    const { openEndSurveyModal } = this.props;
    openEndSurveyModal(surveyId, selectedProgram);
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

  render() {
    const {
      handleOnCheck,
      getProgramsOption,
      handleOnSelect,

      handleSelectChange,
      handleSortByChange,
      showSendSurveyBarToggle,
      handleRangeChange,
      handleOnSentSurvey,
      handleEndSurvey,
      changeContent,
      changeStatus,
      handleSearch
    } = this;
    // eslint-disable-next-line no-unused-vars
    let surveytemplateId = "";

    const { surveys, user_data, match, handleGoBack } = this.props;
    const {
      selectedProgram,
      selectedPatient,
      uncheckAll,
      templateId,
      surveyId,
      startDate,
      endDate,
      contentIs,
      patientStatus
    } = this.state;

    const { status } = surveys[surveyId] ? surveys[surveyId] : {};
    const { basicInfo: { category } = {} } = user_data;
    if (category === "patient") {
      return <PatientSurveyResponse {...this.props} />;
    }

    if (templateId !== "") {
      surveytemplateId = templateId;
    }
    return (
      <Fragment>
        <AppHeader setTabDashboard={this.props.setTabDashboard} />
        <div className="surveyDetail">
          <SurveyDetailHeader
            handleGoBack={handleGoBack}
            selectedPatient={selectedPatient}
            showSendSurveyBarToggle={this.handleUnselectAll}
            handleOnSentSurvey={handleOnSentSurvey}
            handleEndSurvey={handleEndSurvey}
            contentIs={contentIs}
            changeContent={changeContent}
            match={match}
            status={status}
          />

          {contentIs === "Result" ? (
            <Result
              {...this.props}
              changeStatus={changeStatus}
              patientStatus={patientStatus}
              surveyId={surveyId}
              selectedProgram={selectedProgram}
            />
          ) : (
            <div>
              {status !== SURVEY_STATUS.COMPLETED && (
                <SendToMorePatient
                  {...this.props}
                  handleOnCheck={handleOnCheck}
                  getProgramsOption={getProgramsOption}
                  handleOnSelect={handleOnSelect}
                  handleSelectChange={handleSelectChange}
                  handleSortByChange={handleSortByChange}
                  showSendSurveyBarToggle={showSendSurveyBarToggle}
                  handleRangeChange={handleRangeChange}
                  surveys={surveys}
                  selectedPatient={selectedPatient}
                  selectedProgram={selectedProgram}
                  uncheckAll={uncheckAll}
                  surveyId={surveyId}
                  startDate={startDate}
                  endDate={endDate}
                  handleSearch={handleSearch}
                />
              )}
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default ParticularSurveyDetail;
