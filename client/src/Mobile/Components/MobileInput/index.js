import React, { Component } from "react";
import { Form, Select, Input } from "antd";
import debounce from "lodash-es/debounce";
import ReactCountryFlag from "react-country-flag";
import callingCountries from "country-data";
import clone from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";

const FormItem = Form.Item;
const Option = Select.Option;

function getParsedCountryCode() {
  const a = [];
  for (let countryCode in callingCountries.callingCountries.all) {
    const cc = callingCountries.callingCountries.all[countryCode];

    if (cc.countryCallingCodes.length > 0) {
      cc.code = cc.countryCallingCodes[0];
      a.push(cc);
    }
  }

  return a;
}

const ParsedCountryCodes = getParsedCountryCode();

const getCountryAlpha = (code = "+91") => {
  let country_alpha = "";

  for (let index in ParsedCountryCodes) {
    const country = ParsedCountryCodes[index];
    if (country.code === code) {
      country_alpha = country.alpha2;
      break;
    }
  }
  return country_alpha;
};

export class MobileLabel extends Component {
  render() {
    const { countryCode = "", phoneNumber = "" } = this.props;
    if (
      countryCode !== null &&
      phoneNumber !== null &&
      countryCode.length > 0 &&
      phoneNumber.length > 0
    ) {
      return (
        <div className="flex  align-items-center">
          <ReactCountryFlag code={getCountryAlpha(countryCode)} svg />
          <div className="ml8">{countryCode + "-" + phoneNumber}</div>
        </div>
      );
    } else return null;
  }
}

export class MobileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestedCountryCodes: [],
      showDropDown: false
    };

    this.searchCountryCode = debounce(this.searchCountryCode, 300);
  }

  getParentNode = t => {
    return t.parentNode;
  };

  componentDidMount() {
    const { countryCode = "+91" } = this.props;
    this.setInitialCountryCode(countryCode);
  }

  componentWillReceiveProps(nextProps) {
    const currentProps = clone(this.props);
    if (!isEqual(nextProps, currentProps)) {
      const { countryCode } = nextProps;
      this.setInitialCountryCode(countryCode);
    }
  }

  selectedCountryCode = val => {
    if (val.length === 0) {
      this.setState({
        showDropDown: false,
        suggestedCountryCodes: []
      });
    } else {
      this.setState({
        showDropDown: false,
        suggestedCountryCodes: ParsedCountryCodes.filter(a => {
          return a.code.indexOf(val) > -1;
        })
      });
    }
  };

  setInitialCountryCode = (countryCode = "+91") => {
    //Sometimes country code comes as null and .length fails that's why this condition
    if (countryCode ? countryCode.length === 0 : false) {
      this.setState({
        suggestedCountryCodes: []
      });
    } else {
      this.setState({
        countryCode: countryCode,
        suggestedCountryCodes: ParsedCountryCodes.filter(a => {
          return a.code.indexOf(countryCode) > -1;
        })
      });
    }
  };

  searchCountryCode = val => {
    if (val.length === 0) {
      this.setState({
        suggestedCountryCodes: []
      });
    } else {
      this.setState({
        showDropDown: true,
        suggestedCountryCodes: ParsedCountryCodes.filter(a => {
          return a.code.indexOf(val) > -1;
        })
      });
    }
  };

  isNumber = (rule, value, callback) => {
    if (value && value.length > 0 && value.match("^[0-9]+$") === null) {
      callback("Enter valid phone number");
    } else {
      callback();
    }
  };

  render() {
    const {
      phoneNumber,
      phoneField,
      countryCodeField,
      disabled,
      fieldError = {},
      countryCode,
      rulesPhoneNumber = []
    } = this.props;

    const { getFieldDecorator } = this.props.form;
    const { showDropDown, suggestedCountryCodes } = this.state;

    return (
      <div className="flex content-space-between align-items-start">
        <div className="flex flex-1">
          <FormItem
            className="show-no-error"
            style={{ width: "120px", margin: "0 10px 0 0" }}
            validateStatus={fieldError[countryCodeField] ? "error" : ""}
            help={fieldError[countryCodeField] || ""}
          >
            {getFieldDecorator(countryCodeField, {
              validateTrigger: ["onChange", "onBlur"],
              rules: this.props.rulesCountryCode,
              initialValue: countryCode,
              type: "string"
            })(
              <Select
                className="country_code_value_placeholder"
                showSearch
                placeholder={
                  <div
                    className={
                      "country_code_value flex row align-items-center justify-content-start w100"
                    }
                  >
                    <ReactCountryFlag code={"IN"} svg />
                    <div className={"pl5"}>+91</div>
                  </div>
                }
                notFoundContent={null}
                filterOption={false}
                onSearch={this.searchCountryCode}
                style={{ width: "100%" }}
                onSelect={this.selectedCountryCode}
                showArrow={false}
                dropdownStyle={{ width: "200px" }}
                dropdownClassName={
                  "select_country_code_dropdown" +
                  (showDropDown ? "  " : " hide_drop_down")
                }
                optionLabelProp={"children"}
                disabled={disabled}
                getPopupContainer={this.getParentNode}
              >
                {suggestedCountryCodes.map(d => {
                  return (
                    <Option
                      value={d.code}
                      key={d.alpha2 + d.code}
                      title={d.code}
                    >
                      <div
                        className={
                          "flex row align-items-start justify-content-center"
                        }
                      >
                        <div
                          className={
                            "country_code_select flex row align-items-center justify-content-start w100"
                          }
                        >
                          <ReactCountryFlag code={d.alpha2} svg />
                          <div className={"pl5"}>
                            {" "}
                            {d.code} {d.name}
                          </div>
                        </div>
                        <div
                          className={
                            "country_code_value flex row align-items-center justify-content-start w100"
                          }
                        >
                          <ReactCountryFlag code={d.alpha2} svg />
                          <div className={"pl5"}>{d.code}</div>
                        </div>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem
            className={"w100"}
            style={{ marginBottom: "0" }}
            validateStatus={
              fieldError[phoneField] || fieldError[countryCodeField]
                ? "error"
                : ""
            }
            help={fieldError[phoneField] || fieldError[countryCodeField] || ""}
          >
            {getFieldDecorator(phoneField, {
              initialValue: phoneNumber,
              rules: [
                {
                  validator: this.isNumber
                },
                ...rulesPhoneNumber
              ]
            })(
              <Input
                placeholder=""
                className={"phone_number_main mb0 pb0"}
                disabled={disabled}
              />
            )}
          </FormItem>
        </div>
      </div>
    );
  }
}
