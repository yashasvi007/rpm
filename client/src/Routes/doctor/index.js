import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { path } from "../../constant";
import EntityDetail from "../../Components/Detail";
import EditProfile from "../../Containers/page/editprofile";
import BlankState from "../../Containers/BlankState";

export default class DoctorRoute extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path={path.ENTITY.PROFILE} component={EntityDetail} />
          <Route
            exact
            path={path.ENTITY.EDIT_PROFILE}
            component={EditProfile}
          />
          <Route path="" component={BlankState} />
        </Switch>
      </Fragment>
    );
  }
}
