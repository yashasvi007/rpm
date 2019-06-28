import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { path } from "../../../constant";
import EntityDetail from "../../Components/Detail";
import EditProfile from "../../Containers/Page/editprofile";
import BlankState from "../../Containers/BlankState";

export default class PatientRoute extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route
            exact
            strict
            path={path.ENTITY.EDIT_PROFILE}
            render={props => <EditProfile {...props} />}
          />
          <Route
            exact
            path={path.ENTITY.PROFILE}
            render={props => <EntityDetail {...props} />}
          />
          <Route
            exact
            path={`${path.ENTITY.PROFILE}/:contentIs`}
            render={props => <EntityDetail {...props} />}
          />
          <Route path="" component={BlankState} />
        </Switch>
      </Fragment>
    );
  }
}
