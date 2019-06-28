import doctorProfile from "../../Components/Detail/doctor";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchDoctor } from "../../modules/page/doctorProfile";
import { fetchDoctorHospitals } from "../../modules/hospital";
import { makeGetUserById } from "../../modules/user/selector";
import { open } from "../../modules/modals";
import {
  makeCitySelector,
  makeCountrySelector
} from "../../modules/countryCity/selector";
import { GLOBAL_MODALS } from "../../constant";
import { fetchAppointmentsHistory } from "../../modules/events";

const mapStateToProps = state => {
  const { users, countryCities, page: { doctorProfile } = {} } = state;

  const getUser = makeGetUserById();
  const getCity = makeCitySelector();
  const getCountry = makeCountrySelector();
  return {
    user_data: getUser(users, doctorProfile.id),
    countrySelector: id => getCountry(countryCities, id),
    citySelector: (countryId, cityId) =>
      getCity(countryCities, countryId, cityId),
    is_loading: doctorProfile.is_loading,
    country_city: countryCities
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchDoctor: userId => dispatch(fetchDoctor(userId)),
    fetchDoctorHospitals: userId => dispatch(fetchDoctorHospitals(userId)),
    addEditAppointmentReminder: (eventId, userId, purpose) =>
      dispatch(open(GLOBAL_MODALS.EVENT_MODAL, eventId, purpose, { userId })),
    fetchAppointmentsHistory: userId =>
      dispatch(fetchAppointmentsHistory(userId))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(doctorProfile)
);
