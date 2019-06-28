// import React, { Component } from "react";
// import Calendar from "../../../../Containers/calendar";
// import AppointmentsHistory from "../../../../Containers/AppointmentsHistory";
//
// export class DashBoardCalendar extends Component {
//   componentDidMount() {
//     const {
//       user_data: {
//         basicInfo: { _id }
//       },
//       fetchAppointmentsHistory
//     } = this.props;
//     fetchAppointmentsHistory(_id);
//   }
//
//   render() {
//     const {
//       user_data: {
//         basicInfo: { _id }
//       }
//     } = this.props;
//     return (
//       <div className="my-calendar">
//         <div className="appointment-history">
//           <AppointmentsHistory id={_id} {...this.props} />
//         </div>
//         <div className="calendar-x">
//           <Calendar myCalendar={true} {...this.props} />
//         </div>
//       </div>
//     );
//   }
// }
//
// export default DashBoardCalendar;
