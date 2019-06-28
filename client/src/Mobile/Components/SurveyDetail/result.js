import React, { Component, Fragment } from "react";
import { Row, Col, Input, Select, Tabs } from "antd";
import moment from "moment";
import { injectIntl } from "react-intl";
import isEmpty from "lodash-es/isEmpty";
import DownArrow from "../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import search from "../../../Assets/images/ico-search.svg";
import PatientCompletedSurvey from "./patientCompleted";
import PatientInprogressSurvey from "./patientInprogress";
import { ALL_SORT_BY } from "../../../constant";
import messages from "./message";
import "./style.less";

const { Option } = Select;
const { TabPane } = Tabs;

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completed: [],
      inprogress: [],
      query: "",
      patientStatus: "Completed",
      sortBy: "Name"
    };
  }
  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {
    if (this.props.surveys !== prevProps.surveys) {
      const surveyId = this.props.match.params.surveyId;
      const { surveys, patientStatus } = this.props;
      const { participantsId = {} } = surveys;
      const completedParticipant = participantsId[surveyId]
        ? participantsId[surveyId]["completed"]
        : [];
      const inprogressParticipant = participantsId[surveyId]
        ? participantsId[surveyId]["inprogress"]
        : [];
      this.setState(
        {
          completed: completedParticipant,
          inprogress: inprogressParticipant,
          patientStatus: patientStatus
        },
        () => {
          this.sortParticipantsBy("Name");
        }
      );
    }
  }

  handleOnClick = (surveyId, participantsId) => {
    this.props.history.replace(
      `/survey/${surveyId}/participant/${participantsId}/response`
    );
  };
  handleSearchChange = e => {
    this.setState({ query: e.target.value });
    this.getCompletedParticipants(e.target.value);
    this.getCompletedParticipants(e.target.value);
    this.getInprogressParticipants(e.target.value);
  };

  getCompletedParticipants(query) {
    //
    const surveyId = this.props.match.params.surveyId;
    const { surveys, users } = this.props;
    const { participantsId = {} } = surveys;

    const completedParticipant = participantsId[surveyId]
      ? participantsId[surveyId]["completed"]
      : [];
    let surveyData = [];
    surveyData = completedParticipant.filter(id => {
      const { basicInfo: { name = "" } = {} } = users[id];
      const regex = new RegExp("(" + query + ")", "gi");
      // console.log("---name---", regex,regex.test(name))
      if (regex.test(name)) {
        return true;
      }
      return false;
    });
    this.setState({ completed: surveyData });
  }

  getInprogressParticipants(query) {
    //
    const surveyId = this.props.match.params.surveyId;
    const { surveys, users } = this.props;
    const { participantsId = {} } = surveys;

    const inprogressParticipant = participantsId[surveyId]
      ? participantsId[surveyId]["inprogress"]
      : [];
    let surveyData = [];
    surveyData = inprogressParticipant.filter(id => {
      const { basicInfo: { name = "" } = {} } = users[id];
      const regex = new RegExp("(" + query + ")", "gi");
      // console.log("---name---", regex,regex.test(name))

      if (regex.test(name)) {
        return true;
      }
      return false;
    });
    this.setState({ inprogress: surveyData });
  }

  handleSortByChange = key => {
    this.setState({ sortBy: key }, () => {
      this.sortParticipantsBy(key);
    });
  };

  sortByDate = (surveyParticipantsId = []) => {
    const surveyId = this.props.match.params.surveyId;
    const { surveys } = this.props;
    const { participants } = surveys[surveyId] || {};
    return surveyParticipantsId.sort((a, b) => {
      const Aindex = participants.findIndex(particpant => {
        const { participantId } = particpant;
        if (participantId === a) {
          return true;
        }
        return false;
      });
      const Bindex = participants.findIndex(particpant => {
        const { participantId } = particpant;
        if (participantId === b) {
          return true;
        }
        return false;
      });
      const Aparticipnants = participants[Aindex] || {};
      const Bparticipants = participants[Bindex] || {};

      const { surveySentDate: AsurveySentDate } = Aparticipnants;
      const { surveySentDate: BsurveySentDate } = Bparticipants;

      if (AsurveySentDate < BsurveySentDate) {
        return 1;
      }
      if (AsurveySentDate > BsurveySentDate) {
        return -1;
      }
      return 0;
    });
  };

  sortByName = (surveyParticipantsId = []) => {
    const { users = {} } = this.props;
    return surveyParticipantsId.sort((a, b) => {
      const { basicInfo: { name: Aname = "" } = {} } = users[a] || {};
      const { basicInfo: { name: Bname = "" } = {} } = users[b] || {};
      if (Aname.toLowerCase() < Bname.toLowerCase()) {
        return -1;
      }
      if (Aname.toLowerCase() > Bname.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  };

  sortParticipantsBy = sortBy => {
    const {
      inprogress: inprogressParticipant = [],
      completed: completedParticipant = []
    } = this.state;
    switch (sortBy) {
      case ALL_SORT_BY.NAME: {
        this.setState({
          inprogress: this.sortByName(inprogressParticipant),
          completed: this.sortByName(completedParticipant)
        });
        break;
      }
      case "Survey Sent Date": {
        this.setState({
          inprogress: this.sortByDate(inprogressParticipant),
          completed: this.sortByDate(completedParticipant)
        });
        break;
      }
      default:
        break;
    }
  };

  render() {
    const {
      changeStatus,
      surveys,
      intl: { formatMessage },
      programs_data = {},
      selectedProgram
    } = this.props;
    const { handleOnClick, handleSearchChange, handleSortByChange } = this;
    const { completed = [], inprogress = [] } = this.state;
    const surveyId = this.props.match.params.surveyId;
    const selectedSurvey = surveys[surveyId] || {};
    const { updatedAt } = selectedSurvey;
    const lastSentDate = moment(updatedAt).format("DD/MM/YYYY");
    const lastSentTime = moment(updatedAt).format("LT");

    const completedParticipant = completed;
    const inprogressParticipant = inprogress;

    // const completedLength = completedParticipant
    //   ? completedParticipant.length
    //   : 0;
    const completedLength = completed.length;
    const inprogressLength = inprogress.length;
    const totalParticipants = completedLength + inprogressLength;
    let programName = "";
    if (!isEmpty(programs_data)) {
      const { name } = programs_data[selectedProgram] || {};
      programName = name;
    }

    return (
      <Fragment>
        <div className="result-completed p16 w100">
          <Row>
            <div className="survey-header w100">
              <div className=" mt24 fontsize18 dark bold">
                {`Results for ${totalParticipants} patients of “${programName} at Dubai” program`}
              </div>
              <div className="fontsize12 label-color mt8 mb16">
                Last sent on {lastSentDate}, {lastSentTime}
              </div>
              <Row gutter={{ sm: 12, md: 24 }}>
                <Col sm={12} md={6}>
                  <Input
                    className="survey-input mb12"
                    placeholder="Search participants"
                    prefix={
                      <img alt="" src={search} className="search-icons mr16" />
                    }
                    onChange={handleSearchChange}
                  />
                </Col>
                <Col sm={12} md={6}>
                  <div className="sortBy flex align-items-center">
                    <div className="fontsize14 bold dark pl8 ">
                      {formatMessage(messages.sortBy)}
                    </div>
                    <Select
                      optionFilterProp="children"
                      suffixIcon={
                        <img alt="" src={DownArrow} className="arrow-img" />
                      }
                      defaultValue={formatMessage(messages.name)}
                      className="flex align-items-center flex-grow-1"
                      onChange={handleSortByChange}
                    >
                      <Option key={formatMessage(messages.surveySentDate)}>
                        {formatMessage(messages.surveySentDate)}
                      </Option>
                      <Option key={formatMessage(messages.name)}>
                        {formatMessage(messages.name)}
                      </Option>
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>
          </Row>
          <Row className="result-content">
            <Tabs
              className={"tabstitle fontsize14 w100"}
              // defaultActiveKey="1"
              tabBarStyle={{
                color: "#7f888d",
                fontFamily: "AvenirNext-Medium"
              }}
              onChange={changeStatus}
            >
              <TabPane
                tab={`Completed(${completedLength})`}
                key="1"
                className={"tabscontent flex "}
              >
                <PatientCompletedSurvey
                  {...this.props}
                  completedParticipant={completedParticipant}
                  handleOnClick={handleOnClick}
                  className="flex align-items-center"
                />
              </TabPane>
              <TabPane
                tab={`Inprogress(${inprogressLength})`}
                key="2"
                className={"tabscontent flex"}
              >
                <PatientInprogressSurvey
                  {...this.props}
                  inprogressParticipant={inprogressParticipant}
                  className="flex align-items-center"
                />
              </TabPane>
            </Tabs>
          </Row>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(Result);
