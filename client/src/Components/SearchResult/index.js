import React, { Component, Fragment } from "react";
import { Tabs, Select } from "antd";
import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";
import { injectIntl } from "react-intl";
import querystring from "querystring";
import AppHeader from "../../Containers/Header";
import Program from "./programs";
import Patient from "./patient";
import Doctor from "./doctor";
import messages from "./message";
import DownArrow from "../../Assets/images/material-icons-black-arrow-drop-down.svg";
import { ALL_SORT_BY, SEARCH_RESULT_TAB, USER_CATEGORY } from "../../constant";
import {
  getProgramData,
  getPatientData,
  getDoctorData,
  sortByName,
  sortByUpdateAt,
  sortByCreatedAt
} from "./getData";

const TabPane = Tabs.TabPane;
const Option = Select.Option;
class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      program: [],
      patient: [],
      doctor: [],
      query: "",
      activeKey: "",
      sortingbasedOn: ""
    };
  }
  componentDidMount() {
    const query = querystring.parse(this.props.location.search);

    this.setState({ activeKey: query["?key"], query: query["?query"] });
    this.getData(query["?query"]);
    if (query["?key"] === SEARCH_RESULT_TAB.Program) {
      this.setState({ sortingbasedOn: "Recently Updated" });
    } else {
      this.setState({ sortingbasedOn: "Name" });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.search !== prevProps.location.search) {
      const query = querystring.parse(this.props.location.search);
      this.setState({ activeKey: query["?key"], query: query["?query"] });
      this.getData(query["?query"]);
    }
  }

  callback = key => {
    const {
      intl: { formatMessage }
    } = this.props;
    this.setState({ activeKey: key });
    if (key === SEARCH_RESULT_TAB.Program) {
      this.setState({
        sortingbasedOn: formatMessage(messages.recentlyUpdated)
      });
    } else {
      this.setState({ sortingbasedOn: formatMessage(messages.name) });
    }
  };

  handleOnClick = (entity, id) => {
    this.props.history.push(`/${entity}/${id}`);
  };

  getData = async query => {
    if (!(query === "")) {
      const data = await doRequest({
        params: { query },
        url: "/search",
        method: REQUEST_TYPE.GET
      });
      // (data.payload.data, '********************************-----------------------------------')
      const { programs, users } = data.payload.data;
      const program = await getProgramData(programs);
      //
      const patient = await getPatientData(users.result);
      const doctor = await getDoctorData(users.result);

      this.setState(prevState => ({
        program: Object.assign(program, prevState.Program),
        patient: Object.assign(patient, prevState.Patient),
        doctor: Object.assign(doctor, prevState.Doctor)
      }));
    }
  };

  onClick = async event => {
    const { activeKey } = this.state;
    this.setState({ sortingbasedOn: `${event}` });

    const sortingbasedOn = event;
    if (sortingbasedOn === ALL_SORT_BY.NAME) {
      switch (activeKey) {
        case SEARCH_RESULT_TAB.Program:
          const program = await sortByName(this.state.program);
          this.setState({
            program: program
          });
          break;
        case SEARCH_RESULT_TAB.Patient:
          const patient = await sortByName(this.state.patient);
          this.setState({
            patient: patient
          });
          break;
        case SEARCH_RESULT_TAB.Doctor:
          const doctor = await sortByName(this.state.doctor);
          this.setState({
            doctor: doctor
          });
          break;
        default:
          break;
      }
    } else if (sortingbasedOn === ALL_SORT_BY.RECENTLY_UPDATED) {
      const program = await sortByUpdateAt(this.state.program);
      this.setState({
        program: program
      });
    } else if (sortingbasedOn === ALL_SORT_BY.DATE_ADDED) {
      const program = await sortByCreatedAt(this.state.program);
      const doctor = await sortByCreatedAt(this.state.doctor);
      const patient = await sortByCreatedAt(this.state.patient);

      this.setState({
        program: program,
        doctor: doctor,
        patient: patient
      });
    }
  };
  render() {
    const { patient, program, doctor } = this.state;
    const { activeKey } = this.state;
    const totalPatientResult = patient.length;
    const totalProgramResult = program.length;
    const totalDoctorResult = doctor.length;
    const totalResult =
      totalDoctorResult + totalPatientResult + totalProgramResult;
    const programSortMenu = ["Recently Updated", "Name", "Date Added"];
    const userSortMenu = ["Name", "Date Added"];

    const query = querystring.parse(this.props.location.search);
    //

    const {
      intl: { formatMessage },
      user_data = {}
    } = this.props;
    const { basicInfo: { category } = {} } = user_data;
    return (
      <Fragment>
        <AppHeader searchbox={true} searchedText={query["?query"]} />
        <div className="searchresultdiv">
          <div className="flex justify-content-space-between align-items-center tabs">
            <div className="searchresult fontsize22">
              {`${totalResult} ${formatMessage(messages.searchResults)}`}
            </div>
            <div className="sorting flex align-items-center ">
              <div className="sortedBy">
                <h6>{formatMessage(messages.sortBy)} </h6>
              </div>
              <Select
                optionFilterProp="children"
                onChange={this.onClick}
                defaultValue={this.state.sortingbasedOn}
                value={this.state.sortingbasedOn}
                suffixIcon={<img alt="" src={DownArrow} className="arrowImg" />}
              >
                {activeKey === `${formatMessage(messages.program)}`
                  ? programSortMenu.map(menu => {
                      return <Option key={menu}>{menu}</Option>;
                    })
                  : userSortMenu.map(menu => {
                      return <Option key={menu}>{menu}</Option>;
                    })}
              </Select>
            </div>
          </div>
          <Tabs
            defaultActiveKey={formatMessage(messages.program)}
            activeKey={activeKey}
            onChange={this.callback}
            tabBarStyle={{ color: "#7f888d", fontFamily: "AvenirNext-Medium" }}
            className="tabstitle fontsize14 "
          >
            <TabPane
              tab={`Program(${totalProgramResult})`}
              key={formatMessage(messages.program)}
              className="tabscontent flex"
            >
              <Program
                programs={this.state.program}
                handleOnClick={this.handleOnClick}
              />
            </TabPane>

            <TabPane
              tab={`Patient(${totalPatientResult})`}
              key={formatMessage(messages.patient)}
              className="tabscontent flex"
            >
              <Patient
                patients={this.state.patient}
                handleOnClick={this.handleOnClick}
              />
            </TabPane>
            {category === USER_CATEGORY.CARE_COACH && (
              <TabPane
                tab={`Doctor(${totalDoctorResult})`}
                key={formatMessage(messages.doctor)}
                className="tabscontent flex"
              >
                <Doctor
                  doctors={this.state.doctor}
                  handleOnClick={this.handleOnClick}
                />
              </TabPane>
            )}
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(SearchResult);
