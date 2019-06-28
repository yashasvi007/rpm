//extenal libs imports
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Row } from "antd";

//common commponents import
import AppHeader from "../../Commons/AppHeader";

//sub Components import
import ProviderFilterComponent from "./components/providerFilter";
import ProviderResultComponent from "./components/providerResult";
import ProviderCarouselComponent from "./components/providerCarousel";

//actions imports
import { fetchMember, updateMemberConsent } from "../../Actions/memberActions";
import { getAllCountries } from "../../Actions/countryActions";
import { getCitiesByCountry } from "../../Actions/cityActions";
import { getAllSpeciality } from "../../Actions/specialityActions";
import { getProviderByCityAndSpecs } from "../../Actions/providerActions";

//styles imports
import "./style.css";

//subComponents  from external libs declaration

class SearchProviderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      providerData: null
    };
  }

  setProviderData = data => {
    this.setState({ providerData: data });
  };
  componentDidMount() {
    //this.props.getAllCities();
    this.props.fetchMember();
    this.props.getAllCountries();
    this.props.getAllSpeciality();
  }

  render() {
    return (
      <Row id="searchProviderPageContainer">
        <Row id="searchProviderPageHeaderContainer">
          <AppHeader loggedInMemberData={this.props.loggedInMemberData} />
        </Row>
        {/* <Row className="clearFixVS" /> */}
        <Row id="searchProviderFilterComponentContainer">
          {this.props.countryData && this.props.specialityData ? (
            <ProviderFilterComponent
              countryData={this.props.countryData}
              specData={this.props.specialityData}
              setProviderData={this.setProviderData}
            />
          ) : (
            ""
          )}
        </Row>
        <Row className="clearFixVS" />

        {this.state.providerData ? (
          <Row id="searchProviderResultComponentContainer">
            <ProviderResultComponent providerData={this.state.providerData} />
          </Row>
        ) : (
          <Row id="searchProviderCarouselComponentContainer">
            <ProviderCarouselComponent />
          </Row>
        )}
      </Row>
    );
  }
}

const mapStateToProps = ({
  memberReducer,
  countryReducer,
  citiesReducer,
  specialityReducer,
  providerReducer
}) => {
  return {
    loggedInMemberData: memberReducer.data,
    countryData: countryReducer.countries,
    cityData: citiesReducer.cities,
    specialityData: specialityReducer.specs,
    providerData: providerReducer.provider
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      fetchMember,
      updateMemberConsent,
      getAllCountries,
      getCitiesByCountry,
      getAllSpeciality,
      getProviderByCityAndSpecs
    }
  )(SearchProviderContainer)
);
