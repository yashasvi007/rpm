import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
//import Home from "../Components/Home";
import EditProfile from "../Containers/Page/editprofile";
import Myprofile from "../Containers/Page/myprofile";
// import CalendarSync from "../Components/CalendarSync";
import BlankState from "../Containers/BlankState";
// import ProfileSetup from "../Containers/page/profileSetup";
import SurveyDetail from "../Containers/survey/SurveyDetail";
import CreateSurvey from "../Containers/survey/Createsurvey";
// import PatientRoute from "./patient";
// import DoctorRoute from "./doctor";
import DashBoardRoute from "./dashboard";
import ArticleRoute from "./article";
import PatientRoute from "./patient";
import DoctorRoute from "./doctor";
import Questionnaire from "../Containers/Questionnaire";
// import SearchResult from "../Containers/SearchResult";
import ProgramDetails from "../Containers/ProgramDetails";
import ProgramSummary from "../Containers/ProgramDetails/summary";
import PatientResponse from "../Containers/PatientResponse";
import { path } from "../../constant";
import History from "../Containers/History";
// import RemoteConsulting from "../Containers/RemoteConsulting";

export default class Authenticated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirecting: this.props.authRedirection
    };
  }
  componentDidMount() {
    this.setState((prevState, prevProps) => {
      return {
        redirecting: false
      };
    });
  }

  // componentDidUpdate(prevProps,prevState){
  //   if(prevProps.authenticated !== this.props.authenticated){
  //     if(!prevProps.authenticated){

  //     }
  //   }
  // }

  render() {
    //
    return (
      <BrowserRouter>
        <Switch>
          {this.state.redirecting && this.state.redirecting.length > 0 && (
            <Redirect to={this.state.redirecting} />
          )}
          {this.props.unauthorizedError && (
            <Route path="" component={BlankState} />
          )}
          {/* <Route exact path={path.CALENDAR_SYNC} component={CalendarSync} />
          <Route exact path={path.PROFILE_SETUP} component={ProfileSetup} />
          <Route
            exact
            path={path.CREATESURVEYDETAIL}
            component={CreateSurvey}
          />
          <Route path={path.PATIENT_RESPONSE} component={PatientResponse} />
          <Route exact path={path.SEARCH} component={SearchResult} />
          <Route
            exact
            path={path.REMOTE_CONSULTING}
            component={RemoteConsulting}
          />*/}
          <Route path={"/patient"} component={PatientRoute} />
          <Route path={"/doctor"} component={DoctorRoute} />
          <Route exact path={path.MY_PROFILE} component={Myprofile} />
          <Route exact path={path.EDIT_PROFILE} component={EditProfile} />
          <Route path={path.PATIENT_RESPONSE} component={PatientResponse} />
          <Route exact path={path.PROGRAM_SUMMARY} component={ProgramSummary} />
          <Route exact path={path.PROGRAM_DETAILS} component={ProgramDetails} />
          <Route exact path={path.APPOINTMENT_HISTORY} component={History} />
          <Route
            exact
            path={path.CREATESURVEYDETAIL}
            component={CreateSurvey}
          />
          <Route
            exact
            path={path.PREVIEWQUESTIONNAIRE}
            component={Questionnaire}
          />
          <Route exact path={path.SURVEYDETAIL} component={SurveyDetail} />
          <Route path={path.ARTICLE.ROOT} component={ArticleRoute} />
          <Route path={path.DASHBOARD.DASHBOARD} component={DashBoardRoute} />

          <Route path="" component={BlankState} />
        </Switch>
      </BrowserRouter>
    );
  }
}
