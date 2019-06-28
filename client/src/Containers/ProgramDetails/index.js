import ProgramDetails from "../../Components/ProgramDetails";
import { connect } from "react-redux";
import { signOut } from "../../modules/auth";
import { makeGetUserById } from "../../modules/user/selector";
import {
  makeGetProgramsById,
  makeGetProgramDoctors,
  makeGetProgramPatients,
  makeGetProgramProducts
} from "../../modules/program/selector";
import {
  fetchCurrentProgram,
  fetchProgramPatient,
  fetchProgramDoctors,
  fetchProgramsData,
  clearCurrentPrograms
} from "../../modules/program";
import {
  makeCitySelector,
  makeCountrySelector
} from "../../modules/countryCity/selector";
import { open } from "../../modules/modals";
import { GLOBAL_MODALS } from "../../constant";

const mapStateToProps = state => {
  const {
    users,
    auth,
    programs,
    page: { programDetails },
    products,
    hospitals,
    countryCities
  } = state;
  const getUser = makeGetUserById();
  const getCurrentProgram = makeGetProgramsById();
  const getDoctors = makeGetProgramDoctors();
  const getPatients = makeGetProgramPatients();
  const getProducts = makeGetProgramProducts();
  const getCountry = makeCountrySelector();
  const getCity = makeCitySelector();

  return {
    user_data: getUser(users, auth.authenticated_user),
    auth_data: auth,
    users,
    authenticated: auth.authenticated,
    program_data: getCurrentProgram(programs, programDetails.id),
    doctors: getDoctors(programs, programDetails.id, users),
    patients: getPatients(programs, programDetails.id, users),
    products: getProducts(programs, programDetails.id, products),
    countrySelector: id => getCountry(countryCities, id),
    citySelector: (countryId, cityId) =>
      getCity(countryCities, countryId, cityId),
    hospitals,
    isLoading: programDetails.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => {
      dispatch(signOut());
    },
    getCurrentProgram: pid => dispatch(fetchCurrentProgram(pid)),
    getProgramPatients: pid => dispatch(fetchProgramPatient(pid)),
    getProgramDoctor: pid => dispatch(fetchProgramDoctors(pid)),
    getMyPrograms: () => {
      return dispatch(fetchProgramsData());
    },
    clearCurrentPrograms: () => {
      dispatch(clearCurrentPrograms());
    },
    dischargePatient: id => dispatch(open(GLOBAL_MODALS.DISCHARGE_PATIENT, id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgramDetails);
