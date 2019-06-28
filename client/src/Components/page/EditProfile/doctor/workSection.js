import React, { Component } from "react";
import { Input, Select, Form } from "antd";
import { Element } from "react-scroll";

import dropdown from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import CountryCity from "../../../../Containers/countryCity";
import { injectIntl } from "react-intl";
import messages from "../message";

const dropdownIcon = <img alt="" src={dropdown} />;

const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;

//fields
const ORGANISATION_NAME = "work.organizationName";
const SPECIALITY = "work.speciality";
const BIO = "work.about";
const LICENSE_NUMBER = "work.licenseNumber";
const ADDRESSLINE1 = "work.officeAddress.addressLine1";
const ADRESSLINE2 = "work.officeAddress.addressLine2";
const ZIP_CODE = "work.officeAddress.zipCode";
const WORK_CITY = "work.officeAddress.city";
const WORK_COUNTRY = "work.officeAddress.country";
const HOSPITALS = "hospitals";

const FIELDS = [
  ORGANISATION_NAME,
  HOSPITALS,
  SPECIALITY,
  BIO,
  LICENSE_NUMBER,
  ADDRESSLINE1,
  ADRESSLINE2,
  ZIP_CODE,
  WORK_CITY,
  WORK_COUNTRY
];

class WorkSection extends Component {
  componentDidMount() {
    const {
      userData: {
        work: { officeAddress: { city: cityId, country: countryId } = {} } = {}
      } = {}
    } = this.props;
    if (cityId !== undefined && countryId !== undefined) {
      this.props.getHospital(countryId, cityId);
    }
  }

  onChangeCity = (countryId, cityId) => {
    const { setFieldsValue, validateFields } = this.props.form;
    setFieldsValue({ [HOSPITALS]: [] });
    validateFields();
    this.props.getHospital(countryId, cityId);
  };

  onChangeCountry = countryId => {
    const { setFieldsValue, validateFields } = this.props.form;
    setFieldsValue({ [HOSPITALS]: [] });
    validateFields();
  };

  getHospitalsData = () => {
    const {
      form: { getFieldValue },
      hospitals: hospitalsData
    } = this.props;
    let options = [];
    for (const key in hospitalsData) {
      const hospital = hospitalsData[key];
      const countryId = getFieldValue(WORK_COUNTRY);
      const cityId = getFieldValue(WORK_CITY);
      if (hospital.cityId === cityId && hospital.countryId === countryId) {
        options.push(
          <Option key={`${hospital.id}`} value={hospital.id}>
            {hospital.name}
          </Option>
        );
      }
    }
    return options;
  };

  getVisitingHospitals = () => {
    let options = [];
    const {
      userData: { visitingHospitals = {} }
    } = this.props;
    for (const key in visitingHospitals) {
      const id = visitingHospitals[key];
      options.push(id);
    }
    return options;
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;

    const { work = {} } = this.props.userData;
    const { speciality, officeAddress = {}, licenseNumber, about } = work;

    const {
      addressLine1,
      addressLine2,
      city,
      country,
      zipCode
    } = officeAddress;

    const specialities = [
      <Option key={1} value="Neurologist">
        Neurologist
      </Option>,
      <Option key={2} value="Heart Surgeon">
        Heart Surgeon
      </Option>,
      <Option key={3} value="Orthopaedic">
        Orthopaedic
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
          <div className="bold mt40 pb16 fontsize18">
            {formatMessage(messages.work)}
          </div>
          <div>
            <FormItem
              label={formatMessage(messages.speciality)}
              validateStatus={fieldError[SPECIALITY] ? "error" : ""}
              help={fieldError[SPECIALITY] || ""}
            >
              {getFieldDecorator(SPECIALITY, {
                rules: [
                  {
                    required: true,
                    message: formatMessage(messages.specialityRule)
                  }
                ],
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
            cityField={WORK_CITY}
            countryField={WORK_COUNTRY}
            cityRules={[
              {
                required: true,
                message: formatMessage(messages.cityRule)
              }
            ]}
            countryRules={[
              {
                required: true,
                message: formatMessage(messages.countryRule)
              }
            ]}
            onChangeCity={this.onChangeCity}
            onChangeCountry={this.onChangeCountry}
          />
          <div>
            <FormItem
              label={formatMessage(messages.hospitalName)}
              validateStatus={fieldError[HOSPITALS] ? "error" : ""}
              help={fieldError[HOSPITALS] || ""}
            >
              {getFieldDecorator(HOSPITALS, {
                initialValue: this.getVisitingHospitals(),
                rules: [
                  {
                    required: true,
                    message: formatMessage(messages.hospitalError)
                  }
                ]
              })(
                <Select
                  className={"full-width iqvia-style-select fontsize14"}
                  showSearch
                  autoComplete="off"
                  mode="multiple"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.getHospitalsData()}
                </Select>
              )}
            </FormItem>
          </div>
        </Element>
      </div>
    );
  }
}

export default injectIntl(WorkSection);
