import React, { Component } from "react";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import { MEDICALS_OPTIONS, MODE } from "../../../constant";
import MedicalDetails from "../../Detail/patient/medicalDetails/medicalDetails";
// import Basic from "../../Detail/patient/medicalDetails/Basic";
import "../style.less";

const PATIENTDASHBOARD = "patient-dashboard";
class PatientDashboard extends Component {
  constructor(props) {
    super(props);
    const { show } = this.props.match.params;
    this.state = {
      userId: "",
      currentMedicalField: show || "Basic",
      mode: "read",
      testSelected: ""
    };
  }
  componentDidMount() {
    const { id } = this.props;
    this.setState({ userId: id });
    this.props.fetchPatient(id);
    this.props.fetchAdverseEvent(id);
    const { show } = this.props.match.params;
    if (show && !isEmpty(show)) {
      this.setState({ currentMedicalField: show });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.is_loading !== prevProps.is_loading) {
      this.setState({ medicalConditionId: this.props.medicals_data._id });
    }
  }
  onUpdate = value => {
    this.setState({ mode: value });
  };

  ChangeMedicalField = key => {
    // const { key } = value;
    // console.log("key", key);
    this.setState({ currentMedicalField: key });
    this.props.history.push(`/medicals/${key}`);
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
          const updateAt = moment().format();
          values.updatedAt = updateAt;
          const vital = values;
          this.props.addVitalData(medicalConditionId, vital, userId);
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
      openHistoricalClinicalData,
      openVitalsData,
      openMedicationData,
      openPrescription
    } = this.props;
    const { currentMedicalField, mode } = this.state;

    const {
      ChangeMedicalField,
      onUpdate,
      setBasicRef,
      setVitalRef,
      handleOnSubmit
    } = this;

    let programId = "";
    if (user_data) {
      const { programIds } = user_data;
      if (programIds) {
        programId = programIds[0].id;
      }
    }

    return (
      <div className="patient-medicals">
        <MedicalDetails
          {...this.props}
          medicals_data={medicals_data}
          mode={mode}
          products_data={products_data}
          medications_data={medications_data}
          clinicalTestTemplates={clinicalTestTemplates_data}
          setBasicRef={setBasicRef}
          setVitalRef={setVitalRef}
          programId={programId}
          id={id}
          adverseEvent={adverseEvent}
          events={events}
          pageIs={PATIENTDASHBOARD}
          ChangeMedicalField={ChangeMedicalField}
          currentMedicalField={currentMedicalField}
          user_data={user_data}
          openHistoricalClinicalData={openHistoricalClinicalData}
          openMedicationData={openMedicationData}
          openVitalsData={openVitalsData}
          openPrescription={openPrescription}
          handleOnUpdate={onUpdate}
          handleOnSubmit={handleOnSubmit}
        />
      </div>
    );
  }
}

export default PatientDashboard;
