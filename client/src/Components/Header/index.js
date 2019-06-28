import React, { Component, Fragment } from "react";
import { Button, Dropdown, Menu } from "antd";
import { injectIntl } from "react-intl";
import { get } from "js-cookie";
import { connect } from "getstream";
import querystring from "querystring";
import CarecoachMenu from "./careCoachMenu";
import PatientMenu from "./patientsMenu";
import DoctorMenu from "./doctorsMenu";
import HeaderIcons from "./headersIcon";
import placeHolder from "../../Assets/images/ico-placeholder-userdp.svg";
import logo from "../../Assets/images/iqvia_logo_white.png";
import "./style.less";
import messages from "./message";
import Searchbox from "../Searchbox/index";
import { USER_CATEGORY, path } from "../../constant";
import AddPatient from "../../Containers/AddPatient/addPatient";
import AddDoctor from "../../Containers/AddDoctor/addDoctor";
import config from "../../config";

const { GETSTREAM_API_KEY, GETSTREAM_APP_ID } = config;

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchbar: false,
      query: "",
      notifications: null,
      lastactivityId: null,
      clientFeed: null
    };
    this.onClick = this.onClick.bind(this);
  }
  componentDidMount() {
    const { location: { pathname, search } = {} } = this.props;
    if (pathname === `${path.SEARCH}/`) {
      const query = querystring.parse(search);
      this.setState({ showSearchbar: true, query: query["?query"] });
    }
    if (get("notificationToken") && get("feedId")) {
      let client = connect(
        GETSTREAM_API_KEY,
        get("notificationToken"),
        GETSTREAM_APP_ID
      );
      let clientFeed = client.feed("timeline", btoa(get("feedId")));
      this.setState({ clientFeed });
      clientFeed.get({ limit: 60 }).then(data => {
        console.log("results", data);
        this.setState({ notifications: data.results });
      });
      clientFeed.subscribe(data => {
        clientFeed.get({ limit: 60 }).then(res => {
          this.setState({ notifications: res.results });
        });
      });
    }
  }
  componentWillUnmount() {
    // this.clientFeed.
  }
  openAddPatientModal = e => {
    //e.preventDefault();
    this.state.openAddPatient
      ? this.setState({ openAddPatient: false })
      : this.setState({ openAddPatient: true });
  };

  openAddDoctorModal = e => {
    //e.preventDefault();
    this.state.openAddDoctor
      ? this.setState({ openAddDoctor: false })
      : this.setState({ openAddDoctor: true });
  };

  gotoMyProfile = e => {
    this.props.history.push(path.MY_PROFILE);
  };

  showSearchbar = () => {
    this.setState({
      showSearchbar: true
    });
  };
  hideSearchbar = () => {
    this.setState({
      showSearchbar: false
    });
  };
  onClick(event) {
    const { openModal } = this.props;
    openModal();
    //
  }

  signOut = e => {
    const { signOut } = this.props;
    signOut();
  };

  render() {
    const {
      intl: { formatMessage },
      openModal,
      user_data: {
        basicInfo: { _id, category, profilePicLink = placeHolder } = {},
        isProfileCompleted = false
      } = {},
      showmenu,
      reportAdverseEvent,
      showSearch,
      showAddButton,
      currentTab
    } = this.props;
    const { openAddDoctorModal, openAddPatientModal } = this;
    const { showSearchbar } = this.state;

    const menu = (
      <Menu>
        <Menu.Item onClick={this.gotoMyProfile}>
          {formatMessage(messages.myProfile)}
        </Menu.Item>
        <Menu.Item onClick={this.signOut}>
          {formatMessage(messages.signOut)}
        </Menu.Item>
      </Menu>
    );
    if (!this.props.authenticated) {
      return (
        <div
          className={
            "fixed_header header flex align-items-center justify-content-space-between pl20 pr20"
          }
        >
          <div className={"flex align-items-center"}>
            <a href={"/"}>
              <div className="logo">
                <img alt="" src={logo} />
              </div>
            </a>
            <div className={"pl10 bold"} style={{ color: "#fff" }}>
              {formatMessage(messages.headerlogo)}
            </div>
          </div>
        </div>
      );
    }
    return (
      <Fragment>
        {this.state.openAddPatient && (
          <AddPatient
            handleCancel={this.openAddPatientModal}
            visible={this.state.openAddPatient}
          />
        )}

        {this.state.openAddDoctor && (
          <AddDoctor
            {...this.props}
            handleCancel={this.openAddDoctorModal}
            visible={this.state.openAddDoctor}
          />
        )}
        <div
          className={
            "fixed_header header flex align-items-center justify-content-space-between pl20 pr20"
          }
        >
          <div className={"flex align-items-center"}>
            <a href={"/"}>
              <div className="logo">
                <img alt="" src={logo} />
              </div>
            </a>
            <div className={"pl10 bold"}>
              {formatMessage(messages.headerlogo)}
            </div>
            <div>
              {!this.props.signup && (
                <div>
                  {category === USER_CATEGORY.CARE_COACH ? (
                    <div className="mainmenu">
                      {!showmenu && isProfileCompleted && (
                        <CarecoachMenu
                          setTabDashboard={this.props.setTabDashboard}
                          {...this.props}
                          currentTab={currentTab}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="mainmenu">
                      {!showmenu && isProfileCompleted && (
                        <div>
                          {category === USER_CATEGORY.PATIENT ? (
                            <PatientMenu {...this.props} />
                          ) : (
                            <DoctorMenu {...this.props} />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {this.props.signup ? (
            <div className="signup-header padding-rl-10">
              <Button type="primary" className="signup-btn margin-rl-10">
                {formatMessage(messages.signUp)}
              </Button>
              <Button className="signin-btn">
                {formatMessage(messages.signIn)}
              </Button>
            </div>
          ) : (
            <div className="flex align-items-center">
              {!showmenu && isProfileCompleted && (
                <HeaderIcons
                  category={category}
                  openAddDoctorModal={openAddDoctorModal}
                  openAddPatientModal={openAddPatientModal}
                  openModal={openModal}
                  showSearchbar={this.showSearchbar}
                  reportAdverseEvent={reportAdverseEvent}
                  userId={_id}
                  showSearch={showSearch}
                  showAddButton={showAddButton}
                  notifications={this.state.notifications}
                />
              )}

              <div>
                <Dropdown overlay={menu} placement="bottomRight">
                  <div className="user-logo clickable">
                    <img
                      alt=""
                      className="user-logo clickable"
                      src={profilePicLink}
                    />
                  </div>
                </Dropdown>
              </div>
            </div>
          )}
        </div>

        <div className={showSearchbar ? "searchbar" : "nosearchbar"}>
          {showSearchbar && (
            <div>
              <Searchbox
                hideSearchbar={this.hideSearchbar}
                searchedText={this.state.query}
                category={category}
              />
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(AppHeader);
