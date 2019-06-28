import React, { Component } from "react";
import { injectIntl } from "react-intl";
import DashBoardHome from "./common/DashboardHome";
import DashBoardCalendar from "./common/DashboardCalendar";
import Programs from "./CareCoach/DashboardPrograms";
import Survey from "../../Containers/survey";
import MedicalDetails from "../../Containers/DashBoard/dashboardMedicals";
import { DASHBOARD_MENU } from "../../../constant";

class PageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getTapMenuContent = this.getTapMenuContent.bind(this);
  }

  getTapMenuContent(type = null) {
    const { setTabDashboard } = this.props;
    switch (type) {
      case DASHBOARD_MENU.HOME:
        return (
          <DashBoardHome setTabDashboard={setTabDashboard} {...this.props} />
        );
      case DASHBOARD_MENU.CALENDAR:
        return <DashBoardCalendar {...this.props} />;
      case DASHBOARD_MENU.PROGRAMS:
        return <Programs {...this.props} />;
      case DASHBOARD_MENU.MEDICALS:
        return <MedicalDetails />;
      case DASHBOARD_MENU.SURVEYS:
        return <Survey setTabDashboard={setTabDashboard} />;
      default:
        return <div />;
      //return <DashBoardHome setTabDashboard={setTabDashboard} />;
    }
  }

  render() {
    return this.getTapMenuContent(this.props.currentTab);
  }
}

export default injectIntl(PageContent);
