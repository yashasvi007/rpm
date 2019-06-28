import React, { Component } from "react";
import { injectIntl } from "react-intl";
import DashBoardHome from "../common/DashboardHome";
import DashBoardCalendar from "./DashboardCalendar";
import Survey from "./DashboardSurvey";
import Programs from "./DashboardPrograms";

class PageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getTapMenuContent = this.getTapMenuContent.bind(this);
  }
  componentWillMount() {}

  getTapMenuContent(type = null) {
    switch (type) {
      case "dashboard":
        return <DashBoardHome />;
      case "calendar":
        return <DashBoardCalendar {...this.props} />;
      case "programs":
        return <Programs {...this.props} />;
      case "surveys":
        return <Survey />;
      default:
        return <DashBoardHome />;
    }
  }

  render() {
    return this.getTapMenuContent(this.props.currentTab);
  }
}

export default injectIntl(PageContent);
