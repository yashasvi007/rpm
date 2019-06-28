import React, { Component, Fragment } from "react";
import AppHeader from "../../Containers/Header";
import Patient from "../../Containers/Detail/PatientProfile";
import CommonSuccessMsg from "../../Containers/CommonSuccessMsg";
import "./style.less";

class Detail extends Component {
  render() {
    const { id } = this.props.match.params;
    return (
      <Fragment>
        <AppHeader />
        <div className="patient-details-wrapper">
          <Patient id={id} />
        </div>
        <CommonSuccessMsg className={"profile-success-msg"} />
      </Fragment>
    );
  }
}

export default Detail;
