import React, { Component } from "react";
import { Input, Select, Form } from "antd";
import { Element } from "react-scroll";
import TagInput from "../../../Common/tag";

import dropdown from "../../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import CountryCity from "../../../../Containers/CountryCity";
import { injectIntl } from "react-intl";
import messages from "../message";

const dropdownIcon = <img alt="" src={dropdown} />;

const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;

//fields
const ORGANISATION_NAME = "work.organizationName";
const SPECIALITY = "work.speciality";
const SERVICES = "work.services";
const BIO = "work.about";
const LICENSE_NUMBER = "work.licenseNumber";
const ADDRESSLINE1 = "work.officeAddress.addressLine1";
const ADRESSLINE2 = "work.officeAddress.addressLine2";
const ZIP_CODE = "work.officeAddress.zipCode";
const CITY = "work.officeAddress.city";
const COUNTRY = "work.officeAddress.country";

const FIELDS = [
  ORGANISATION_NAME,
  SPECIALITY,
  BIO,
  LICENSE_NUMBER,
  ADDRESSLINE1,
  ADRESSLINE2,
  ZIP_CODE,
  CITY,
  COUNTRY
];

class WorkSection extends Component {
  formatMessage = data => {
    this.props.intl.formatMessage(data);
  };

  notBlank = (rule, value, callback) => {
    if (!value || value.length === 0) {
      callback(this.formatMessage(messages.notBlank));
    } else {
      callback();
    }
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const { work = {} } = this.props.userData;
    const {
      organizationName,
      speciality,
      officeAddress = {},
      licenseNumber,
      services: servicesValue,
      about
    } = work;

    const {
      addressLine1,
      addressLine2,
      city,
      country,
      zipCode
    } = officeAddress;

    const specialities = [
      <Option key={1} value="xyz">
        xyz
      </Option>
    ];

    const {
      getFieldDecorator,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const fieldError = {};

    const { customFieldsError } = this.props;
    FIELDS.forEach(field => {
      if (customFieldsError) {
        if (!isFieldTouched(field) && customFieldsError[field]) {
          fieldError[field] = getFieldError(field);
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
              label={formatMessage(messages.speciality)}
              validateStatus={fieldError[SPECIALITY] ? "error" : ""}
              help={fieldError[SPECIALITY] || ""}
            >
              {getFieldDecorator(SPECIALITY, {
                rules: [],
                initialValue: speciality
              })(
                <Select
                  className={"full-width iqvia-style-select fontsize14"}
                  suffixIcon={dropdownIcon}
                  placeholder=""
                >
                  {specialities}
                </Select>
              )}
            </FormItem>
          </div>

          <div className={"mt20"}>
            <FormItem
              label={formatMessage(messages.licenseNumber)}
              validateStatus={fieldError[LICENSE_NUMBER] ? "error" : ""}
              help={fieldError[LICENSE_NUMBER] || ""}
            >
              {getFieldDecorator(LICENSE_NUMBER, {
                initialValue: licenseNumber
              })(<Input placeholder="" />)}
            </FormItem>
          </div>

          <div className="mt20">
            <div className="content-space-between pb5">
              <label className={"label-color fontsize12"}>
                {formatMessage(messages.services)}
              </label>
              <div className={"subdued fontsize12"}>
                {formatMessage(messages.useComma)}
              </div>
            </div>
            <TagInput
              className=""
              fieldName={SERVICES}
              getFieldDecorator={getFieldDecorator}
              initialValue={
                servicesValue && servicesValue !== null && servicesValue !== ""
                  ? servicesValue.split(",")
                  : []
              }
            />
          </div>
          <div className={"mt20"}>
            <FormItem
              label={formatMessage(messages.bio)}
              validateStatus={fieldError[BIO] ? "error" : ""}
              help={fieldError[BIO] || ""}
            >
              {getFieldDecorator(BIO, {
                initialValue: about
              })(<TextArea placeholder="" autosize />)}
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
