import React, { Component, Fragment } from "react";
import AppHeader from "../../Containers/Header";
import Patient from "../../Containers/PatientProfile";
import Doctor from "../../Containers/doctorProfile";
import { ENTITY } from "../../constant";
import CommonSuccessMsg from "../../Containers/CommonSuccessMsg";

import "./style.less";

class Detail extends Component {
  getCurrentComponent = () => {
    const { entity, id, contentIs = "Calendar" } = this.props.match.params;
    switch (entity) {
      case ENTITY.PATIENT:
        return <Patient id={id} contentIs={contentIs} />;
      case ENTITY.DOCTOR:
        return <Doctor id={id} />;
      default:
        return null;
    }
  };

  render() {
    const { getCurrentComponent } = this;
    return (
      <Fragment>
        <AppHeader />
        {getCurrentComponent()}
        <CommonSuccessMsg className={"profile-success-msg"} />
      </Fragment>
    );
  }
}

export default Detail;
