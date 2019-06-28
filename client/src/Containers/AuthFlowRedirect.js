import React, { Component } from "react";
import axios from "axios";
import { Route, withRouter } from "react-router-dom";
import MemberLogin from "../Components/MemberLogin";
// import ProviderLogin from "../Components/ProviderLogin";
import MemberHome from "../Components/MemberHome";
import SearchProvider from "../Components/SearchProvider";
import ScheduleAppointment from "../Components/ScheduleAppointment";
import DocumentUpload from "../Components/DocumentUpload";
import ConfirmAppointment from "../Components/ConfirmAppointment";
// import ProviderHome from "../Components/ProviderHome";
import MemberConsultation from "../Components/MemberConsultation";
import ConsultationScreen from "../Components/ConsultationScreen";

class AuthFlowRedirect extends Component {
  componentDidMount() {
    this.checkMemberLoggedIn();
  }

  async checkMemberLoggedIn() {
    let response = await axios.get("/api/fetchLoggedInMember");
    let loggedInMember = response.data;

    if (!loggedInMember.err) {
      if (this.props.location.pathname == "/login") {
        this.props.history.push("/member/home");
      } else {
        this.props.history.push(this.props.location.pathname);
      }
    } else {
      this.props.history.push("/member/login");
    }
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <Route path="/member/login" component={MemberLogin} />
        {/* <Route path="/providerLogin" component={ProviderLogin} />
        <Route path="/providerHome" component={ProviderHome} /> */}
        <Route path="/member/home" component={MemberHome} />
        <Route path="/member/search" component={SearchProvider} />
        <Route
          path="/member/scheduleAppointment"
          component={ScheduleAppointment}
        />
        <Route path="/member/documentUpload" component={DocumentUpload} />
        <Route
          path="/member/confirmAppointment"
          component={ConfirmAppointment}
        />
        <Route path="/member/consultation" component={MemberConsultation} />
        <Route
          path="/member/consultationScreen"
          component={ConsultationScreen}
        />
      </div>
    );
  }
}

export default withRouter(AuthFlowRedirect);
