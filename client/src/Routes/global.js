import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import landingPage from "../Components/landingPage";
import Signup from "../Containers/Invite";
import Identify from "../Components/forgotPassword/Identify";
import ForgotPassword from "../Components/forgotPassword";
import ResetPassword from "../Containers/ResetPassword";
import SignIn from "../Containers/SignIn";
import BlankState from "../Containers/BlankState";
import { path } from "../constant";

export default class Global extends Component {
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

  render() {
    return (
      <BrowserRouter>
        <Switch>
          {this.state.redirecting && <Redirect to={this.state.redirecting} />}
          <Route exact path={path.SIGN_IN} component={SignIn} />
          <Route exact path={path.FORGOT_PASSWORD} component={ForgotPassword} />
          <Route exact path={path.IDENTIFY} component={Identify} />
          <Route exact path={path.SIGN_UP} component={Signup} />
          <Route exact path={path.RESET_PASSWORD} component={ResetPassword} />
          <Route exact path={path.LANDING_PAGE} component={landingPage} />
          <Route path="" component={BlankState} />
        </Switch>
      </BrowserRouter>
    );
  }
}
