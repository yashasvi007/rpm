import React, { Component, Fragment } from "react";
import { Tabs, Input, Icon, Select, Row, Col } from "antd";
import moment from "moment";
import _ from "lodash";
import isEqual from "lodash-es/isEqual";
import PatientCard from "../Cards/patientCard";
import DoctorCard from "../Cards/doctorCard";
import throttle from "lodash-es/throttle";
import DownArrow from "../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import getPatientCardData from "../../../Helper/dataFormater/patientCard";
import { Menu } from "antd";
import DischargeBar from "./dischargeBar";
import {
  ALL_SORT_BY,
  USER_STATUS,
  USER_CATEGORY,
  DOCUMENT_FILTER_TYPE
} from "../../../constant";
import CommonSuccessMsg from "../../Containers/CommonSuccessMsg";
import { getQuery, makeQueryString } from "../../../Helper/queryString";
import "./style.less";
import isBefore from "date-fns/is_before";

const { Option } = Select;
const { TabPane } = Tabs;
const { Item } = Menu;
class PageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFilterType:
        (props.location.state && props.location.state.currentFilterType) ||
        "Name",
      documentStatusFilterType: "All",
      showDischarge: false,
      patientEnrolled: [],
      patientDischarged: [],
      patientInactive: [],
      patientInactiveUnverified: [],
      doctorData: [],
      patientSelectedForDischarge: [],
      uncheckAll: false,
      query: "",
      currentTab: USER_CATEGORY.PATIENT
    };
    this.handleSearch = throttle(this.handleSearch.bind(this), 1000);
  }

  componentDidMount() {
    this.ProgramPatientDoctorToState(true);
  }

  componentDidUpdate(prevProps, prevState) {
    const { patients, doctors } = this.props;
    const { patients: prevPatients, doctors: prevDoctors } = prevProps;
    if (!isEqual(patients, prevPatients) || !isEqual(doctors, prevDoctors)) {
      this.ProgramPatientDoctorToState(true);
    }
  }

  showDischargeBarToggle = () => {
    const { patientSelectedForDischarge } = this.state;
    this.setState({
      showDischarge: patientSelectedForDischarge.length > 0,
      uncheckAll: patientSelectedForDischarge.length < 1
    });
  };

  disableDischargeBar = () => {
    this.setState({
      showDischarge: false,
      uncheckAll: true,
      patientSelectedForDischarge: []
    });
  };

  applyDocumentFilter() {
    this.setState({
      patientInactiveUnverified: this.documentStatusFilter()
    });
  }

  documentStatusFilter() {
    const { documentStatusFilterType, patientInactive } = this.state;
    switch (documentStatusFilterType) {
      case DOCUMENT_FILTER_TYPE.NOT_CONSENTED:
        return patientInactive.filter(
          ({ documents: { consentFormVerified } }) => {
            return !consentFormVerified;
          }
        );
      case DOCUMENT_FILTER_TYPE.NOT_VERIFIED:
        return patientInactive.filter(({ documents: { idProofVerified } }) => {
          return !idProofVerified;
        });
      default:
        return patientInactive;
    }
  }

  handleSearch(query = "") {
    this.setState({ query: query.trim() }, this.ProgramPatientDoctorToState);
  }

  filterUser = user => {
    const { query } = this.state;
    const { basicInfo: { name = "" } = {} } = user;
    const regex = new RegExp("(" + query + ")", "gi");
    return regex.test(name);
  };

  filterUserData = () => {
    const {
      patientDischarged = [],
      patientEnrolled = [],
      patientInactive = [],
      doctorData = []
    } = this.state;
    const { filterUser } = this;
    this.setState({
      patientDischarged: patientDischarged.filter(user => filterUser(user)),
      patientEnrolled: patientEnrolled.filter(user => filterUser(user)),
      patientInactive: patientInactive.filter(user => filterUser(user)),
      doctorData: doctorData.filter(user => filterUser(user))
    });

    console.log(
      patientDischarged,
      patientEnrolled,
      patientInactive,
      doctorData
    );
  };

  onSearchTextChange = e => {
    e.preventDefault();
    this.handleSearch(e.target.value);
  };

  onPatientCardSelect = id => {
    let { patientSelectedForDischarge } = this.state;
    patientSelectedForDischarge.push(id);
    this.setState({
      patientSelectedForDischarge: patientSelectedForDischarge,
      uncheckAll: false
    });
  };

  onPatientCardDeselect = id => {
    let patientSelectedForDischarge = this.state.patientSelectedForDischarge;
    let index = patientSelectedForDischarge.indexOf(id);
    patientSelectedForDischarge.splice(index, 1);
    this.setState({
      patientSelectedForDischarge: patientSelectedForDischarge,
      uncheckAll: patientSelectedForDischarge < 1
    });
  };

  sortResults = data => {
    const { currentFilterType } = this.state;
    const { countrySelector, citySelector } = this.props;
    // const { tab: currentEntity = USER_CATEGORY.PATIENT } = getQuery(search);

    switch (currentFilterType) {
      case ALL_SORT_BY.NAME:
        return data
          .filter(value => this.filterUser(value))
          .sort((a, b) => {
            let nameA = a.basicInfo.name.toLowerCase(),
              nameB = b.basicInfo.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });

      case ALL_SORT_BY.LOCATION:
        return data
          .filter(value => this.filterUser(value))
          .sort((a, b) => {
            const {
              personalInfo: {
                homeAddress: { city: cityA, country: countryA } = {}
              } = {}
            } = a;
            const {
              personalInfo: {
                homeAddress: { city: cityB, country: countryB } = {}
              } = {}
            } = b;
            const countryAData = countrySelector(countryA);
            const cityAData = citySelector(countryA, cityA);
            const countryBData = countrySelector(countryB);
            const cityBData = citySelector(countryB, cityB);
            const countryAName =
              countryAData && countryAData !== null
                ? countryAData.toLowerCase()
                : "";
            const countryBName =
              countryBData && countryBData !== null
                ? countryBData.toLowerCase()
                : "";
            const cityAName =
              cityAData && cityAData !== null ? cityAData.toLowerCase() : "";
            const cityBName =
              cityBData && cityBData !== null ? cityBData.toLowerCase() : "";

            if (countryAName < countryBName) return -1;
            if (countryAName > countryBName) return 1;
            if (countryAName === countryBName) {
              if (cityAName < cityBName) return -1;
              if (cityAName > cityBName) return 1;
            }

            return 0;
          });

      case ALL_SORT_BY.DATE_ADDED:
        return data
          .filter(value => this.filterUser(value))
          .sort((a, b) => {
            return moment(a.basicInfo.createdAt).diff(b.basicInfo.createdAt);
          });

      default:
        return data.filter(value => this.filterUser(value));
    }
  };
  getAge = d1 => {
    const now = new Date();
    const then = new Date(d1);
    const diff = now.getTime() - then.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (age >= 0) {
      return `${age}`;
    }
    return false;
  };

  getTypeCount = type => {
    const {
      history: {
        location: { search }
      }
    } = this.props;
    const { tab: currentEntity = USER_CATEGORY.PATIENT } = getQuery(search);

    switch (type) {
      case "enrolled":
        return currentEntity === USER_CATEGORY.PATIENT
          ? this.state.patientEnrolled.length
          : "";
      case "inactive":
        return currentEntity === USER_CATEGORY.PATIENT
          ? this.state.patientInactive.length
          : "";
      case "discharged":
        return currentEntity === USER_CATEGORY.PATIENT
          ? this.state.patientDischarged.length
          : "";
      default:
        return 0;
    }
  };

  handleOnClick = (entity, id) => {
    this.props.history.push(`/${entity}/${id}`);
  };

  ProgramPatientDoctorToState = async (applyDocumentFilter = false) => {
    let {
      doctors: programDoctors = [],
      patients: programPatients = []
    } = this.props;
    let {
      patientDischarged,
      patientEnrolled,
      patientInactive,
      doctorData
    } = this.state;
    if (programDoctors && programPatients) {
      let patientEnrolledData = [],
        patientDischargedData = [],
        patientInactiveData = [],
        doctorInfo = [];
      if (
        _.isEmpty(patientDischarged) ||
        _.isEmpty(patientEnrolled) ||
        _.isEmpty(patientInactive) ||
        _.isEmpty(doctorData)
      ) {
        Object.keys(programDoctors).forEach((key, index) => {
          const value = programDoctors[key];
          doctorInfo.push(value);
        });
        Object.keys(programPatients).forEach((key, index) => {
          const value = programPatients[key];
          if (value.status === USER_STATUS.ENROLLED) {
            patientEnrolledData.push(value);
          } else if (value.status === USER_STATUS.DISCHARGED) {
            patientDischargedData.push(value);
          } else {
            patientInactiveData.push(value);
          }
        });
        await this.setState({
          patientEnrolled: this.sortResults(patientEnrolledData),
          patientDischarged: this.sortResults(patientDischargedData),
          patientInactive: this.sortResults(patientInactiveData),
          doctorData: this.sortResults(doctorInfo)
        });
      } else {
        await this.setState({
          patientEnrolled: this.sortResults(patientEnrolled),
          patientDischarged: this.sortResults(patientDischarged),
          patientInactive: this.sortResults(patientInactive),
          doctorData: this.sortResults(doctorData)
        });
      }
    }

    if (applyDocumentFilter) {
      this.applyDocumentFilter();
    }
  };

  getPatientsEnrolledComponent = () => {
    const {
      patientEnrolled,
      patientSelectedForDischarge,
      uncheckAll
    } = this.state;
    const { users = {}, hospitals = {}, user_data: currentUser } = this.props;
    let component = !_.isEmpty(patientEnrolled)
      ? patientEnrolled.map((value, index) => {
          const data = getPatientCardData({
            users,
            hospitals,
            currentUser,
            patient: value
          });
          const { basicInfo = {} } = value;
          return (
            <PatientCard
              data={data}
              key={index}
              showDischargeBarToggle={this.showDischargeBarToggle}
              onPatientCardSelect={this.onPatientCardSelect}
              onPatientCardDeselect={this.onPatientCardDeselect}
              patientDischargedList={patientSelectedForDischarge}
              uncheckAll={uncheckAll}
              handleOnClick={(entity, id) => {
                this.props.history.push(`/${entity}/${basicInfo._id}`);
              }}
            />
          );
        })
      : "";

    return component;
  };
  getPatientsInactiveComponent = () => {
    const { patientInactiveUnverified } = this.state;
    const { users = {}, hospitals = {}, user_data: currentUser } = this.props;
    let component = !_.isEmpty(patientInactiveUnverified)
      ? patientInactiveUnverified.map((value, index) => {
          const data = getPatientCardData({
            users,
            hospitals,
            currentUser,
            patient: value
          });
          return (
            <PatientCard
              data={data}
              key={index}
              handleOnClick={this.handleOnClick}
            />
          );
        })
      : "";
    return component;
  };
  getPatientsDischargedComponent = () => {
    const { patientDischarged } = this.state;
    const { users = {}, hospitals = {}, user_data: currentUser } = this.props;
    let component = !_.isEmpty(patientDischarged)
      ? patientDischarged.map((value, index) => {
          const data = getPatientCardData({
            users,
            hospitals,
            currentUser,
            patient: value
          });
          return (
            <PatientCard
              data={data}
              key={index}
              handleOnClick={this.handleOnClick}
            />
          );
        })
      : "";

    return component;
  };
  getDoctorsComponent = () => {
    const { doctorData } = this.state;
    const { hospitals } = this.props;
    let component =
      !_.isEmpty(doctorData) && doctorData.length !== 0
        ? doctorData.map((value, index) => {
            let data = {};
            const { visitingHospitals = [] } = value;

            data.profilePicLink = value.basicInfo.profilePicLink || "";
            data.title = value.basicInfo.name || "";
            if (visitingHospitals.length > 0) {
              const primaryHospital = hospitals[visitingHospitals[0]];
              if (primaryHospital) {
                data.hospital = `${primaryHospital.name},${
                  primaryHospital.city
                }`;
              }
            }
            data.id = value.basicInfo._id;

            return (
              <DoctorCard
                data={data}
                key={index}
                handleOnClick={this.handleOnClick}
              />
            );
          })
        : "";

    return component;
  };

  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  selectMenu = e => {
    const { key } = e;
    this.setState({ currentTab: key });
  };

  redirectToProgramDetails = () => {
    console.log("this.props ----", this.props);
    const { program_data: { _id: programId } = {}, history } = this.props;
    history.push(`/program/${programId}/summary`);
  };

  render() {
    const {
      program_data: { name = "", expiresOn = new Date() } = {},
      patients: programPatients = [],
      doctors: programDoctors = [],
      user_data: { basicInfo: { category } = {} } = {},
      history: {
        location: { pathname, search }
      }
    } = this.props;
    const { doctorData, currentTab, showDischarge } = this.state;
    const isActive = isBefore(new Date(), expiresOn);
    const {
      tab: currentEntity = USER_CATEGORY.PATIENT,
      status = "enrolled"
    } = getQuery(search);
    const { onSearchTextChange } = this;

    return (
      <Fragment>
        <div className="program-details-body hide-scroll">
          <div className="search-section">
            <div className="search-bar">
              <Input
                placeholder={`Search ${currentTab}s by name or location`}
                onChange={onSearchTextChange}
                prefix={
                  <Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />
                }
              />
            </div>
            <Row gutter={8}>
              {status === "inactive" && currentTab === USER_CATEGORY.PATIENT && (
                <Col xs={12} xm={12} md={6} lg={6}>
                  <div className="sort-bar">
                    <Select
                      optionFilterProp="children"
                      onChange={value => {
                        this.setState(
                          { documentStatusFilterType: value },
                          () => {
                            this.applyDocumentFilter();
                          }
                        );
                      }}
                      value={`Showing: ${this.state.documentStatusFilterType}`}
                      suffixIcon={
                        <img
                          alt="downArrow"
                          src={DownArrow}
                          className="arrowImg"
                        />
                      }
                    >
                      <Option value="All">All</Option>
                      <Option value="Not Consented">Not Consented</Option>
                      <Option value="Not Verified">Not Verified</Option>
                    </Select>
                  </div>
                </Col>
              )}
              <Col xs={12} xm={12} md={6} lg={6}>
                <div className="sort-bar">
                  <Select
                    optionFilterProp="children"
                    onChange={value => {
                      this.setState({ currentFilterType: value }, () => {
                        this.ProgramPatientDoctorToState();
                      });
                    }}
                    value={`Sort by: ${this.state.currentFilterType}`}
                    suffixIcon={
                      <img
                        alt="downArrow"
                        src={DownArrow}
                        className="arrowImg"
                      />
                    }
                  >
                    <Option value="Name">Name</Option>
                    <Option value="Location">Location</Option>
                    <Option value="Date Added">Date Added</Option>
                  </Select>
                </div>
              </Col>
            </Row>
          </div>
          <div className="program-details-lower-body">
            {currentTab === USER_CATEGORY.PATIENT && (
              <Tabs
                className={"tab-title fontsize14"}
                activeKey={status}
                defaultActiveKey="enrolled"
                onChange={e => {
                  this.props.history.replace({
                    pathname,
                    search: makeQueryString({
                      tab: currentEntity,
                      status: e
                    })
                  });
                  if (["discharged", "inactive"].indexOf(e) !== -1) {
                    this.showDischargeBarToggle(false);
                  }
                }}
                style={{ width: "100%" }}
              >
                <TabPane
                  tab={`Enrolled(${this.getTypeCount("enrolled")})`}
                  key="enrolled"
                  className="flex flex-wrap"
                >
                  <Row gutter={8} className="w100">
                    {this.getPatientsEnrolledComponent()}
                  </Row>
                </TabPane>
                <TabPane
                  tab={`Inactive(${this.getTypeCount("inactive")})`}
                  key="inactive"
                  className="flex flex-wrap"
                >
                  <Row gutter={8} className="w100">
                    {this.getPatientsInactiveComponent()}
                  </Row>
                </TabPane>
                <TabPane
                  tab={`Discharged(${this.getTypeCount("discharged")})`}
                  key="discharged"
                  className="flex flex-wrap"
                >
                  <Row gutter={8} className="w100">
                    {this.getPatientsDischargedComponent()}
                  </Row>
                </TabPane>
              </Tabs>
            )}
            {currentTab === USER_CATEGORY.DOCTOR && (
              <div className="w100 flex flex-wrap">
                <div className="w100 flex column justify-content-start">
                  <div className="fontsize-16 medium dark fw500">
                    Showing {doctorData.length} Doctors
                  </div>
                  <div className="clearFix-8" />
                  <div
                    className="clearFix-1"
                    style={{ borderBottom: "solid 2px #d4d7d9" }}
                  />
                  <div className="clearFix-30 " />
                </div>
                <Row gutter={8} className="w100">
                  {this.getDoctorsComponent()}
                </Row>
                <div className="clearFix-30 " />
              </div>
            )}
          </div>
        </div>
        <div className="program-details-footer">
          <div
            className="view-program-button"
            onClick={this.redirectToProgramDetails}
          >
            View Program Info
          </div>
          {!showDischarge && (
            <div className="menu-selection menu-black">
              <Menu
                selectedKeys={[this.state.currentTab]}
                mode="horizontal"
                onClick={this.selectMenu}
              >
                <Item key={USER_CATEGORY.PATIENT}>
                  Patients (
                  {(programPatients && Object.keys(programPatients).length) ||
                    0}
                  )
                </Item>
                {category !== USER_CATEGORY.DOCTOR && (
                  <Item key={USER_CATEGORY.DOCTOR}>
                    Doctors (
                    {(programDoctors && Object.keys(programDoctors).length) ||
                      0}
                    )
                  </Item>
                )}
              </Menu>
            </div>
          )}
          {!showDischarge && (
            <div className="nav-bar">
              <div className="nav-bar-left">
                <div className="arrow-wrapper">
                  <Icon type="arrow-left" onClick={this.goBack} />
                </div>
                <div className="text">All Programs</div>
              </div>
              <div className="nav-bar-right">
                <div className="program-name">{name}</div>
                <div className={isActive ? "bubble active" : "bubble"}>
                  {isActive ? "Active" : "Expired"}
                </div>
              </div>
            </div>
          )}
          {showDischarge && (
            <DischargeBar
              patientSelectedForDischarge={
                this.state.patientSelectedForDischarge
              }
              disableDischargeBar={this.disableDischargeBar}
              dischargePatient={this.props.dischargePatient}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default PageContent;
