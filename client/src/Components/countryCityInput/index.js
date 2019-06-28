import React, { Component } from "react";
import { Select, Form } from "antd";
import isBlank from "lodash-es/isEmpty";
import clone from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";
import filter from "lodash-es/filter";
import dropdown from "../../Assets/images/material-icons-black-arrow-drop-down.svg";
import searchIcon from "../../Assets/images/ico-search.svg";

const dropdownIcon = <img alt="" src={dropdown} />;
const SearchIcon = <img alt="" className="icons" src={searchIcon} />;
const FormItem = Form.Item;
const Option = Select.Option;

export default class CountryCityInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries_list: this.props.countries_list,
      data: this.props.data,
      is_loading: this.props.is_loading,
      currentCountry: this.props.country || ""
    };
    this.countries = {};
  }

  getParentNode = t => {
    return t.parentNode;
  };

  componentDidMount() {
    if (isBlank(this.state.countries_list)) {
      this.props.getCountries();
    }
    if (this.state.currentCountry !== "") {
      this.props.getCities(this.state.currentCountry);
    }
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillReceiveProps(nextProps) {
    const currentState = clone(this.state);
    if (!isEqual(nextProps, currentState)) {
      const { countries_list = [], data, is_loading } = nextProps;
      this.setState(
        {
          countries_list: countries_list,
          data: data,
          is_loading: is_loading
        },
        () => {
          this.updateCountries(countries_list);
        }
      );
    }
  }

  updateCountries = data => {
    if (data.length > 0) {
      data.forEach(element => {
        this.countries[element._id] = element.name;
      });
    }
  };

  onChangeCountry = value => {
    const { validateFields, setFieldsValue } = this.props.form;
    const { cityField, onChangeCountry } = this.props;
    this.props.getCities(value);
    // const countryName = this.countries[value];
    setFieldsValue({ [cityField]: "" });
    // setFieldsValue({ [countryNameField]: countryName });
    validateFields([cityField]);
    this.setState({ currentCountry: value });
    if (onChangeCountry) {
      onChangeCountry();
    }
  };

  changeCityOptions = cityInput => {
    this.setState({ cityInput: cityInput }, this.getCitiesOption);
  };

  getCitiesOption = () => {
    const { currentCountry = "", data = {}, cityInput = "" } = this.state;
    const { city: defaultCity = "" } = this.props;
    if (currentCountry.length === 0) {
      return (
        <Option value="null" disabled>
          Please select Country first
        </Option>
      );
    } else if (cityInput.length > 0) {
      const countriesData = data[currentCountry];
      if (countriesData) {
        let { cities = {} } = countriesData;
        cities = filter(cities, city => {
          const cityName = JSON.stringify(city.name).toLowerCase();
          if (cityName.includes(cityInput.toLowerCase())) {
            return city;
          }
        });
        let citiesList = [];
        let index = -1;
        for (let id in cities) {
          if (index > 50) {
            break;
          }
          const value = cities[id];

          citiesList.push(
            <Option value={value._id} key={value._id + ++index}>
              {value.name}
            </Option>
          );
        }
        return citiesList;
      } else {
        return null;
      }
    } else {
      const countriesData = data[currentCountry];
      const { cities = {} } = countriesData || {};
      let citiesList = [];
      const defaultSelectedCity = cities[defaultCity];
      if (defaultSelectedCity && defaultCity.length > 0) {
        citiesList.push(
          <Option value={defaultCity} key={defaultCity}>
            {defaultSelectedCity.name}
          </Option>
        );
      }
      return citiesList;
    }
  };

  getCountriesOption = () => {
    const countries_list = this.props.countries_list;

    let countryOptions = [];

    if (Object.keys(countries_list).length > 0) {
      let index = -1;
      let value;
      for (let id in countries_list) {
        value = countries_list[id];

        countryOptions.push(
          <Option value={value._id} key={value._id + ++index}>
            {value.name}
          </Option>
        );
      }
      return countryOptions;
    } else {
      return null;
    }
  };

  getFieldsValue = value => {
    const { onChangeCity } = this.props;
    const { currentCountry } = this.state;
    const countryId = currentCountry;
    const cityId = value;
    onChangeCity(countryId, cityId);
  };

  render() {
    const { getCountriesOption, getCitiesOption } = this;
    const cities = getCitiesOption();
    const countries = getCountriesOption();
    const {
      fieldError = {},
      cityLabel,
      countryLabel,
      cityField,
      countryField,
      city,
      country,
      cityRules = [],
      countryRules = [],
      getFieldDecorator
    } = this.props;

    return (
      <div>
        <div className={"mt20"}>
          <FormItem
            label={countryLabel}
            validateStatus={fieldError[countryField] ? "error" : ""}
            help={fieldError[countryField] || ""}
          >
            {getFieldDecorator(countryField, {
              rules: countryRules,
              initialValue: country,
              onChange: this.onChangeCountry
            })(
              <Select
                className={"full-width iqvia-style-select fontsize14"}
                suffixIcon={dropdownIcon}
                placeholder=""
                showSearch
                autoComplete="off"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                getPopupContainer={this.getParentNode}
              >
                {countries}
              </Select>
            )}
          </FormItem>
        </div>
        <div className={"mt20"}>
          <FormItem
            label={cityLabel}
            validateStatus={fieldError[cityField] ? "error" : ""}
            help={fieldError[cityField] || ""}
          >
            {getFieldDecorator(cityField, {
              rules: cityRules,
              initialValue: city
            })(
              <Select
                className={"full-width iqvia-style-select fontsize14"}
                suffixIcon={SearchIcon}
                placeholder="Search City"
                showSearch
                autoComplete="off"
                optionFilterProp="children"
                notFoundContent={null}
                filterOption={false}
                // filterOption={(input, option) =>
                //   option.props.children
                //     .toLowerCase()
                //     .indexOf(input.toLowerCase()) >= 0
                // }
                onSearch={this.changeCityOptions}
                onChange={this.props.onChangeCity ? this.getFieldsValue : null}
                getPopupContainer={this.getParentNode}
              >
                {cities}
              </Select>
            )}
          </FormItem>
        </div>
      </div>
    );
  }
}
