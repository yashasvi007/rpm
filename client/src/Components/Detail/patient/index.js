import React, { Component, Fragment } from "react";
import { Row, Col } from "antd";
import moment from "moment";
import isEmpty from "lodash-es/isEmpty";
import ProfileHeader from "./profileHeader";
import PateintDetail from "./patientDetail";
import MedicalDetails from "./medicalDetails/medicalDetails";
import Calendar from "../../../Containers/calendar";
import AppointmentsHistory from "../../../Containers/AppointmentsHistory";
import {
  ENTITY,
  USER_CATEGORY,
  MODE,
  MEDICALS_OPTIONS,
  USER_STATUS,
  PATIENT_PROFILE_TAB
} from "../../../constant";
import "../style.less";

const MEDICALDETAILS = "Medical-Details";
class PatientProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      medicalConditionId: "",
      contentIs: "",
      currentMedicalField: MEDICALS_OPTIONS.BASIC,
      mode: MODE.READ,
      allowContentChange: true,
      PopupVisisble: true,
      isLoading: true
    };
  }
  componentDidMount() {
    const {
      id,
      currentUser: { basicInfo: { category } = {} } = {},
      contentIs
    } = this.props;

    window.scrollTo(0, 0);
    this.setState({ userId: id });

    this.props.fetchPatient(id).then(status => {
      this.setState({ isLoading: !status });
    });
    if (category === USER_CATEGORY.CARE_COACH) {
      this.props.fetchAppointmentsHistory(id);
      this.props.fetchAdverseEvent(id);
    }
    if (contentIs === PATIENT_PROFILE_TAB.MEDICAL_DETAILS) {
      this.setState({ contentIs: PATIENT_PROFILE_TAB.MEDICAL_DETAILS });
    } else {
      this.setState({ contentIs: contentIs });
    }
    const { history = {} } = this.props;
    const {
      location: { state }
    } = history;
    if (state) {
      this.setState({
        currentMedicalField: state.currentMedicalField
      });
    }

    window.scrollTo(0, 0);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.is_loading !== prevProps.is_loading) {
      this.setState({ medicalConditionId: this.props.medicals_data._id });
      const { contentIs } = this.props;
      if (contentIs === MEDICALDETAILS) {
        this.setState({ contentIs: MEDICALDETAILS });
      } else {
        this.setState({ contentIs: contentIs });
      }
    }
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const { id: newUserId } = this.props.match.params;
      this.props.fetchPatient(newUserId);

      const {
        id,
        currentUser: { basicInfo: { category } = {} } = {},
        contentIs
      } = this.props;

      this.setState({ userId: id });

      if (category === USER_CATEGORY.CARE_COACH) {
        this.props.fetchAppointmentsHistory(id);
        this.props.fetchAdverseEvent(id);
      }
      if (contentIs === PATIENT_PROFILE_TAB.MEDICAL_DETAILS) {
        this.setState({ contentIs: PATIENT_PROFILE_TAB.MEDICAL_DETAILS });
      } else {
        this.setState({ contentIs: contentIs });
      }
      const { history = {} } = this.props;
      const {
        location: { state }
      } = history;
      if (state) {
        this.setState({
          currentMedicalField: state.currentMedicalField
        });
      }
    }
    if (
      this.props.match.params.contentIs !== prevProps.match.params.contentIs
    ) {
      const { contentIs } = this.props.match.params;
      if (contentIs) {
        this.setState({ contentIs: contentIs });
        const { history = {} } = this.props;
        const {
          location: { state }
        } = history;
        if (state) {
          this.setState({
            currentMedicalField: state.currentMedicalField
          });
        }
      }
    }
  }

  ChangeContent = value => {
    const { mode } = this.state;
    if (mode === MODE.READ) {
      this.setState({
        allowContentChange: true
      });
      const { id } = this.props;
      if (value === PATIENT_PROFILE_TAB.CALENDAR) {
        this.setState({ contentIs: value });
        this.props.history.replace(`/${ENTITY.PATIENT}/${id}`);
      } else {
        this.props.history.replace(`/${ENTITY.PATIENT}/${id}/Medical-Details`);
      }
    } else {
      this.setState({
        allowContentChange: false
      });
    }
  };

  handleGoBack = e => {
    e.preventDefault();
    const { history } = this.props;

    history.goBack();
  };

  ConfirmPopUp = () => {
    const { id } = this.props;
    this.setState(
      {
        mode: MODE.READ,
        contentIs: PATIENT_PROFILE_TAB.CALENDAR,
        allowContentChange: true,
        PopupVisisble: false
      },
      () => {
        this.props.history.replace(`/${ENTITY.PATIENT}/${id}`);
      }
    );
  };

  CancelPopUp = () => {
    this.setState({
      contentIs: MEDICALDETAILS,
      PopupVisisble: false
    });
  };

  handleVisibleChange = () => {
    const { PopupVisisble } = this.state;

    if (!PopupVisisble) {
      this.setState({ PopupVisisble: true });
    }
  };

  setBasicRef = ref => {
    this.BasicformRef = ref;
  };

  setVitalRef = ref => {
    this.VitalformRef = ref;
  };

  handleOnSubmit = () => {
    const { currentMedicalField, medicalConditionId, userId } = this.state;
    let form = "";
    if (currentMedicalField === MEDICALS_OPTIONS.BASIC) {
      form = this.BasicformRef.props.form;
    } else if (currentMedicalField === MEDICALS_OPTIONS.VITAL) {
      form = this.VitalformRef.props.form;
    } else if (currentMedicalField === MEDICALS_OPTIONS.MEDICATION) {
      form = this.MedicationformRef.props.form;
    } else if (currentMedicalField === MEDICALS_OPTIONS.CLINICAL_READING) {
      form = this.ClinicalReadingformRef.props.form;
    }
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      switch (currentMedicalField) {
        case MEDICALS_OPTIONS.BASIC: {
          const { allergies, surgeriesOrFracture, others } = values;
          const dataToSave = {
            ...values,
            allergies: allergies.join(","),
            surgeriesOrFracture: surgeriesOrFracture.join(","),
            others: others.join(",")
          };
          this.props.saveBasicConditionData(
            medicalConditionId,
            dataToSave,
            userId
          );
          break;
        }
        case MEDICALS_OPTIONS.VITAL: {
          let fieldValues = Object.keys(values);
          let isSaveValid = fieldValues.filter(
            value => !isEmpty(values[value])
          );
          if (isSaveValid.length > 1) {
            const updateAt = moment().format();
            values.updatedAt = updateAt;
            const vital = values;
            this.props.addVitalData(medicalConditionId, vital, userId);
          }
          break;
        }
        case MEDICALS_OPTIONS.CLINICAL_READING: {
          this.props.UpdateClinicalReadingData(
            medicalConditionId,
            values,
            userId
          );
          break;
        }
        case MEDICALS_OPTIONS.MEDICATION:
          {
            const updateAt = moment().format();
            values.updatedAt = updateAt;
            values.userId = userId;
            const { medicine: medicines } = values;
            const lasteelment = medicines[medicines.length - 1];

            if (
              lasteelment.product_id === "" ||
              lasteelment.product_id === null
            ) {
              values.medicine.pop();
            }
            let medication = values;
            this.props.addMedication(medication, userId);
          }
          break;

        default:
      }

      form.resetFields();
      this.setState({ visible: false });
    });
    this.setState({ mode: MODE.READ });
  };

  ChangeMedicalField = key => {
    this.setState({ currentMedicalField: key });
  };

  onUpdate = value => {
    this.setState({ mode: value });
  };

  onEditProfile = () => {
    const { history, id } = this.props;
    history.push(`/${ENTITY.PATIENT}/${id}/edit`);
  };

  render() {
    const {
      medicals_data = {},
      products_data,
      medications_data,
      id,
      clinicalTestTemplates_data,
      user_data,
      adverseEvent,
      events,
      // is_data_loaded,
      currentUser: { basicInfo: { category } = {} } = {}
    } = this.props;
    const {
      contentIs,
      mode,
      currentMedicalField,
      allowContentChange,
      PopupVisisble,
      isLoading
    } = this.state;
    const { status } = user_data;
    const inactiveClass =
      status === USER_STATUS.INACTIVE || status === USER_STATUS.DISCHARGED
        ? "inactive-patient"
        : "";

    const {
      onUpdate,
      ConfirmPopUp,
      CancelPopUp,
      ChangeMedicalField,
      handleVisibleChange,
      handleOnSubmit,
      setBasicRef,
      setVitalRef,
      setClinicalReadingRef,
      setMedicationRef,
      onEditProfile,
      handleGoBack,
      ChangeContent
    } = this;

    let programId = "";
    if (user_data) {
      const { programIds } = user_data;
      if (programIds) {
        programId = programIds[0].id;
      }
    }
    let clinicalReadingsLength = 0;

    if (medicals_data) {
      const { clinicalReadings } = medicals_data;
      if (clinicalReadings) {
        clinicalReadingsLength = 1;
      }
    }
    return (
      <Fragment>
        <div className="patient-profile">
          {!isLoading && (
            <div className={`profile`}>
              <ProfileHeader
                {...this.props}
                ChangeContent={this.ChangeContent}
                mode={mode}
                onClick={onUpdate}
                currentMedicalField={currentMedicalField}
                clinicalReadingsLength={clinicalReadingsLength}
                contentIs={contentIs}
                handleOnSubmit={handleOnSubmit}
                allowContentChange={allowContentChange}
                ConfirmPopUp={ConfirmPopUp}
                CancelPopUp={CancelPopUp}
                PopupVisisble={PopupVisisble}
                handleVisibleChange={handleVisibleChange}
                handleGoBack={handleGoBack}
                programId={programId}
                inactiveClass={inactiveClass}
              />
              <div className={`profile-detail `}>
                <Row>
                  <Col className="Detail" md={3}>
                    <PateintDetail
                      {...this.props}
                      handleEditProfile={onEditProfile}
                    />
                  </Col>
                  <Col md={6} className="Calender">
                    {category === USER_CATEGORY.CARE_COACH &&
                      contentIs === PATIENT_PROFILE_TAB.CALENDAR && (
                        <Fragment>
                          {
                            <Calendar
                              {...this.props}
                              ChangeContent={ChangeContent}
                              ChangeMedicalField={ChangeMedicalField}
                            />
                          }
                        </Fragment>
                      )}
                    {(contentIs === PATIENT_PROFILE_TAB.MEDICAL_DETAILS ||
                      category === USER_CATEGORY.DOCTOR) && (
                      <MedicalDetails
                        medicals_data={medicals_data}
                        ChangeMedicalField={ChangeMedicalField}
                        mode={mode}
                        currentMedicalField={currentMedicalField}
                        setBasicRef={setBasicRef}
                        setVitalRef={setVitalRef}
                        setMedicationRef={setMedicationRef}
                        products_data={products_data}
                        medications_data={medications_data}
                        clinicalTestTemplates={clinicalTestTemplates_data}
                        programId={programId}
                        setClinicalReadingRef={setClinicalReadingRef}
                        id={id}
                        adverseEvent={adverseEvent}
                        events={events}
                      />
                    )}
                  </Col>
                  {category === USER_CATEGORY.CARE_COACH && (
                    <Col md={3} className="Appointments-History">
                      <AppointmentsHistory {...this.props} />
                    </Col>
                  )}
                </Row>
              </div>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

export default PatientProfile;
