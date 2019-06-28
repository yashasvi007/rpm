import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { path } from "../../../constant";
import DashBoard from "../../Containers/DashBoard/index";
import BlankState from "../../Containers/BlankState";

export default class DashboardRoutes extends Component {
  render() {
    return (
      <Fragment>
        <Switch>
          <Route exact path={path.DASHBOARD.HOME} component={DashBoard} />
          <Route exact path={path.DASHBOARD.PROGRAMS} component={DashBoard} />
          <Route
            exact
            path={path.DASHBOARD.ONLY_CALENDAR}
            component={DashBoard}
          />
          <Route exact path={path.DASHBOARD.CALENDAR} component={DashBoard} />
          <Route exact path={path.DASHBOARD.DASHBOARD} component={DashBoard} />
          <Route
            exact
            path={path.DASHBOARD.ONLY_SURVEYS}
            component={DashBoard}
          />
          <Route exact path={path.DASHBOARD.SURVEYS} component={DashBoard} />
          <Route
            exact
            path={path.DASHBOARD.ONLY_MEDICALS}
            component={DashBoard}
          />
          <Route exact path={path.DASHBOARD.MEDICALS} component={DashBoard} />
          <Route path="" component={BlankState} />
        </Switch>
      </Fragment>
    );
  }
}
