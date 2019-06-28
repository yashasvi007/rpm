import React, { Component } from "react";
import Calendar from "../../../Containers/Calendar";
import "../styles/style.less";

export class DashBoardCalendar extends Component {
  componentDidMount() {
    const {
      user_data: {
        basicInfo: { _id }
      },
      fetchAppointmentsHistory
    } = this.props;
    fetchAppointmentsHistory(_id);
  }

  goToAppointmentHistory = () => {
    this.props.history.push(`/appointment-history`);
  };

  render() {
    const {
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;
    return (
      <div className="my-calendar">
        <div className="calendar-component hide-scroll">
          <Calendar myCalendar={true} {...this.props} calendarUserId={_id} />
        </div>
        <div
          className="appointment-history-button"
          onClick={this.goToAppointmentHistory}
        >
          View Appointment History
        </div>
      </div>
    );
  }
}

export default DashBoardCalendar;
