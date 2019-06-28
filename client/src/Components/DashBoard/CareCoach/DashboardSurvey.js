import React, { Component, Fragment } from "react";
import { Row, Input, Select, Tabs } from "antd";
import { injectIntl } from "react-intl";
import isEmpty from "lodash-es/isEmpty";
import search from "../../../Assets/images/ico-search.svg";
import SurveyCard from "../../../Components/Surveys/index";
import InprogressSurveys from "../../Surveys/inprogressSurveys";
import CompletedSurveys from "../../Surveys/completedSurvey";
import DownArrow from "../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import messages from "../message";
import { SURVEYS, ALL_SORT_BY } from "../../../constant";
const { Option } = Select;
const { TabPane } = Tabs;

class Survey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      surveytemplatesId: [],
      currentTab: "AllTemplates",
      inprogressSurvey: [],
      completeSurvey: [],
      sortBy: ""
    };
  }
  componentDidMount() {
    const { fetchProgramsData, fetchCareCoachSurveys } = this.props;
    fetchCareCoachSurveys();
    // fetchSurveyTemplates();
    fetchProgramsData();
    const { show } = this.props.match.params;
    if (show && !isEmpty(show)) {
      this.setState({ currentTab: show });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.surveytemplates !== prevProps.surveytemplates) {
      const {
        surveytemplates = [],
        inprogressSurvey,
        completeSurvey
      } = this.props;
      const surveytemplatesId = Object.keys(surveytemplates);
      this.setState({
        surveytemplatesId: surveytemplatesId,
        completeSurvey: completeSurvey,
        inprogressSurvey: inprogressSurvey
      });
    }
    if (this.props.match.params !== prevProps.match.params) {
      const { show } = this.props.match.params;
      if (show && !isEmpty(show)) {
        this.setState({ currentTab: show });
      } else {
        this.setState({ currentTab: "AllTemplates" });
      }
    }
  }

  handleOnClick = id => {
    this.props.history.replace(`/create-survey/template/${id}`);
  };

  handleOnClickInprogress = id => {
    this.props.history.push(`/survey/${id}`);
  };

  handleOnTabChange = key => {
    const { fetchSurveys } = this.props;
    if (key === SURVEYS.INPROGRESS) {
      this.setState({ currentTab: SURVEYS.INPROGRESS });
      fetchSurveys("inprogress");
      this.props.history.replace("/surveys/Inprogress");
    } else if (key === SURVEYS.COMPLETED) {
      this.setState({ currentTab: SURVEYS.COMPLETED });
      fetchSurveys("completed");
      this.props.history.replace("/surveys/Completed");
    } else {
      this.setState({ currentTab: SURVEYS.ALL_TEMPLATES });
      this.props.history.replace("/surveys");
    }
  };

  handleSortBy = key => {
    // console.log('key', key)
    const { currentTab } = this.state;

    if (currentTab === SURVEYS.ALL_TEMPLATES) {
      this.sortTemplateBasedOn(key);
    } else {
      this.sortSurveyBasedOn(key);
    }
  };

  handleSearchChange = e => {
    this.setState({ query: e.target.value });

    this.getSurveyTemplates(e.target.value);
    this.getInprogressSurvey(e.target.value);
    this.getCompleteSurvey(e.target.value);
  };

  getSurveyTemplates(query) {
    //
    const { surveytemplates } = this.props;
    const surveytemplatesIds = Object.keys(surveytemplates);
    let surveyData = [];
    surveyData = surveytemplatesIds.filter(id => {
      const { title } = surveytemplates[id];
      const regex = new RegExp("(" + query + ")", "gi");
      // console.log("---name---", regex,regex.test(name))

      if (regex.test(title)) {
        return true;
      }
      return false;
    });

    this.setState({ surveytemplatesId: surveyData });
  }

  getCompleteSurvey(query) {
    //
    const { surveys_data, completeSurvey } = this.props;
    let surveyData = [];

    surveyData = completeSurvey.filter(survey => {
      const { _id: id } = survey;
      const { template: { title = "" } = {} } = surveys_data[id] || {};
      const regex = new RegExp("(" + query + ")", "gi");
      // console.log("---name---", regex,regex.test(name))
      if (regex.test(title)) {
        return true;
      }
      return false;
    });

    this.setState({ completeSurvey: surveyData });
  }

  getInprogressSurvey(query) {
    const { surveys_data, inprogressSurvey } = this.props;
    let surveyData = [];
    surveyData = inprogressSurvey.filter(survey => {
      const { _id: id } = survey;
      const { template: { title = "" } = {} } = surveys_data[id] || {};
      const regex = new RegExp("(" + query + ")", "gi");
      // console.log("---name---", regex,regex.test(name))

      if (regex.test(title)) {
        return true;
      }
      return false;
    });

    this.setState({ inprogressSurvey: surveyData });
  }

  sortTemplateBasedOn(sortBy) {
    const { surveytemplates } = this.props;
    const { surveytemplatesId } = this.state;
    switch (sortBy) {
      case ALL_SORT_BY.DATE_SENT: {
        let surveyDataSorbtedByDateSent = [];
        surveyDataSorbtedByDateSent = surveytemplatesId.sort((a, b) => {
          const { createdAt: ACreatedAt } = surveytemplates[a];
          const { createdAt: BCreatedAt } = surveytemplates[b];
          if (ACreatedAt < BCreatedAt) {
            return 1;
          }
          if (ACreatedAt > BCreatedAt) {
            return -1;
          }
          return 0;
        });
        this.setState({ surveytemplatesId: surveyDataSorbtedByDateSent });

        break;
      }

      case ALL_SORT_BY.NAME: {
        let surveyDataSorbtedByName = [];
        surveyDataSorbtedByName = surveytemplatesId.sort((a, b) => {
          const { title: Atitle } = surveytemplates[a];
          const { title: Btitle } = surveytemplates[b];
          if (Atitle < Btitle) {
            return -1;
          }
          if (Atitle > Btitle) {
            return 1;
          }
          return 0;
        });
        this.setState({ surveytemplatesId: surveyDataSorbtedByName });

        break;
      }
      default:
        break;
    }
  }

  sortSurveyByDate = (surveys = []) => {
    const { surveys_data = {} } = this.props;

    return surveys.sort((a, b) => {
      const { _id: Aid } = a;
      const { updatedAt: AupdatedAt } = surveys_data[Aid] || {};
      const { _id: Bid } = b;
      const { updatedAt: BupdatedAt } = surveys_data[Bid] || {};
      if (AupdatedAt < BupdatedAt) {
        return 1;
      }
      if (AupdatedAt > BupdatedAt) {
        return -1;
      }
      return 0;
    });
  };

  sortSurveyByName = (surveys = []) => {
    const { surveys_data = {} } = this.props;
    return surveys.sort((a, b) => {
      const { _id: Aid } = a;
      const { template: { title: Atitle = "" } = {} } = surveys_data[Aid] || {};
      const { _id: Bid } = b;
      const { template: { title: Btitle = "" } = {} } = surveys_data[Bid] || {};
      if (Atitle < Btitle) {
        return -1;
      }
      if (Atitle > Btitle) {
        return 1;
      }
      return 0;
    });
  };

  sortSurveyBasedOn(sortBy) {
    const { completeSurvey = [], inprogressSurvey = [] } = this.state;
    switch (sortBy) {
      case ALL_SORT_BY.DATE_SENT: {
        this.setState({
          completeSurvey: this.sortSurveyByDate(completeSurvey),
          inprogressSurvey: this.sortSurveyByDate(inprogressSurvey)
        });
        break;
      }
      case ALL_SORT_BY.NAME: {
        this.setState({
          completeSurvey: this.sortSurveyByName(completeSurvey),
          inprogressSurvey: this.sortSurveyByName(inprogressSurvey)
        });
        break;
      }
      default:
        break;
    }
  }

  render() {
    const {
      surveytemplates = {},
      intl: { formatMessage }
    } = this.props;
    const {
      surveytemplatesId,
      inprogressSurvey,
      completeSurvey,
      currentTab
    } = this.state;
    const { handleOnClick, handleOnClickInprogress, handleSearchChange } = this;
    return (
      <Fragment>
        <div className="survey">
          <Row>
            <div className="flex align-items-center justify-content-space-between survey-header">
              <div className="fontsize22 dark bold">
                {formatMessage(messages.survey)}
              </div>
              <div className="flex align-items">
                <Input
                  className="survey-input"
                  placeholder="Search Survey"
                  prefix={
                    <img alt="" src={search} className="search-icons mr16" />
                  }
                  onChange={handleSearchChange}
                />
                <div className="sortBy flex align-items-center mr8">
                  <div className="fontsize14 bold dark pl8 ">
                    {formatMessage(messages.sortBy)}
                  </div>
                  <Select
                    optionFilterProp="children"
                    suffixIcon={
                      <img alt="" src={DownArrow} className="arrow-img" />
                    }
                    defaultValue={formatMessage(messages.dateSent)}
                    className="flex align-items-center"
                    onChange={this.handleSortBy}
                  >
                    <Option key={formatMessage(messages.dateSent)}>
                      {formatMessage(messages.dateSent)}
                    </Option>
                    <Option key={formatMessage(messages.name)}>
                      {formatMessage(messages.name)}
                    </Option>
                  </Select>
                </div>
              </div>
            </div>
          </Row>
          <Row className="mt24">
            <Tabs
              className={"tabstitle fontsize14 w100"}
              defaultActiveKey="AllTemplates"
              tabBarStyle={{
                color: "#7f888d",
                fontFamily: "AvenirNext-Medium"
              }}
              activeKey={currentTab}
              onChange={this.handleOnTabChange}
            >
              <TabPane
                tab={`All Templates (${surveytemplatesId.length})`}
                key="AllTemplates"
                className={"tabscontent flex"}
              >
                <SurveyCard
                  surveytemplates={surveytemplates}
                  surveytemplatesId={surveytemplatesId}
                  handleOnClick={handleOnClick}
                />
              </TabPane>
              <TabPane
                tab={`Inprogress (${inprogressSurvey.length})`}
                key="Inprogress"
                className={"tabscontent flex"}
              >
                <InprogressSurveys
                  {...this.props}
                  handleOnClick={handleOnClickInprogress}
                  inprogressSurveyIds={inprogressSurvey}
                />
              </TabPane>
              <TabPane
                tab={`Completed (${completeSurvey.length})`}
                key="Completed"
                className={"tabscontent flex"}
              >
                <CompletedSurveys
                  {...this.props}
                  handleOnClick={handleOnClickInprogress}
                  completeSurveyIds={completeSurvey}
                />
              </TabPane>
            </Tabs>
          </Row>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(Survey);
