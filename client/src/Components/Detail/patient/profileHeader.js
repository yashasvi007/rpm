import React, { Component } from "react";
import { Dropdown, Menu, Button, Popconfirm } from "antd";
import isEmpty from "lodash-es/isEmpty";
import { injectIntl } from "react-intl";
import GoBack from "../../../Assets/images/ico-back.svg";
import {
  USER_CATEGORY,
  MEDICALS_OPTIONS,
  MODE,
  PATIENT_PROFILE_TAB,
  USER_STATUS
} from "../../../constant";
import messages from "./message";

const EDIT = "EDIT";
const ADD = "ADD";
class ProfileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toBeEditedId: "",
      testSelected: ""
    };
  }
  //  ======================================Medication Model functions=============================================

  handleOnMedicationUpdate = id => {
    this.setState(
      (prevState, props) => ({
        toBeEditedId: id
      }),
      () => {
        this.handleOpenMedicationModal(EDIT);
      }
    );
  };

  handleOpenMedicationModal = purpose => {
    const {
      openMedication,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;
    const { toBeEditedId } = this.state;
    //
    openMedication(_id, purpose, toBeEditedId);
  };

  getMedicationDropDownMenu = () => {
    const { medications_data, id, products_data } = this.props;

    const medication = medications_data[id] ? medications_data[id] : [];

    let medicines = [];
    if (medication.hasOwnProperty("userId")) {
      medicines = medication.medicine;
    }

    //
    let productsData = [];
    if (products_data) {
      productsData = Object.values(products_data);
    }
    let usedProduct = [];
    if (medicines) {
      const { updatedAt, ...medicine } = medicines;
      usedProduct = Object.keys(medicine);
    }
    const UpdateMenu = productsData.filter(product => {
      return usedProduct.includes(product._id);
    });
    //
    return UpdateMenu;
  };

  //  ======================================ClinicalReading Model functions=======================================

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

  //  ======================================Getting the button in profile headers functions=========================

  getButtons = (currentMedicalField, isDisabled) => {
    const {
      onClick,
      intl: { formatMessage }
    } = this.props;
    const {
      getMedicationDropDownMenu,
      handleOnMedicationUpdate,
      handleOpenClinicalReadingModal,
      handleOpenMedicationModal,
      getCLinicalReadingDropDownMenu,
      handleOnCLinicalReadingUpdate,
      handleClickMedicationViewHistory
    } = this;

    const updateMedicationMenu = getMedicationDropDownMenu();
    const Medicationmenus = (
      <Menu>
        {updateMedicationMenu.map(menu => {
          return (
            <Menu.Item
              key={menu._id}
              onClick={e => handleOnMedicationUpdate(menu._id)}
            >
              {menu.name}
            </Menu.Item>
          );
        })}
      </Menu>
    );

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
    //  ======================================BASIC=====================================================
    if (currentMedicalField === MEDICALS_OPTIONS.BASIC) {
      return (
        <Button
          onClick={e => onClick(MODE.WRITE)}
          className="iqvia-btn"
          type="primary"
          disabled={isDisabled}
        >
          {formatMessage(messages.updateBasic)}
        </Button>
      );
    }

    //  ======================================VITALS=====================================================

    if (currentMedicalField === MEDICALS_OPTIONS.VITAL) {
      const { medicals_data } = this.props;
      const { vitals } = medicals_data;
      return (
        <div className="flex">
          {!isEmpty(vitals) && (
            <Button
              type="primary"
              className="iqvia-btn mr16"
              ghost
              onClick={this.handleClickVitalsViewHistory}
            >
              {formatMessage(messages.viewHistory)}
            </Button>
          )}
          <Button
            onClick={e => onClick(MODE.WRITE)}
            className="iqvia-btn"
            type="primary"
            disabled={isDisabled}
          >
            {formatMessage(messages.updateVital)}
          </Button>
        </div>
      );
    }

    //  ======================================CLINICAL READING=====================================================

    if (currentMedicalField === MEDICALS_OPTIONS.CLINICALREADING) {
      return (
        <div className="flex">
          {updateClinicalReadingMenu.length > 0 && (
            <Button
              type="primary"
              className="iqvia-btn mr16"
              ghost
              onClick={this.handleClickClinicalViewHistory}
            >
              {formatMessage(messages.viewHistory)}
            </Button>
          )}
          <Button
            type="primary"
            className="iqvia-btn mr16"
            ghost
            disabled={isDisabled}
            onClick={e => {
              e.preventDefault();
              handleOpenClinicalReadingModal(ADD);
            }}
          >
            {formatMessage(messages.addNewReading)}
          </Button>
          {updateClinicalReadingMenu.length > 0 && (
            <Dropdown trigger={["click"]} overlay={ClinicalReadingMenus}>
              <Button
                type="primary"
                className="iqvia-btn"
                disabled={isDisabled}
              >
                {formatMessage(messages.updateReading)}
              </Button>
            </Dropdown>
          )}
        </div>
      );
    }

    //  ======================================MEDICATION=====================================================

    if (currentMedicalField === MEDICALS_OPTIONS.MEDICATION) {
      return (
        <div className="flex">
          {updateMedicationMenu.length > 0 && (
            <Button
              type="primary"
              ghost
              className="mr16 iqvia-btn"
              onClick={handleClickMedicationViewHistory}
            >
              {formatMessage(messages.viewHistory)}
            </Button>
          )}
          <Button
            type="primary"
            ghost
            className="mr16 iqvia-btn"
            disabled={isDisabled}
            onClick={e => {
              e.preventDefault();

              handleOpenMedicationModal(ADD);
            }}
          >
            {formatMessage(messages.addNewMedication)}
          </Button>
          {updateMedicationMenu.length > 0 && (
            <Dropdown trigger={["click"]} overlay={Medicationmenus}>
              <Button
                type="primary"
                className="iqvia-btn"
                disabled={isDisabled}
              >
                {formatMessage(messages.updateMedication)}
              </Button>
            </Dropdown>
          )}
        </div>
      );
    }

    //  ======================================ADVERSE EVENT=====================================================

    if (currentMedicalField === MEDICALS_OPTIONS.ADVERSEEVENTS) {
      const { onReportEvent } = this;

      return (
        <Button
          type="primary"
          className="iqvia-btn"
          disabled={isDisabled}
          onClick={onReportEvent}
        >
          {formatMessage(messages.reportAnEvent)}
        </Button>
      );
    }
  };

  onAddAppointment = e => {
    e.preventDefault();
    const {
      user_data: {
        basicInfo: { _id }
      },
      addEditAppointmentReminder
    } = this.props;
    addEditAppointmentReminder(null, _id, null);
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

  //  ===============================================render===========================================

  render() {
    const {
      intl: { formatMessage },
      ChangeContent,
      mode,
      currentMedicalField,
      contentIs,
      handleOnSubmit,
      handleVisibleChange,
      allowContentChange,
      ConfirmPopUp,
      CancelPopUp,
      PopupVisisble,
      handleGoBack,
      inactiveClass,
      user_data: { status: openedUserStatus, basicInfo = {} },
      currentUser: { basicInfo: { category = {} } = {} } = {}
    } = this.props;

    const isDisabled = openedUserStatus !== USER_STATUS.ENROLLED ? true : false;

    const { onAddAppointment } = this;

    let name = "";
    if (!isEmpty(basicInfo)) {
      const { name: patientName = "" } = basicInfo;
      name = patientName;
    }
    // (
    //   "///////////////////////////////",
    //   contentIs,
    //   allowContentChange,
    //   PopupVisisble,
    //   mode,
    //   "///////////////////////////"
    // );
    const Buttons =
      category === USER_CATEGORY.CARE_COACH
        ? this.getButtons(currentMedicalField, isDisabled)
        : null;
    return (
      <div className="profileHead">
        <div className="flex justify-content-space-between h100">
          <div className="flex align-items-center">
            <img
              alt=""
              src={GoBack}
              className="backButton clickable"
              onClick={handleGoBack}
            />
            <span className="previousLocation">
              {name} {formatMessage(messages.details)}
            </span>
          </div>
          {category === USER_CATEGORY.CARE_COACH &&
            (contentIs === PATIENT_PROFILE_TAB.MEDICAL_DETAILS ? (
              <div
                className={`UpdateBasics ${
                  isDisabled ? "inactive-patient" : ""
                }`}
              >
                {mode === MODE.WRITE ? (
                  <Button
                    type="primary"
                    disabled={isDisabled}
                    onClick={e => {
                      handleOnSubmit();
                    }}
                  >
                    {formatMessage(messages.save)}
                  </Button>
                ) : (
                  Buttons
                )}
              </div>
            ) : (
              <div className={`UpdateBasics ${inactiveClass}`}>
                <Button
                  type="primary"
                  className="iqvia-btn"
                  onClick={onAddAppointment}
                  disabled={isDisabled}
                >
                  {formatMessage(messages.addAppointment)}
                </Button>
              </div>
            ))}
        </div>
        {category === USER_CATEGORY.CARE_COACH && (
          <div className="MenuOption">
            <Menu mode="horizontal" selectedKeys={[`${contentIs}`]}>
              <Menu.Item
                className="fontsize14 bold"
                key="Calendar"
                onClick={e => ChangeContent(formatMessage(messages.Calendar))}
              >
                {allowContentChange ? (
                  <div> {formatMessage(messages.Calendar)}</div>
                ) : (
                  <Popconfirm
                    title="If you switch now your changes won't be saved. Are you sure you want to switch? "
                    onConfirm={ConfirmPopUp}
                    onCancel={CancelPopUp}
                    visible={PopupVisisble}
                    onVisibleChange={handleVisibleChange}
                    okText="Yes"
                    cancelText="No"
                    className="popup"
                  >
                    <div
                      onClick={e =>
                        ChangeContent(formatMessage(messages.Calendar))
                      }
                    >
                      {formatMessage(messages.Calendar)}
                    </div>
                  </Popconfirm>
                )}
              </Menu.Item>
              <Menu.Item
                className="fontsize14  bold"
                key="Medical-Details"
                onClick={e =>
                  ChangeContent(formatMessage(messages.MedicalDetails))
                }
              >
                <div>{formatMessage(messages.MedicalDetails)}</div>
              </Menu.Item>
            </Menu>
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(ProfileHeader);
