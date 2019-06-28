import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import BrowserRouter from "react-router-dom/es/BrowserRouter";

import Routes from "./Containers/Routes";
import EventModal from "./Containers/Modal/event";
import AddPatients from "./Containers/Modal/addPatient";
import AddDoctor from "./Containers/Modal/addDoctor";
import AdverseEventsModal from "./Containers/Modal/adverseEvent";
import ChangePasswordModal from "./Containers/Modal/changePassword";
import EndSurvey from "./Containers/Modal/endSurvey";
import CancelModal from "./Containers/Modal/cancelEvent";
import DischargePatient from "./Containers/Modal/dischargePatient";
import "./style.less";
import DocumentVerificationModal from "./Containers/Modal/documentVerification";
class MobileAppWrapper extends Component {
  render() {
    // const { isModalVisible } = this.props;
    console.log("mobileAppWrapper");
    return (
      <BrowserRouter>
        <Fragment>
          <div className="m">
            <Routes />
            <EventModal />
            <AddPatients />
            <AddDoctor />
            <AdverseEventsModal />
            <ChangePasswordModal />
            <EndSurvey />
            <CancelModal />
            <DischargePatient />
            <DocumentVerificationModal />
          </div>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default injectIntl(MobileAppWrapper);
