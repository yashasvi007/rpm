import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Tabs, message, Button, Menu, Dropdown } from "antd";
import isEmpty from "lodash-es/isEmpty";
import BasicForm from "./Basic";
import VitalForm from "./Vital";
import MedicationForm from "./medication";
import ClinicalReadingForm from "./ClinicalReading";
import AdverseEvent from "../../../../Containers/AdverseEvent";
import messages from "../message";
import Output from "./prescription";
import {
  MEDICALS_OPTIONS,
  MODE,
  PATIENTDASHBOARD,
  USER_STATUS
} from "../../../../constant";

const TabPane = Tabs.TabPane;
const ADD = "ADD";
const EDIT = "EDIT";
class MedicalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1,
      testSelected: ""
    };
  }

  confirm = e => {
    //
    message.success("Click on Yes");
  };

  cancel = e => {
    //
    message.error("Click on No");
  };

  handleClickMedicationViewHistory = e => {
    e.preventDefault();
    const {
      openMedicationData,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;
    //
    openMedicationData(_id);
  };

  handleClickClinicalViewHistory = e => {
    e.preventDefault();
    const {
      openHistoricalClinicalData,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;
    //
    openHistoricalClinicalData(_id);
  };

  handleClickVitalsViewHistory = e => {
    e.preventDefault();
    const {
      openVitalsData,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;
    //
    openVitalsData(_id);
  };

  handleOnCLinicalReadingUpdate = test => {
    this.setState(
      (prevState, props) => ({
        purpose: "edit",
        testSelected: test
      }),
      () => {
        this.handleOpenClinicalReadingModal(EDIT);
      }
    );
  };

  handleOpenClinicalReadingModal = purpose => {
    const {
      openClinicalReading,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;
    //
    const { testSelected } = this.state;
    openClinicalReading(_id, purpose, testSelected);
  };

  getCLinicalReadingDropDownMenu = () => {
    const { medicals_data } = this.props;
    let testTaken = [];

    if (medicals_data) {
      const { clinicalReadings } = medicals_data;
      if (clinicalReadings) {
        testTaken = Object.keys(clinicalReadings);
      }
      //
    }
    return testTaken;
  };

  onReportEvent = e => {
    e.preventDefault();
    const {
      user_data: {
        basicInfo: { _id }
      },
      reportAdverseEvent
    } = this.props;
    reportAdverseEvent(_id);
  };

  getViewHistoryButton = () => {
    const {
      mode,
      currentMedicalField,
      intl: { formatMessage },
      handleOnUpdate,
      handleOnSubmit,
      user_data: { status = "" }
    } = this.props;
    const {
      handleClickClinicalViewHistory,
      handleClickMedicationViewHistory,
      handleClickVitalsViewHistory,
      getCLinicalReadingDropDownMenu,
      handleOnCLinicalReadingUpdate,
      handleOpenClinicalReadingModal,
      onReportEvent
    } = this;

    const updateClinicalReadingMenu = getCLinicalReadingDropDownMenu();
    //
    const ClinicalReadingMenus = (
      <Menu>
        {updateClinicalReadingMenu.map(menu => {
          return (
            <Menu.Item
              key={menu}
              onClick={e => handleOnCLinicalReadingUpdate(menu)}
            >
              {menu}
            </Menu.Item>
          );
        })}
      </Menu>
    );

    switch (currentMedicalField) {
      case MEDICALS_OPTIONS.BASIC:
        if (mode === MODE.READ) {
          return (
            <Button
              type="primary"
              className="mr16 iqvia-btn"
              disabled={
                status === USER_STATUS.INACTIVE ||
                status === USER_STATUS.DISCHARGED
              }
              onClick={e => handleOnUpdate(MODE.WRITE)}
            >
              {formatMessage(messages.updateBasic)}
            </Button>
          );
        } else {
          return (
            <Button
              type="primary"
              className="mr16 iqvia-btn"
              onClick={handleOnSubmit}
            >
              {formatMessage(messages.save)}
            </Button>
          );
        }
      case MEDICALS_OPTIONS.VITAL:
        if (mode === MODE.READ) {
          const { medicals_data } = this.props;
          const { vitals } = medicals_data;
          return (
            <Fragment>
              <Button
                type="primary"
                className="mr16 iqvia-btn"
                disabled={
                  status === USER_STATUS.INACTIVE ||
                  status === USER_STATUS.INACTIVE
                }
                onClick={e => handleOnUpdate(MODE.WRITE)}
              >
                {formatMessage(messages.updateVital)}
              </Button>

              {!isEmpty(vitals) && (
                <Button
                  type="primary"
                  className="iqvia-btn mr16"
                  ghost
                  disabled={
                    status === USER_STATUS.INACTIVE ||
                    status === USER_STATUS.INACTIVE
                  }
                  onClick={handleClickVitalsViewHistory}
                >
                  {formatMessage(messages.viewHistory)}
                </Button>
              )}
            </Fragment>
          );
        } else {
          return (
            <Button
              type="primary"
              className="mr16 iqvia-btn"
              onClick={handleOnSubmit}
            >
              {formatMessage(messages.save)}
            </Button>
          );
        }
      case MEDICALS_OPTIONS.CLINICALREADING:
        return (
          <div className="flex">
            <Button
              type="primary"
              className="iqvia-btn mr16"
              ghost
              disabled={
                status === USER_STATUS.INACTIVE ||
                status === USER_STATUS.INACTIVE
              }
              onClick={handleClickClinicalViewHistory}
            >
              {formatMessage(messages.viewHistory)}
            </Button>

            <Button
              type="primary"
              className="iqvia-btn mr16"
              ghost
              disabled={
                status === USER_STATUS.INACTIVE ||
                status === USER_STATUS.INACTIVE
              }
              onClick={e => {
                e.preventDefault();
                handleOpenClinicalReadingModal(ADD);
              }}
            >
              {formatMessage(messages.addNewReading)}
            </Button>
            {updateClinicalReadingMenu.length > 0 && (
              <Dropdown
                trigger={["click"]}
                overlay={ClinicalReadingMenus}
                disabled={
                  status === USER_STATUS.INACTIVE ||
                  status === USER_STATUS.INACTIVE
                }
              >
                <Button type="primary" className="mr16 iqvia-btn">
                  {formatMessage(messages.updateReading)}
                </Button>
              </Dropdown>
            )}
          </div>
        );
      case MEDICALS_OPTIONS.MEDICATION: {
        return (
          <Fragment>
            {!isEmpty(this.props.medications_data) && (
              <Button
                type="primary"
                ghost
                className="mr16 iqvia-btn"
                disabled={
                  status === USER_STATUS.INACTIVE ||
                  status === USER_STATUS.INACTIVE
                }
              >
                <Output {...this.props} />
              </Button>
            )}
            <Button
              type="primary"
              ghost
              className="mr16 iqvia-btn"
              disabled={
                status === USER_STATUS.INACTIVE ||
                status === USER_STATUS.INACTIVE
              }
              onClick={handleClickMedicationViewHistory}
            >
              {formatMessage(messages.viewHistory)}
            </Button>
          </Fragment>
        );
      }
      case MEDICALS_OPTIONS.ADVERSEEVENTS:
        return (
          <div className="flex">
            <Button
              type="primary"
              className="mr16 iqvia-btn"
              onClick={onReportEvent}
              disabled={
                status === USER_STATUS.INACTIVE ||
                status === USER_STATUS.INACTIVE
              }
            >
              {formatMessage(messages.reportAnEvent)}
            </Button>
          </div>
        );
      default:
        return "";
    }
  };

  render() {
    const {
      medicals_data,
      mode,
      intl: { formatMessage },
      ChangeMedicalField,
      currentMedicalField,
      setVitalRef,
      setBasicRef,
      setMedicationRef,
      products_data,
      medications_data,
      programId,
      setClinicalReadingRef,
      clinicalTestTemplates,
      id,
      adverseEvent,
      events,
      pageIs
    } = this.props;
    const {
      basicCondition,
      clinicalReadings,
      vitals,
      updatedAt
    } = medicals_data;

    const { getViewHistoryButton } = this;

    const viewHistoryButton =
      pageIs === PATIENTDASHBOARD ? getViewHistoryButton() : "";
    return (
      <Tabs
        defaultActiveKey={currentMedicalField}
        onChange={ChangeMedicalField}
        tabBarStyle={{ fontFamily: "AvenirNext-Medium", color: "#7f888d" }}
        className="medicalTabs fontsize14 "
        // activeKey={currentMedicalField}
        tabBarExtraContent={viewHistoryButton}
      >
        <TabPane
          tab={formatMessage(messages.Basic)}
          disabled={
            mode === MODE.WRITE &&
            currentMedicalField !== MEDICALS_OPTIONS.BASIC
          }
          key={MEDICALS_OPTIONS.BASIC}
        >
          <BasicForm
            basicCondition={basicCondition}
            mode={mode}
            pageIs={pageIs}
            wrappedComponentRef={setBasicRef}
          />
        </TabPane>

        <TabPane
          tab={formatMessage(messages.Vital)}
          disabled={
            mode === MODE.WRITE &&
            currentMedicalField !== MEDICALS_OPTIONS.VITAL
          }
          key={MEDICALS_OPTIONS.VITAL}
        >
          <VitalForm
            vitals={vitals}
            updatedAt={updatedAt}
            mode={mode}
            pageIs={pageIs}
            wrappedComponentRef={setVitalRef}
          />
        </TabPane>

        <TabPane
          tab={formatMessage(messages.ClinicalReading)}
          disabled={
            mode === MODE.WRITE &&
            currentMedicalField !== MEDICALS_OPTIONS.CLINICAL_READING
          }
          key={MEDICALS_OPTIONS.CLINICALREADING}
        >
          <ClinicalReadingForm
            mode={mode}
            clinicalReadings={clinicalReadings}
            programId={programId}
            clinicalTestTemplates={clinicalTestTemplates}
            wrappedComponentRef={setClinicalReadingRef}
            pageIs={pageIs}
          />
        </TabPane>
        <TabPane
          tab={formatMessage(messages.Medication)}
          disabled={
            mode === MODE.WRITE &&
            currentMedicalField !== MEDICALS_OPTIONS.MEDICATION
          }
          key={MEDICALS_OPTIONS.MEDICATION}
        >
          <MedicationForm
            products_data={products_data}
            mode={mode}
            wrappedComponentRef={setMedicationRef}
            medications_data={medications_data}
            id={id}
            pageIs={pageIs}
          />
        </TabPane>
        <TabPane
          tab={formatMessage(messages.AdverseEvent)}
          disabled={
            mode === MODE.WRITE &&
            currentMedicalField !== MEDICALS_OPTIONS.ADVERSE_EVENTS
          }
          key={MEDICALS_OPTIONS.ADVERSEEVENTS}
        >
          <AdverseEvent
            adverseEvent={adverseEvent}
            events={events}
            products={products_data}
            userId={id}
          />
        </TabPane>
      </Tabs>
    );
  }
}

export default injectIntl(MedicalDetails);
