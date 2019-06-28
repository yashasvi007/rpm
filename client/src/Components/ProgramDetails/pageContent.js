import React, { Component, Fragment } from "react";
import { Tabs, Input, Icon, Select } from "antd";
import moment from "moment";
import _ from "lodash";
import isEqual from "lodash-es/isEqual";
import NavBar from "../HorizontalNavbar/CareCoach";
import LeftPanel from "../LeftPanel/CareCoach";
import PatientCard from "../Cards/patientCard";
import DoctorCard from "../Cards/doctorCard";
import throttle from "lodash-es/throttle";

import DownArrow from "../../Assets/images/material-icons-black-arrow-drop-down.svg";
import getPatientCardData from "../../Helper/dataFormater/patientCard";
import {
  ALL_SORT_BY,
  USER_STATUS,
  USER_CATEGORY,
  DOCUMENT_FILTER_TYPE
} from "../../constant";
import CommonSuccessMsg from "../../Containers/CommonSuccessMsg";
import { getQuery, makeQueryString } from "../../Helper/queryString";
import "./style.less";

const { Option } = Select;
const { TabPane } = Tabs;
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
      patientSelectedForDischarge: {},
      uncheckAll: false,
      query: ""
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

  showDischargeBarToggle = value => {
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
    if (regex.test(name)) {
      return true;
    }
    return false;
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

  onPatientCardSelect = data => {
    let { patientSelectedForDischarge } = this.state;
    patientSelectedForDischarge[data.id] = data;
    this.setState({
      patientSelectedForDischarge: patientSelectedForDischarge,
      uncheckAll: false
    });
  };

  onPatientCardDeselect = id => {
    let patientSelectedForDischarge = this.state.patientSelectedForDischarge;

    let patientSelectedForDischargeNew = {};
    for (const key in patientSelectedForDischarge) {
      if (key !== id) {
        patientSelectedForDischargeNew[key] = patientSelectedForDischarge[key];
      }
    }

    this.setState(
      {
        patientSelectedForDischarge: patientSelectedForDischargeNew
      },
      () => {
        if (Object.keys(this.state.patientSelectedForDischarge).length < 1) {
          this.setState({
            uncheckAll: true
          });
        }
      }
    );
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

    // this.filterUserData()
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
  render() {
    const {
      program_data = {},
      products = [],
      patients: programPatients = [],
      doctors: programDoctors = [],
      history,
      getMyPrograms,
      user_data: { basicInfo: { category } = {} } = {},
      dischargePatient,
      history: {
        location: { pathname, search }
      }
    } = this.props;
    const { doctorData } = this.state;
    const {
      tab: currentEntity = USER_CATEGORY.PATIENT,
      status = "enrolled"
    } = getQuery(search);
    const { onSearchTextChange } = this;

    return (
      <Fragment>
        <div className="flex column align-items-center w100 programDetailsBody">
          <div className="clearFix-64" />
          <div className="flex row align-items-center w100">
            <NavBar
              programData={program_data || ""}
              category={category}
              showDischarge={this.state.showDischarge}
              patientCount={
                (programPatients && Object.keys(programPatients).length) || 0
              }
              doctorCount={
                (programDoctors && Object.keys(programDoctors).length) || 0
              }
              history={history}
              changeCurrentEntity={value => {
                this.setState({ currentEntity: value }, () => {
                  this.ProgramPatientDoctorToState();
                });
              }}
              showDischargeBarToggle={this.showDischargeBarToggle}
              patientSelectedForDischarge={
                this.state.patientSelectedForDischarge
              }
              getMyPrograms={getMyPrograms}
              dischargePatient={dischargePatient}
            />
          </div>
          <CommonSuccessMsg className={"program-success-msg"} />

          <div className="clearFix-2" />
          <div className="flex row align-items-center w100">
            <div className="flex column align-items-center wfc">
              <LeftPanel
                programInfo={program_data || ""}
                productsData={products || ""}
              />
            </div>
            <div className="flex column listBody pl25 pt28 pr28 w100">
              <div className="flex row justify-content-space-between w100 pb24">
                <div className="flex row align-items-center searchBoxContainer-360-40 wfc">
                  <Input
                    placeholder="Search paitents,doctors"
                    onChange={onSearchTextChange}
                    prefix={
                      <Icon
                        type="search"
                        style={{ color: "rgba(0,0,0,.25)" }}
                      />
                    }

                    // ref={node => (this.userNameInput = node)}
                  />
                </div>
                {status === "inactive" && (
                  <div className="flex row align-items-center justify-content-end pb24 grayDropdownContainer-220-40 wfc">
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
                )}
                <div className="flex row align-items-center justify-content-end pb24 grayDropdownContainer-220-40 wfc">
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
              </div>
              <div className="w100">
                {currentEntity === USER_CATEGORY.PATIENT && (
                  <Tabs
                    className={"tabstitle fontsize14"}
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
                      {this.getPatientsEnrolledComponent()}
                    </TabPane>
                    <TabPane
                      tab={`Inactive(${this.getTypeCount("inactive")})`}
                      key="inactive"
                      className="flex flex-wrap"
                    >
                      {this.getPatientsInactiveComponent()}
                    </TabPane>
                    <TabPane
                      tab={`Discharged(${this.getTypeCount("discharged")})`}
                      key="discharged"
                      className="flex flex-wrap"
                    >
                      {this.getPatientsDischargedComponent()}
                    </TabPane>
                  </Tabs>
                )}
                {currentEntity === USER_CATEGORY.DOCTOR && (
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

                    {this.getDoctorsComponent()}
                    <div className="clearFix-30 " />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default PageContent;
