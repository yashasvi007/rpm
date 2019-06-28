import { connect } from "react-redux";
import AddDoctor from "../../Components/Modal/addDoctor/addDoctor";
import { fetchProgramsData } from "../../../modules/program";
import { fetchHospitals } from "../../../modules/hospital";
import { GLOBAL_MODALS } from "../../../constant";
import { close } from "../../../modules/modals";

const mapStateToProps = state => {
  const {
    programs,
    hospitals,
    modal: { show, modalType }
  } = state;
  return {
    show: show && modalType === GLOBAL_MODALS.DOCTOR_MODAL,
    programs,
    hospitals
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchProgramsData: () => dispatch(fetchProgramsData()),
    fetchHospitals: (countryId, cityId) =>
      dispatch(fetchHospitals(countryId, cityId)),
    close: () => dispatch(close())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDoctor);
