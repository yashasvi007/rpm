import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Input, Form, Radio } from "antd";
import moment from "moment";

import messages from "../message";
import { VITALFIELD, PATIENTDASHBOARD, MODE } from "../../../../../constant";

const isBlank = data => {
  return data.length === 0 ? true : false;
};

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Vital extends Component {
  getTags = (data = []) => {
    let content = [];

    data.forEach((value, index) => {
      if (!isBlank(value)) {
        content.push(
          <span className="iqvia-tag mr8" key={index}>
            {value}
          </span>
        );
      }
    });
    return content;
  };

  render() {
    const {
      vitals,
      mode,
      intl: { formatMessage },
      pageIs
    } = this.props;
    let temperatureVal = "";
    let temperatureUnit = "";
    let bloodPressure = "";
    let pulse = "";
    let respirationRate = "";
    let updateDate = "";

    if (vitals) {
      const {
        temperature: Bodytemperature,
        temperatureUnit: temperatureunit,
        bloodPressure: BloodPressure,
        pulse: pulseRate,
        respirationRate: respirationrate,
        updatedAt
      } = vitals;
      temperatureVal = Bodytemperature;
      temperatureUnit = temperatureunit;
      bloodPressure = BloodPressure;
      pulse = pulseRate;
      respirationRate = respirationrate;
      updateDate = updatedAt;
    }

    let temperatureValInC;
    let temperatureValInF;
    if (temperatureVal && temperatureVal !== "" && temperatureVal !== null) {
      if (temperatureUnit === VITALFIELD.TEMPERATURE_UNIT_C) {
        temperatureValInF = Math.round(temperatureVal * (9 / 5) + 32);
        temperatureValInC = temperatureVal;
      }
      if (temperatureUnit === VITALFIELD.TEMPERATURE_UNIT_F) {
        temperatureValInF = temperatureVal;
        temperatureValInC = Math.round((temperatureVal - 32) * (5 / 9));
      }
    }
    const updatedOnDate = moment(updateDate).format("L");

    const updatedOnTime = moment(updateDate).format("LT");

    const { getFieldDecorator } = this.props.form;

    //
    if (mode === MODE.READ) {
      return (
        <div className="vital patient-medical-tab-content">
          <div className="flex align-items-center">
            <div
              className={
                pageIs === PATIENTDASHBOARD
                  ? `fontsize16 dark mr8 mt40`
                  : `fontsize16 dark mr8 `
              }
            >
              {formatMessage(messages.latestReading)}
            </div>
            {updateDate && (
              <div
                className={
                  pageIs === PATIENTDASHBOARD
                    ? `fontsize12 subdued mt40`
                    : `fontsize12 subdued`
                }
              >
                {formatMessage(messages.updateAt)} {updatedOnDate},
                {updatedOnTime}
              </div>
            )}
          </div>
          {pageIs === PATIENTDASHBOARD && (
            <div className="medication-horizontal-line mb16 " />
          )}
          <div className="mt10 flex align-items-center ">
            <div className="fontsize14 label-color vitalInfo">
              {formatMessage(messages.bodyTemperature)}
            </div>
            <div className="flex  align-items-center">
              {temperatureValInC && temperatureValInF && (
                <span className="fontsize16 mr8" style={{ color: "#ff530d" }}>
                  {temperatureValInC}&#8451;/{temperatureValInF}&#8457;
                </span>
              )}
            </div>
          </div>

          <div className="mt10 flex align-items-center">
            <div className="fontsize14 label-color vitalInfo">
              {formatMessage(messages.respirationRate)}
            </div>
            {respirationRate && (
              <div className="flex align-items-center ">
                <span className="fontsize16 mr8" style={{ color: "#ff530d" }}>
                  {respirationRate}
                </span>
                <span className="fontsize12 subdued">
                  {formatMessage(messages.breathePerMinute)}
                </span>
              </div>
            )}
          </div>

          <div className="mt10 flex align-items-center">
            <div className="fontsize14 label-color vitalInfo">
              {formatMessage(messages.pulseRate)}
            </div>
            {pulse && (
              <div className="flex align-items-center ">
                <span className="fontsize16 mr8" style={{ color: "#ff530d" }}>
                  {pulse}
                </span>
                <span className="fontsize12 subdued">
                  {formatMessage(messages.bpm)}
                </span>
              </div>
            )}
          </div>

          <div className="mt10 flex align-items-center">
            <div className="fontsize14 label-color vitalInfo">
              {formatMessage(messages.bloodPressure)}
            </div>
            {bloodPressure && (
              <div className="flex align-items-center ">
                <span className="fontsize16 mr8" style={{ color: "#ff530d" }}>
                  {bloodPressure}
                </span>
                <span className="fontsize12 subdued">
                  {formatMessage(messages.bpUnit)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return (
      <div className="vital patient-medical-tab-content">
        <div>
          <div className="flex row align-items-center full-width justify-content-space-between  BasicInput">
            <div className="label-color fontsize12 pb5">
              {formatMessage(messages.bodyTemperature)}
            </div>
            <Form.Item className={"tab-radio-button"}>
              {getFieldDecorator(VITALFIELD.TEMPERATURE_UNIT, {
                initialValue: temperatureUnit || "c",
                type: "string"
              })(
                <RadioGroup size="small">
                  <RadioButton className="medium" value="c">
                    ℃
                  </RadioButton>
                  <RadioButton className="medium" value="f">
                    ℉
                  </RadioButton>
                </RadioGroup>
              )}
            </Form.Item>
          </div>
          <Form.Item>
            {getFieldDecorator(VITALFIELD.TEMPERATURE, {
              initialValue: temperatureValInC
            })(<Input placeholder="" className="mt2 BasicInput" />)}
          </Form.Item>
        </div>
        <div className="mt20  BasicInput">
          <div className="fontsize12 label-color pb5">
            {formatMessage(messages.respirationRate)}
          </div>
          <Form.Item>
            {getFieldDecorator(VITALFIELD.RESPIRATION_RATE, {
              initialValue: respirationRate
            })(<Input placeholder="" className=" BasicInput" />)}
            <div className="suffix-placeholder">
              <div>{formatMessage(messages.respirationRate)}</div>
            </div>
          </Form.Item>
        </div>
        <div className="mt20 BasicInput">
          <div className="content-space-between fontsize12 label-color pb5">
            {formatMessage(messages.pulseRate)}
          </div>
          <Form.Item>
            {getFieldDecorator(VITALFIELD.PULSE, {
              initialValue: pulse
            })(<Input placeholder="" className=" BasicInput" />)}
            <div className="suffix-placeholder">
              <div>{formatMessage(messages.bpm)}</div>
            </div>
          </Form.Item>
        </div>
        <div className="mt20 BasicInput">
          <div className="content-space-between fontsize12 label-color pb5">
            {formatMessage(messages.bloodPressure)}
          </div>
          <Form.Item>
            {getFieldDecorator(VITALFIELD.BLOOD_PRESSURE, {
              initialValue: bloodPressure
            })(<Input placeholder="" className=" BasicInput" />)}
            <div className="suffix-placeholder">
              <div>{formatMessage(messages.bpUnit)}</div>
            </div>
          </Form.Item>
        </div>
      </div>
    );
  }
}

const VitalForm = Form.create()(injectIntl(Vital));

export default VitalForm;
