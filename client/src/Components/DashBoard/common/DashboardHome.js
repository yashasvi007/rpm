import React, { Component, Fragment } from "react";
import "../styles/homeStyles.less";
import DashboardAppointment from "../../../Containers/DashBoard/dashboardAppointment";
import DashboardReminder from "../../../Containers/DashBoard/dashboardReminder";
import DashboardSurveys from "../../../Containers/DashBoard/dashboardSurvey";
import { USER_CATEGORY } from "../../../constant";

export class DashBoardHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDashBoard: true
    };
  }
  componentDidMount() {}

  setDefaultState() {
    this.setState({
      appointments: []
    });
  }

  render() {
    const {
      history,
      location,
      setTabDashboard,
      user_data: { basicInfo: { category = USER_CATEGORY.PATIENT } = {} } = {}
    } = this.props;
    const propsToSend = { history, location, setTabDashboard };
    return (
      <Fragment>
        <div className="dashboard-home">
          <div className="appointment-section">
            <DashboardAppointment {...propsToSend} />
          </div>
          <div className="reminder-section">
            <DashboardReminder {...propsToSend} />
          </div>
        </div>
        {category !== USER_CATEGORY.DOCTOR && (
          <div className="dashboard-bottom">
            <div className="appointment-section">
              <DashboardSurveys {...propsToSend} />
            </div>
            <div className="reminder-section">
              {/* <DashboardReminder {...propsToSend} /> */}
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default DashBoardHome;
