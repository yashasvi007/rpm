import React, { Component, Fragment } from "react";
import AppHeader from "../../Containers/Header";
import "./style.less";

export default class BlankState extends Component {
  componentDidMount() {
    const {
      auth: { authenticated } = {},
      location: { pathname } = {}
    } = this.props;
    if (!authenticated) {
      //this.props.history.push(pathname);
      this.props.history.push("/sign-in", [pathname]);
    }
    //this.props.resetUnauthorizedError();
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (prevProps.unauthorizedError !== this.props.unauthorizedError) {
  //     this.props.resetUnauthorizedError();
  //   }
  // }

  goHome = e => {
    e.preventDefault();
    this.props.resetUnauthorizedError();
    this.props.history.push("/");
  };

  componentWillUnmount() {
    this.props.resetUnauthorizedError();
  }

  render() {
    return (
      <Fragment>
        <AppHeader />
        <div className="eror-page-container">
          {/* <img alt="error-page" src={blankState}></img> */}
          <div
            className="dark medium fontsize14 go-home-btn clickable"
            onClick={this.goHome}
          >
            Click Here to Go Home
          </div>
        </div>
      </Fragment>
    );
  }
}
