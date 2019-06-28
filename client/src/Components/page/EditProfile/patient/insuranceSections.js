import React, { Component } from "react";
import { Input, Select, Form, DatePicker } from "antd";
import { Element } from "react-scroll";
import { injectIntl } from "react-intl";
import moment from "moment";
import messages from "../message";
import calendar from "../../../../Assets/images/button-select-date.svg";
import searchIcon from "../../../../Assets/images/ico-search.svg";

const SearchIcon = <img alt="" src={searchIcon} />;

const FormItem = Form.Item;
const Option = Select.Option;

function disabledDate(current) {
  // select days after today only
  return current && current < moment().endOf("day");
}

//insurance field
const INSURANCE_PROVIDER = "insurance.provider";
const INSURANCE_POLICY = "insurance.policy";
const INSURANCE_EXPIRES_ON = "insurance.expiresOn";

const FIELDS = [INSURANCE_PROVIDER, INSURANCE_EXPIRES_ON, INSURANCE_POLICY];

class InsuranceSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.getInsuranceProvider();
  }

  formatMessage = data => {
    const {
      intl: { formatMessage }
    } = this.props;
    return formatMessage(data);
  };

  insuranceProviders = () => {
    const { insurance_provider_data = {} } = this.props;
    let options = [];
    for (const key in insurance_provider_data) {
      const insurance = insurance_provider_data[key];
      options.push(
        <Option key={`${insurance._id},${key}`} value={insurance._id}>
          {insurance.name}
        </Option>
      );
    }
    return options;
  };

  openCalendar = e => {
    e.preventDefault();
    window.document
      .getElementsByClassName("ant-calendar-picker-input")[1]
      .click();
  };

  render() {
    const { insuranceProviders, formatMessage } = this;
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      userData: {
        insurance: {
          provider: insuranceProvider,
          policy: insurancePolicy,
          expiresOn
        } = {}
      }
    } = this.props;

    let insuranceExpiresOn;
    if (expiresOn && expiresOn !== null && expiresOn.length > 0) {
      insuranceExpiresOn = moment(expiresOn);
    }

    const fieldError = {};

    FIELDS.forEach(field => {
      fieldError[field] = isFieldTouched(field) && getFieldError(field);
    });

    return (
      <Element name="insurance">
        <div className="dark bold fontsize18 mt40 mb16">
          {formatMessage(messages.insurance)}
        </div>
        <FormItem
          label={formatMessage(messages.insuranceProvider)}
          validateStatus={fieldError[INSURANCE_PROVIDER] ? "error" : ""}
          help={fieldError[INSURANCE_PROVIDER] || ""}
        >
          {getFieldDecorator(INSURANCE_PROVIDER, {
            rules: [],
            initialValue: insuranceProvider,
            onChange: () => {}
          })(
            <Select
              className={"full-width iqvia-style-select fontsize14"}
              placeholder=""
              suffixIcon={SearchIcon}
              showSearch
              autoComplete="off"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {insuranceProviders()}
            </Select>
          )}
        </FormItem>
        <FormItem
          label={formatMessage(messages.insurancePolicy)}
          validateStatus={fieldError[INSURANCE_POLICY] ? "error" : ""}
          help={fieldError[INSURANCE_POLICY] || ""}
        >
          {getFieldDecorator(INSURANCE_POLICY, {
            rules: [],
            initialValue: insurancePolicy
          })(<Input />)}
        </FormItem>
        <div className="mt20 flex row align-items-center iqvia-date-picker">
          <div className="full-width ">
            <FormItem
              label={formatMessage(messages.insuranceExpiresOn)}
              validateStatus={fieldError[INSURANCE_EXPIRES_ON] ? "error" : ""}
              help={fieldError[INSURANCE_EXPIRES_ON] || ""}
            >
              {getFieldDecorator(INSURANCE_EXPIRES_ON, {
                rules: [],
                initialValue: insuranceExpiresOn,
                onChange: () => {
                  this.setState({ open: false });
                }
              })(
                <DatePicker
                  showToday={false}
                  disabledDate={disabledDate}
                  className="full-width"
                />
              )}

              <img
                alt=""
                className="calendar"
                onClick={this.openCalendar}
                src={calendar}
              />
            </FormItem>
          </div>
        </div>
      </Element>
    );
  }
}

export default injectIntl(InsuranceSection);
