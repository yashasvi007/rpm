import { connect } from "react-redux";
import AddPatient from "../../Components/page/EditProfile/careCoach/addPatient/addPatient";
import {
  fetchProgramsData,
  fetchProgramDoctorsForModal
} from "../../modules/program";
import { fetchDoctorHospitals } from "../../modules/hospital";

const mapStateToProps = state => {
  const { programs, hospitals, users } = state;
  return {
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
    fetchDoctorHospitals: doctorId => dispatch(fetchDoctorHospitals(doctorId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPatient);
