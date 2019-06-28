import CountryCity from "../../Components/countryCityInput";
import { connect } from "react-redux";

import { getCities, getCountries } from "../../../modules/countryCity";

const mapStateToProps = state => {
  const { countryCities } = state;
  return {
    countries_list: countryCities.countries,
    data: countryCities.cities,
    is_loading: countryCities.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCities: data => dispatch(getCities(data)),
    getCountries: () => dispatch(getCountries())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CountryCity);
