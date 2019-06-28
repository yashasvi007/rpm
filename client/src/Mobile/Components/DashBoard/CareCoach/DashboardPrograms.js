import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Select, Tabs, Row, Col } from "antd";
import moment from "moment";
import { ALL_SORT_BY } from "../../../../constant";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import ProgramCard from "../../Cards/programCard";
import messages from "../message";
import DownArrow from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";

import "../styles/program_style.less";

const { Option } = Select;
const { TabPane } = Tabs;
const Active = "Active";
class DashBoardPrograms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFilterType: ALL_SORT_BY.NAME,
      active_programs: [],
      expired_programs: []
    };
    this.getProgramResult = this.getProgramResult.bind(this);
    this.setProgramExpiredActiveState = this.setProgramExpiredActiveState.bind(
      this
    );
  }
  componentDidMount() {
    const { program_data, getMyPrograms } = this.props;
    getMyPrograms();
    if (!isEmpty(program_data)) {
      this.setProgramExpiredActiveState();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { program_data, getMyPrograms } = this.props;
    const { program_data: prevProgramData } = prevProps;
    if (!isEqual(prevProgramData, program_data)) {
      if (!isEmpty(program_data)) {
        this.setProgramExpiredActiveState();
      } else {
        getMyPrograms();
      }
    }
  }

  sortResults(data) {
    let currentFilterType = this.state.currentFilterType;
    switch (currentFilterType) {
      case ALL_SORT_BY.RECENTLY_UPDATED:
        data.sort((a, b) => {
          return moment(a.updatedAt).diff(b.updatedAt);
        });
        return data;
      case ALL_SORT_BY.NAME:
        data.sort((a, b) => {
          let nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        return data;
      case ALL_SORT_BY.DATE_ADDED:
        data.sort((a, b) => {
          return moment(a.activeFrom).diff(b.activeFrom);
        });
        return data;
      default:
        return data;
    }
  }

  setProgramExpiredActiveState() {
    const { program_data } = this.props;
    let active_programs_list = [];
    let expired_programs_list = [];
    Object.keys(program_data).forEach((key, index) => {
      let value = program_data[key];
      let isValid = moment(value.expiresOn).isAfter(new Date())
        ? "Active"
        : "Expired";
      if (isValid === Active) active_programs_list.push(value);
      else {
        expired_programs_list.push(value);
      }
    });
    active_programs_list = this.sortResults(active_programs_list);
    expired_programs_list = this.sortResults(expired_programs_list);
    this.setState({
      active_programs: active_programs_list,
      expired_programs: expired_programs_list
    });
  }

  getProgramResult() {
    const {
      intl: { formatMessage }
    } = this.props;
    let active_count = 0;
    let expired_count = 0;
    let active_program_result_cards = this.state.active_programs.map(
      (value, key) => {
        const { patients = [] } = value;
        const totalPatients = patients.length;
        let cardData = {};
        active_count += 1;
        cardData.Valid = "Active";
        cardData.title = value.name;
        cardData.city = value.targetLocation.city;
        cardData.country = value.targetLocation.country;
        cardData.patients = totalPatients;
        cardData.products = value.products.length;
        cardData.createdAt = value.createdAt;
        cardData.expireOn = value.expiresOn;
        return (
          <ProgramCard
            data={cardData}
            key={`act-${key}`}
            handleOnClick={() => {
              this.props.history.push(`/program/${value._id}`);
            }}
          />
        );
      }
    );
    let expired_program_result_cards = this.state.expired_programs.map(
      (value, key) => {
        let cardData = {};
        expired_count += 1;
        cardData.Valid = "Expired";
        cardData.title = value.name;
        cardData.city = value.targetLocation.city;
        cardData.country = value.targetLocation.country;
        cardData.patients = "37";
        cardData.products = value.products.length;
        cardData.createdAt = value.createdAt;
        cardData.expireOn = value.expiresOn;
        return (
          <ProgramCard
            data={cardData}
            key={`ex-${key}`}
            handleOnClick={() => {
              this.props.history.push(`/program/${value._id}`);
            }}
          />
        );
      }
    );

    return (
      <Tabs
        className={"tab-title fontsize14 w100"}
        defaultActiveKey="1"
        onChange={this.callback}
        tabBarStyle={{ color: "#7f888d", fontFamily: "AvenirNext-Medium" }}
      >
        <TabPane
          tab={`${formatMessage(
            messages.careCoachActiveProgram
          )} (${active_count})`}
          key="1"
          className={"tabscontent flex"}
        >
          <Row className="full-width" gutter={8}>
            {active_program_result_cards}
          </Row>
        </TabPane>
        <TabPane
          tab={`${formatMessage(
            messages.careCoachExpiredProgram
          )} (${expired_count})`}
          key="2"
          className={"tabscontent flex"}
        >
          <Row className="full-width" gutter={8}>
            {expired_program_result_cards}
          </Row>
        </TabPane>
      </Tabs>
    );
  }
  render() {
    const {
      intl: { formatMessage }
    } = this.props;

    return (
      <Fragment>
        <div className="care-coach-program">
          <div className="program-heading-container">
            <div className="heading">
              {formatMessage(messages.careCoachProgramHeading)}
            </div>
            <Select
              optionFilterProp="children"
              className="select"
              //style={{ width: "169px", height: "24px" }}
              onChange={value => {
                this.setState({ currentFilterType: value }, () => {
                  this.setProgramExpiredActiveState();
                });
              }}
              value={`Sort by: ${this.state.currentFilterType}`}
              suffixIcon={<img alt="" src={DownArrow} className="arrowImg" />}
            >
              <Option value={ALL_SORT_BY.NAME}>
                {formatMessage(messages.careCoachExpiredSortProgramByName)}
              </Option>
              <Option value={ALL_SORT_BY.DATE_ADDED}>
                {formatMessage(messages.careCoachExpiredSortProgramByDate)}
              </Option>
            </Select>
          </div>
          <div className="program-body-container">
            {this.getProgramResult()}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(DashBoardPrograms);
