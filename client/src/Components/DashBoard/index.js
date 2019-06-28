import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import AppHeader from "../../Containers/Header";
import PageContent from "./PageContent";
import CommonSuccessMsg from "../../Containers/CommonSuccessMsg";
import isEmpty from "lodash-es/isEmpty";
import "./styles/homeStyles.less";
import "./styles/program_style.less";
import {
  DASHBOARD_MENU,
  path,
  MEDICALS_OPTIONS,
  EVENT_TYPE,
  SURVEYS
} from "../../constant";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    const { location: { state = {} } = {} } = this.props;
    this.state = {
      currentTab: (state && state.defaultTab) || path.DASHBOARD.HOME,
      modalVisible: false
    };
    this.setTabDashboard = this.setTabDashboard.bind(this);
  }

  componentDidMount() {
    const { match: { url = [], params = {} } = {}, getData } = this.props;

    const show = params.show ? params.show : "";
    if (
      show === EVENT_TYPE.ALL ||
      show === EVENT_TYPE.APPOINTMENTS ||
      show === EVENT_TYPE.REMINDERS
    ) {
      this.setTabDashboard(DASHBOARD_MENU.CALENDAR, { show: show });
    } else if (show === SURVEYS.INPROGRESS || show === SURVEYS.COMPLETED) {
      this.setTabDashboard(DASHBOARD_MENU.SURVEYS, { show: show });
    } else if (
      show === MEDICALS_OPTIONS.BASIC ||
      show === MEDICALS_OPTIONS.VITAL ||
      show === MEDICALS_OPTIONS.CLINICALREADING ||
      show === MEDICALS_OPTIONS.MEDICATION ||
      show === MEDICALS_OPTIONS.ADVERSEEVENTS
    ) {
      this.setTabDashboard(DASHBOARD_MENU.MEDICALS, { show: show });
    } else {
      const value = url.slice(1);
      this.setTabDashboard(value);
    }
    getData();
  }

  pushTabToHistory(value, url) {
    this.props.history.push({
      pathname: url,
      state: { defaultTab: value }
    });
  }

  setTabDashboard(tabValue, params) {
    switch (tabValue) {
      case DASHBOARD_MENU.HOME: {
        this.pushTabToHistory(tabValue, path.DASHBOARD.HOME);
        break;
      }
      case DASHBOARD_MENU.CALENDAR: {
        const show = params ? params.show : null;
        if (show) {
          const url = "/calendar/" + show;
          this.pushTabToHistory(tabValue, url);
        } else {
          const url = "/calendar";
          this.pushTabToHistory(tabValue, url);
        }
        break;
      }
      case DASHBOARD_MENU.PROGRAMS: {
        this.pushTabToHistory(tabValue, path.DASHBOARD.PROGRAMS);
        break;
      }
      case DASHBOARD_MENU.SURVEYS: {
        const show = params ? params.show : null;
        if (show) {
          const url = "/surveys/" + show;
          this.pushTabToHistory(tabValue, url);
        } else {
          const url = "/surveys";
          this.pushTabToHistory(tabValue, url);
        }
        break;
      }
      case DASHBOARD_MENU.MEDICALS: {
        const show = params ? params.show : null;
        console.log("show-----------", show);
        if (show) {
          const url = "/medicals/" + show;
          this.pushTabToHistory(tabValue, url);
        } else {
          const url = "/medicals";
          this.pushTabToHistory(tabValue, url);
        }
        break;
      }
      default: {
        this.setTabDashboard("dashboard");
        this.pushTabToHistory("dashboard", path.DASHBOARD.HOME);
        break;
      }
    }

    this.setState({ currentTab: tabValue });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { match: { path: prevPath } = {} } = prevProps;
    const { match: { path: newPath, params = {} } = {} } = this.props;
    if (prevPath !== newPath) {
      if (isEmpty(params)) {
        this.setTabDashboard(newPath.slice(1));
      } else {
        console.log("newPAth----------", newPath);
        console.log("PPPPPPPPPPPP", params.show);
        console.log(
          "------------------",
          newPath.substr(1, newPath.lastIndexOf("/") - 1)
        );
        this.setTabDashboard(
          newPath.substr(1, newPath.lastIndexOf("/") - 1),
          params
        );
      }
    }
  }

  handleModalVisible = value => {
    this.setState({ modalVisible: value });
  };

  render() {
    const { user_data: { basicInfo } = {} } = this.props;
    const { setTabDashboard, handleModalVisible } = this;

    return (
      <Fragment>
        <AppHeader
          setTabDashboard={this.setTabDashboard}
          signup={false}
          {...this.props}
          currentTab={this.state.currentTab}
        />
        {basicInfo && (
          <PageContent
            currentTab={this.state.currentTab}
            {...this.props}
            setTabDashboard={setTabDashboard}
            handleModalVisible={handleModalVisible}
          />
        )}
        {!this.state.modalVisible && (
          <CommonSuccessMsg className={"dashboard-success-msg"} />
        )}
      </Fragment>
    );
  }
}

export default injectIntl(Dashboard);
