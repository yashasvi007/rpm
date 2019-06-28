import React, { Component, Fragment } from "react";
import { Button, Dropdown, Menu } from "antd";
import { injectIntl } from "react-intl";
import querystring from "querystring";
import HeaderIcons from "./headersIcon";
import placeHolder from "../../../Assets/images/ico-placeholder-userdp.svg";
import logo from "../../../Assets/images/iqvia_logo_white.png";
import "./style.less";
import messages from "./message";
import SearchBox from "../SearchBox/index";
import { USER_CATEGORY, path } from "../../../constant";

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchBar: false,
      query: ""
    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const { location: { pathname, search } = {} } = this.props;
    if (pathname === `${path.SEARCH}/`) {
      const query = querystring.parse(search);
      this.setState({ showSearchBar: true, query: query["?query"] });
    }
  }

  gotoMyProfile = () => {
    this.props.history.push(path.MY_PROFILE);
  };

  showSearchBar = () => {
    this.setState({
      showSearchBar: true
    });
  };

  hideSearchBar = () => {
    this.setState({
      showSearchBar: false
    });
  };

  onClick() {
    const { openModal } = this.props;
    openModal();
  }

  signOut = () => {
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
    const { showSearchBar } = this.state;

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
                  openModal={openModal}
                  showSearchbar={this.showSearchBar}
                  reportAdverseEvent={reportAdverseEvent}
                  userId={_id}
                  showSearch={showSearch}
                  showAddButton={showAddButton}
                />
              )}

              <div>
                <Dropdown
                  overlay={menu}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="user-logo-container clickable">
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

        <div className={showSearchBar ? "searchbar" : "nosearchbar"}>
          {showSearchBar && (
            <div>
              <SearchBox
                hideSearchbar={this.hideSearchBar}
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
