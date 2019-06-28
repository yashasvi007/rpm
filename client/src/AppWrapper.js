import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Routes from "./Containers/Routes";
import EventModal from "./Containers/modal/event";
import DischargePatientModal from "./Containers/modal/dischargePatient";
import HistoricalClinicalReading from "./Containers/modal/historicalClinicalReading";
import HistoricalVitalsReading from "./Containers/modal/historicalVitalsReading";
import HistoricalMedicationData from "./Containers/modal/historicalMedicationData";
import CancelModal from "./Containers/modal/cancelEvent";
import DocumentVerificationModal from "./Containers/modal/documentVerification";
import AdverseEventsModal from "./Containers/modal/adverseEvent";
import MedicationModal from "./Containers/modal/Medication";
import ChangePassword from "./Containers/modal/changePassword";
import ClinicalReadingModal from "./Containers/modal/ClinicalReading";
import EndSurveyModal from "./Containers/modal/endSurvey";
import AdverseEventsImageModal from "./Containers/modal/adverseEventImage";
import BrowserRouter from "react-router-dom/es/BrowserRouter";
import CommonSuccessMsg from "./Containers/CommonSuccessMsg";

class AppWrapper extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <Routes />
          <Fragment>
            <CommonSuccessMsg />
            <EventModal />
            <DischargePatientModal />
            <HistoricalClinicalReading />
            <CancelModal />
            <MedicationModal />
            <AdverseEventsModal />
            <ClinicalReadingModal />
            <DocumentVerificationModal />
            <HistoricalVitalsReading />
            <HistoricalMedicationData />
            <ChangePassword />
            <EndSurveyModal />
            <AdverseEventsImageModal />
          </Fragment>
        </Fragment>
      </BrowserRouter>
    );
  }
}

export default injectIntl(AppWrapper);
