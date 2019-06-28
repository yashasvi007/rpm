import React, { Component } from "react";
import { Input, Form } from "antd";
import { Element } from "react-scroll";
import CountryCity from "../../../../Containers/CountryCity";
import { injectIntl } from "react-intl";
import messages from "../message";

const FormItem = Form.Item;

//fields
const ORGANISATION_NAME = "work.organizationName";
const ADDRESSLINE1 = "work.officeAddress.addressLine1";
const ADRESSLINE2 = "work.officeAddress.addressLine2";
const ZIP_CODE = "work.officeAddress.zipCode";
const CITY = "work.officeAddress.city";
const COUNTRY = "work.officeAddress.country";

const FIELDS = [
  ORGANISATION_NAME,
  ADDRESSLINE1,
  ADRESSLINE2,
  ZIP_CODE,
  CITY,
  COUNTRY
];

class WorkSection extends Component {
  render() {
    const { work = {} } = this.props.userData;
    const { organizationName, officeAddress = {} } = work;

    const {
      addressLine1,
      addressLine2,
      city,
      country,
      zipCode
    } = officeAddress;

    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const fieldError = {};
    const {
      customFieldsError,
      intl: { formatMessage }
    } = this.props;
    FIELDS.forEach(field => {
      if (customFieldsError) {
        if (!isFieldTouched(field) && customFieldsError[field]) {
          fieldError[field] = getFieldError(field);
        } else {
          fieldError[field] = isFieldTouched(field) && getFieldError(field);
        }
      } else {
        fieldError[field] = isFieldTouched(field) && getFieldError(field);
      }
    });

    return (
      <div id="work">
        <Element name="work">
          <div className="bold mt40 pb16 fontsize18">Work</div>
          <div>
            <FormItem
              label={formatMessage(messages.organisationName)}
              validateStatus={fieldError[ORGANISATION_NAME] ? "error" : ""}
              help={fieldError[ORGANISATION_NAME] || ""}
            >
              {getFieldDecorator(ORGANISATION_NAME, {
                initialValue: organizationName
              })(<Input placeholder="" />)}
            </FormItem>
          </div>

          <div className={"mt20"}>
            <FormItem
              label={formatMessage(messages.addressLine1)}
              validateStatus={fieldError[ADDRESSLINE1] ? "error" : ""}
              help={fieldError[ADDRESSLINE1] || ""}
            >
              {getFieldDecorator(ADDRESSLINE1, {
                initialValue: addressLine1
              })(<Input placeholder="" />)}
            </FormItem>
          </div>

          <div className={"mt20"}>
            <FormItem
              label={formatMessage(messages.addressLine2)}
              validateStatus={fieldError[ADRESSLINE2] ? "error" : ""}
              help={fieldError[ADRESSLINE2] || ""}
            >
              {getFieldDecorator(ADRESSLINE2, {
                initialValue: addressLine2
              })(<Input placeholder="" />)}
            </FormItem>
          </div>
          <div className={"mt20"}>
            <FormItem
              label={formatMessage(messages.zipcode)}
              validateStatus={fieldError[ZIP_CODE] ? "error" : ""}
              help={fieldError[ZIP_CODE] || ""}
            >
              {getFieldDecorator(ZIP_CODE, {
                initialValue: zipCode
              })(<Input placeholder="" />)}
            </FormItem>
          </div>
          <CountryCity
            form={this.props.form}
            getFieldDecorator={getFieldDecorator}
            cityLabel={formatMessage(messages.cityLabel)}
            countryLabel={formatMessage(messages.countryLabel)}
            city={city}
            country={country}
            cityField={CITY}
            countryField={COUNTRY}
          />
        </Element>
      </div>
    );
  }
}

export default injectIntl(WorkSection);
