import { connect } from "react-redux";
import AddDoctor from "../../Components/page/EditProfile/careCoach/addDoctor/addDoctor";
import { fetchProgramsData } from "../../modules/program";
import { fetchHospitals } from "../../modules/hospital";

const mapStateToProps = state => {
  const { programs, hospitals } = state;
  return {
    programs,
    hospitals
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProgramsData: () => dispatch(fetchProgramsData()),
    fetchHospitals: (countryId, cityId) =>
      dispatch(fetchHospitals(countryId, cityId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDoctor);
