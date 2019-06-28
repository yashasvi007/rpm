import React, { Component } from "react";
import { Input, AutoComplete, Button } from "antd";
import { withRouter } from "react-router-dom";
import { doRequest } from "../../../Helper/network";
import { REQUEST_TYPE, path, ENTITY, USER_CATEGORY } from "../../../constant";
import throttle from "lodash-es/throttle";
import { injectIntl } from "react-intl";
import {
  getProgramChildren,
  getPatientChildren,
  getDoctorChildren
} from "./getChildrens";
import Cross from "../../../Assets/images/ico-remove.svg";
import messages from "./message";
import "./style.less";
const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      Program: [],
      Patient: [],
      Doctor: [],
      query: "",
      isLoading: false
    };
    this.getoptions = throttle(this.getoptions.bind(this), 3000);
  }

  componentWillUnmount() {
    this.getoptions = null;
  }

  gotToSearchResult = e => {
    e.preventDefault();
    const targetValue = e.target.value;
    this.setState({ dataSource: [] }, () => {
      this.props.history.push(
        `${path.SEARCH}/?key=${targetValue}&?query=${this.state.query}`
      );
    });
  };

  handleOnClick = (entity, id) => {
    this.props.history.push(`/${entity}/${id}`);
  };

  showoptions = e => {
    const { getoptions } = this;
    if (getoptions !== null) {
      this.setState({ query: e });
      this.setState({ isLoading: true });
      getoptions(e);
    }
  };

  async getoptions(e) {
    const {
      intl: { formatMessage },
      category
    } = this.props;

    const value = e.trim();

    if (!(value === "" || value === "$")) {
      const data = await doRequest({
        params: { query: value },
        url: path.SEARCH,
        method: REQUEST_TYPE.GET
      });
      //
      let program = [];
      let patient = [];
      let doctor = [];
      if (data.payload.data !== undefined) {
        program = getProgramChildren(data.payload.data.programs);
        patient = await getPatientChildren(data.payload.data.users.result);
        if (category === USER_CATEGORY.CARE_COACH) {
          doctor = await getDoctorChildren(data.payload.data.users.result);
        }
      }

      this.setState(
        prevState => ({
          Program: program,
          Patient: patient,
          Doctor: doctor
        }),
        () => {
          if (category === USER_CATEGORY.CARE_COACH) {
            this.setState({
              dataSource: [
                {
                  title: formatMessage(messages.program),
                  children: this.state.Program
                },
                {
                  title: formatMessage(messages.patient),
                  children: this.state.Patient
                },
                {
                  title: formatMessage(messages.doctor),
                  children: this.state.Doctor
                }
              ],
              isLoading: false
            });
          } else {
            this.setState({
              dataSource: [
                {
                  title: formatMessage(messages.program),
                  children: this.state.Program
                },
                {
                  title: formatMessage(messages.patient),
                  children: this.state.Patient
                }
              ],
              isLoading: false
            });
          }
        }
      );
    } else {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { dataSource, query, isLoading } = this.state;
    const { handleOnClick } = this;
    const validGroups = dataSource.filter(group => {
      return group.children.length > 0;
    });

    let placeholder = `Search programs, patients${
      this.props.category !== "doctor" ? ", doctors" : ""
    }`;

    let searchresultAvialable = true;
    if (query !== "" && validGroups.length <= 0) {
      searchresultAvialable = false;
    }

    const options = searchresultAvialable
      ? validGroups.map((group, index) => {
          return (
            <OptGroup
              className="title"
              key={index}
              label={
                <div
                  className="flex justify-content-space-between align-items-center"
                  style={{
                    height: "40px",
                    marginTop: "16px",
                    paddingBottom: "16px"
                  }}
                >
                  <span className="title fontsize14">
                    {group.title}({group.children.length})
                  </span>
                  {group.children.length > 1 && (
                    <div>
                      <Button
                        className="viewall"
                        size="small"
                        onClick={this.gotToSearchResult}
                        value={group.title}
                      >
                        View All
                      </Button>
                    </div>
                  )}
                </div>
              }
            >
              {group.title === "Patient"
                ? group.children.map((opt, i) => (
                    <Option
                      key={opt.title + i}
                      value={opt.title}
                      className="searchoptions"
                    >
                      <div
                        className="flex align-items-center"
                        onClick={() => {
                          handleOnClick(ENTITY.PATIENT, opt.id);
                        }}
                      >
                        <div className="fontsize16 pr10">
                          {opt.title} ({opt.age} {opt.gender})
                        </div>
                        <div className="fontsize12 info">{opt.disease} </div>{" "}
                        <div className="dot steel-grey ml2 mr2" />
                        <div className="fontsize12 info">
                          {opt.addressLine1 && opt.addressLine1 + ","}
                          {opt.city.length > 0 && opt.city + ","}
                          {opt.country}
                        </div>
                      </div>
                    </Option>
                  ))
                : group.children.map((opt, i) => (
                    <Option
                      key={opt.title + i}
                      value={opt.title}
                      className="searchoptions"
                    >
                      {group.title === "Program" ? (
                        <div
                          className="flex align-items-center mb0"
                          onClick={() => {
                            handleOnClick(ENTITY.PROGRAM, opt.id);
                          }}
                        >
                          <div className="programtitle">{opt.title} </div>
                          <div className="validity flex align-items-center justify-content-center">
                            {opt.validity}
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex align-items-center mb0  "
                          onClick={() => {
                            handleOnClick(ENTITY.DOCTOR, opt.id);
                          }}
                        >
                          <div className="programtitle">{opt.title}</div>{" "}
                          <span className="fontsize12 info pl20">
                            {opt.Speciality}
                          </span>
                        </div>
                      )}
                    </Option>
                  ))}
            </OptGroup>
          );
        })
      : [
          <Option key="no_result">
            {" "}
            {isLoading ? "Loading" : "No Result Found"}
          </Option>
        ];
    return (
      <div
        className="certain-category-search-wrapper searchbox"
        style={{ width: "100%" }}
      >
        <AutoComplete
          className="certain-category-search"
          dropdownClassName="certain-category-search-dropdown searchbox"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: "50px", position: "fixed" }}
          size="small"
          style={{ width: "100%", border: "none" }}
          dataSource={options}
          placeholder={placeholder}
          optionLabelProp="value"
          onChange={this.showoptions}
          autoFocus="true"
          // defaultValue={this.props.searchedText}
        >
          <Input
            prefix={
              <img
                alt=""
                src={Cross}
                className="cross"
                onClick={this.props.hideSearchbar}
              />
            }
          />
        </AutoComplete>
      </div>
    );
  }
}

export default withRouter(injectIntl(SearchBox));
