import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Icon, Col, AutoComplete, Input, Button } from "antd";

import { getCitiesByCountry } from "../../../../Actions/cityActions";
import { getProviderByCityAndSpecs } from "../../../../Actions/providerActions";

import "./style.css";

class ProviderFilterComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCountryValue: null,
      selectedCityValue: null,
      selectedSpecsValue: null
    };
  }

  handleSelectedCountryValue = value => {
    if (value) {
      let countryObj = this.props.countryData.reduce((map, obj) => {
        map[obj.name] = obj;
        return map;
      }, {});
      if (countryObj[value]) {
        this.props.getCitiesByCountry(countryObj[value]["_id"]);
        this.setState({ selectedCountryValue: countryObj[value] }, () => {
          if (
            this.state.selectedCountryValue &&
            this.state.selectedCountryValue &&
            this.state.selectedSpecsValue
          ) {
            this.props.getProviderByCityAndSpecs(
              this.state.selectedCityValue._id,
              this.state.selectedSpecsValue._id
            );
          }
        });
      }
    }
  };

  handleSelectedCityValue = value => {
    if (value) {
      let cityObj = this.props.cityData.reduce((map, obj) => {
        map[obj.name] = obj;
        return map;
      }, {});
      if (cityObj[value] && this.state.selectedCountryValue) {
        this.setState({ selectedCityValue: cityObj[value] }, () => {
          if (
            this.state.selectedCountryValue &&
            this.state.selectedCountryValue &&
            this.state.selectedSpecsValue
          ) {
            this.props.getProviderByCityAndSpecs(
              this.state.selectedCityValue._id,
              this.state.selectedSpecsValue._id
            );
          }
        });
      }
    }
  };

  handleSelectedSpecialityValue = value => {
    if (value) {
      let specsObj = this.props.specData.reduce((map, obj) => {
        map[obj["specialityName"]] = obj;
        return map;
      }, {});
      if (
        specsObj[value] &&
        this.state.selectedCountryValue &&
        this.state.selectedCityValue
      ) {
        this.setState({ selectedSpecsValue: specsObj[value] }, () => {
          if (
            this.state.selectedCountryValue &&
            this.state.selectedCountryValue &&
            this.state.selectedSpecsValue
          ) {
            this.props.getProviderByCityAndSpecs(
              this.state.selectedCityValue._id,
              this.state.selectedSpecsValue._id
            );
          }
        });
      }
    }
  };

  setParentProviderData = () => {
    if (this.props.providerData) {
      this.props.setProviderData(this.props.providerData);
    }
  };

  render() {
    return (
      <Row id="searchProviderFilterContainer" gutter={48}>
        <Col lg={6}>
          <label style={{ color: "#ffffff" }}>Select Country:</label>
          <AutoComplete
            dataSource={
              this.props.countryData
                ? this.props.countryData.map((val, i) => {
                    return val["name"];
                  })
                : []
            }
            onSelect={this.handleSelectedCountryValue}
            style={{ width: "100%" }}
            placeholder="Country"
          >
            <Input suffix={<Icon type="flag" theme="outlined" />} />
          </AutoComplete>
        </Col>
        <Col lg={6}>
          <label style={{ color: "#ffffff" }}>Select City:</label>
          <AutoComplete
            dataSource={
              this.props.cityData
                ? this.props.cityData.map((val, i) => {
                    return val["name"];
                  })
                : []
            }
            style={{ width: "100%" }}
            onSelect={this.handleSelectedCityValue}
            placeholder="City"
          >
            <Input suffix={<Icon type="shop" theme="filled" />} />
          </AutoComplete>
        </Col>
        <Col lg={6}>
          <label style={{ color: "#ffffff" }}>Select Speciality:</label>
          <AutoComplete
            dataSource={
              this.props.specData
                ? this.props.specData.map((row, i) => {
                    return row["specialityName"];
                  })
                : []
            }
            style={{ width: "100%" }}
            placeholder="Speciality"
            onSelect={this.handleSelectedSpecialityValue}
          >
            <Input suffix={<Icon type="profile" theme="outlined" />} />
          </AutoComplete>
        </Col>
        <Col lg={6}>
          <label style={{ color: "#ffffff" }}>&nbsp;</label>
          <Button
            size="default"
            type="primary"
            style={{ width: "100%" }}
            onClick={this.setParentProviderData}
          >
            Search Provider
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ citiesReducer, providerReducer }) => {
  return {
    cityData: citiesReducer.cities,
    providerData: providerReducer.provider
  };
};

export default connect(
  mapStateToProps,
  { getCitiesByCountry, getProviderByCityAndSpecs }
)(ProviderFilterComponent);
