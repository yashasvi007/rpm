import { connect } from "react-redux";
import AddPatient from "../../Components/Modal/addPatient/addPatient";
import {
  fetchProgramsData,
  fetchProgramDoctorsForModal
} from "../../../modules/program";
import { fetchDoctorHospitals } from "../../../modules/hospital";
import { close } from "../../../modules/modals";
import { GLOBAL_MODALS } from "../../../constant";

const mapStateToProps = state => {
  const {
    programs,
    hospitals,
    users,
    modal: { show, modalType }
  } = state;

  return {
    show: show && modalType === GLOBAL_MODALS.PATIENT_MODAL,
    programs,
    hospitals,
    users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProgramsData: () => dispatch(fetchProgramsData()),
    fetchProgramDoctors: programId =>
      dispatch(fetchProgramDoctorsForModal(programId)),
    fetchDoctorHospitals: doctorId => dispatch(fetchDoctorHospitals(doctorId)),
    close: () => dispatch(close())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPatient);
