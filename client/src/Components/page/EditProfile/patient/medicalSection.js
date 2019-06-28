import React, { Component } from "react";
import { Input, Button, Icon, Form, Select, Radio } from "antd";
import forIn from "lodash-es/forIn";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import forEachRight from "lodash-es/forEachRight";
import dropdown from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import { Element } from "react-scroll";
import { injectIntl } from "react-intl";
import messages from "../message";
import TagInput from "../../../Common/tag";

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const dropdownIcon = <img alt="" src={dropdown} />;

//fields
const CHIEF_COMPLAINT = "medicalCondition.basicCondition.chiefComplaint";
const ALLERGIES = "medicalCondition.basicCondition.allergies";
const SURGERIES_OR_FRACTURE =
  "medicalCondition.basicCondition.surgeriesOrFracture";
const OTHERS = "medicalCondition.basicCondition.others";

const TEMPERATURE_UNIT = "medicalCondition.vitals.temperatureUnit";
const TEMPERATURE = "medicalCondition.vitals.temperature";
const RESPIRATION_RATE = "medicalCondition.vitals.respirationRate";
const PULSE = "medicalCondition.vitals.pulse";
const BLOOD_PRESSURE = "medicalCondition.vitals.bloodPressure";
const DIAGNOSIS_METHOD = "medicalCondition.clinicalReadings";

const DIAGNOSISMETHOD = "Diagnosis method";
const SUFFIX = "suffix";

class MedicalSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clinicalReadings: [],
      testTemplate: {},
      index: 0,
      selectedTests: {}
    };
  }

  componentDidMount() {
    const {
      clinical_test_templates,
      userData: { programIds } = {},
      medicalsData: { clinicalReadings = {} } = {}
    } = this.props;
    const { id: programId } = programIds[0];

    const allTest = Object.keys(clinicalReadings);
    let previousTest = {};
    allTest.forEach((test, index) => {
      previousTest = { ...previousTest, [index]: test };
    });

    this.setState(
      {
        testTemplate: clinical_test_templates[programId],
        selectedTests: previousTest,
        clinicalReadings: allTest
      },
      () => {}
    );
  }

  getInputElement = (test, section, content) => {
    let inputs = [];
    const { getFieldDecorator } = this.props.form;
    forIn(content, (value, key) => {
      inputs.push(
        <div key={key} className="mb8 mt10">
          <div className="content-space-between fontsize12 label-color pb5">
            {value.label}
          </div>
          <FormItem>
            {getFieldDecorator(test + "." + section + "." + key, {
              initialValue: value.value
            })(<Input placeholder="" />)}
            <div className="suffix-placeholder">
              <div>{value.type}</div>
            </div>
          </FormItem>
        </div>
      );
    });
    return inputs;
  };

  getReadingAttributeForTest = (test, content) => {
    let contents = [];

    forIn(content, (value, key) => {
      contents.push(
        <div key={key} className="mt10 mb30">
          <div className="bold fontsize14">{value.label}</div>
          {this.getInputElement(test, key, value.content)}
        </div>
      );
    });
    return contents;
  };

  getClinicalReadingForm = index => {
    const { testTemplate, clinicalReadings } = this.state;
    let testTemplateReading = {};
    const allTestTemplates = Object.keys(testTemplate);
    const testName = clinicalReadings[index];
    if (allTestTemplates.length > 0 && testName !== DIAGNOSISMETHOD) {
      testTemplateReading.type = testTemplate[testName].label;
      testTemplateReading.content = this.gettestreading(
        testTemplate[testName].content,
        testName
      );
    }
    const test = this.state.clinicalReadings[index];
    // ("===this.state=====", testReading)
    if (test === DIAGNOSISMETHOD) {
      return null;
    } else {
      return this.getReadingAttributeForTest(
        DIAGNOSIS_METHOD + "." + test,
        testTemplateReading.content
      );
    }
  };

  addMoreTest = () => {
    let tests = this.state.clinicalReadings;
    tests.push(DIAGNOSISMETHOD);
    //status : 0 for new, 1 for old
    this.setState(
      {
        clinicalReadings: tests
      },
      () => {}
    );
  };

  // changeTUnit = () => {
  // 	const current = this.state.tunit;
  // 	this.setState({
  // 		tunit: current === "c" ? "f" : "c"
  // 	});
  // };

  getseconreading = (data, label, sectionlabel, testName) => {
    let sections = {};
    const { medicals_data } = this.props;
    let clinicalReading = {};
    if (medicals_data) {
      const { clinicalReadings = {} } = medicals_data;
      clinicalReading = clinicalReadings;
    }

    const suffix = data[SUFFIX];
    let inputs = {};
    forIn(data, (value, key) => {
      if (key !== SUFFIX) {
        let data = {};
        if (!isEmpty(clinicalReading)) {
          const { data: readings = {} } = clinicalReading[testName] || {};
          data = readings;
        }

        inputs[key] = {
          value: get(data, `${label}.${key}`, ""),
          type: suffix,
          label: value
        };
      }
    });
    sections.content = inputs;
    sections.label = sectionlabel;
    //
    return sections;
  };

  gettestreading = (data, testName) => {
    let section = {};
    forIn(data, (value, key) => {
      //
      if (value.hasOwnProperty("content")) {
        section[key] = this.getseconreading(
          value.content,
          key,
          value.label,
          testName
        );
      }
    });

    return section;
  };

  changeClinicalReadingType = (e, index) => {
    const { selectedTests } = this.state;
    let tests = this.state.clinicalReadings;
    tests[index] = e;

    this.setState({
      clinicalReadings: tests,
      index: index,
      selectedTests: { ...selectedTests, [index]: e }
    });
  };

  getTestOptions = () => {
    const { testTemplate, selectedTests } = this.state;
    const currentTestKeys = Object.keys(selectedTests);
    const currentTests = currentTestKeys.map(value => selectedTests[value]);
    const allTests = Object.keys(testTemplate);

    const testAvailabele = allTests.filter(test => {
      return !currentTests.includes(test);
    });
    // ("************alltest*************", testAvailabele)
    const testOption = testAvailabele.map((test, index) => {
      return (
        <Option key={index} value={test}>
          {test}
        </Option>
      );
    });
    return testOption;
  };

  render() {
    const {
      medicalsData = {},
      intl: { formatMessage }
    } = this.props;
    const { basicCondition = {}, vitals = {} } = medicalsData;
    const {
      chiefComplaint = "",
      allergies = "",
      surgeriesOrFracture = "",
      others = ""
    } = basicCondition;
    const {
      temperatureUnit = "c",
      temperature,
      respirationRate,
      pulse,
      bloodPressure
    } = vitals;

    const { getFieldDecorator } = this.props.form;
    const { getTestOptions } = this;
    //

    let medicalReadings = [];
    let tests = this.state.clinicalReadings;
    const testOption = getTestOptions();

    forEachRight(tests, (element, index) => {
      medicalReadings.push(
        <div key={index} className="mb20">
          <Select
            className={"full-width iqvia-style-select fontsize14"}
            suffixIcon={dropdownIcon}
            defaultValue={element}
            onChange={e => {
              this.changeClinicalReadingType(e, index);
            }}
          >
            {testOption}
          </Select>
          <div>{this.getClinicalReadingForm(index)}</div>
        </div>
      );
    });

    return (
      <div id="medical">
        <Element name="medical">
          <div className="bold mt40 pb16 fontsize18">
            {formatMessage(messages.medical)}
          </div>
          <div className="medium fontsize16">
            {formatMessage(messages.basic)}
          </div>
          <div className="mt10">
            <FormItem label={formatMessage(messages.chiefComplaint)}>
              {getFieldDecorator(CHIEF_COMPLAINT, {
                initialValue: chiefComplaint
              })(<Input />)}
            </FormItem>
          </div>
          <div className="mt20">
            <div className="content-space-between pb5">
              <label className={"label-color fontsize12"}>
                {formatMessage(messages.allergies)}
              </label>
              <div className={"subdued fontsize12"}>
                {formatMessage(messages.useComma)}
              </div>
            </div>
            <TagInput
              className=""
              fieldName={ALLERGIES}
              getFieldDecorator={getFieldDecorator}
              initialValue={
                allergies && allergies !== null && allergies !== ""
                  ? allergies.split(",")
                  : []
              }
            />
          </div>
          <div className="mt20">
            <div className="content-space-between  pb5">
              <label className={"label-color fontsize12"}>
                {formatMessage(messages.surgeriesFracture)}
              </label>
              <div className={"subdued fontsize12"}>
                {formatMessage(messages.useComma)}
              </div>
            </div>
            <TagInput
              className=""
              fieldName={SURGERIES_OR_FRACTURE}
              getFieldDecorator={getFieldDecorator}
              initialValue={
                surgeriesOrFracture &&
                surgeriesOrFracture !== null &&
                surgeriesOrFracture !== ""
                  ? surgeriesOrFracture.split(",")
                  : []
              }
            />
          </div>
          <div className="mt20">
            <div className="content-space-between  pb5">
              <label className={"label-color fontsize12"}>
                {formatMessage(messages.otherConditions)}
              </label>
              <div className={"subdued fontsize12"}>
                {formatMessage(messages.useComma)}
              </div>
            </div>
            <TagInput
              className=""
              fieldName={OTHERS}
              getFieldDecorator={getFieldDecorator}
              initialValue={
                others && others !== null && others !== ""
                  ? others.split(",")
                  : []
              }
            />
          </div>
          <div className="mt30">
            <div className="medium mb8">{formatMessage(messages.vital)}</div>
            <div className="fontsize12 subdued mb20">
              {formatMessage(messages.vitalSubtitle)}
            </div>
            <div>
              <div className="flex row align-items-center full-width justify-content-space-between">
                <div className="label-color fontsize12 pb5">
                  {formatMessage(messages.bodyTemperature)}
                </div>
                <FormItem className={"tab-radio-button"}>
                  {getFieldDecorator(TEMPERATURE_UNIT, {
                    initialValue: temperatureUnit,
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
                </FormItem>
              </div>
              <FormItem>
                {getFieldDecorator(TEMPERATURE, {
                  initialValue: temperature
                })(<Input placeholder="" className="mt2" />)}
              </FormItem>
            </div>
            <div className="mt20">
              <div className="fontsize12 label-color pb5">
                {formatMessage(messages.respirationRate)}
              </div>
              <FormItem>
                {getFieldDecorator(RESPIRATION_RATE, {
                  initialValue: respirationRate
                })(<Input placeholder="" />)}
                <div className="suffix-placeholder">
                  <div>{formatMessage(messages.respirationRate)}</div>
                </div>
              </FormItem>
            </div>
            <div className="mt20">
              <div className="content-space-between fontsize12 label-color pb5">
                {formatMessage(messages.pulseRate)}
              </div>
              <FormItem>
                {getFieldDecorator(PULSE, {
                  initialValue: pulse
                })(<Input placeholder="" />)}
                <div className="suffix-placeholder">
                  <div>{formatMessage(messages.bpm)}</div>
                </div>
              </FormItem>
            </div>
            <div className="mt20">
              <div className="content-space-between fontsize12 label-color pb5">
                {formatMessage(messages.bloodPressure)}
              </div>
              <FormItem>
                {getFieldDecorator(BLOOD_PRESSURE, {
                  initialValue: bloodPressure
                })(<Input placeholder="" />)}
                <div className="suffix-placeholder">
                  <div>{formatMessage(messages.bpUnit)}</div>
                </div>
              </FormItem>
            </div>
          </div>

          <div className="mt30">
            <div className="flex row align-items-center justify-content-space-between bold mt30">
              <div className="medium fontsize16">
                {formatMessage(messages.clinicalReadings)}
              </div>
              <Button
                style={{ height: "32px", width: "32px" }}
                className={"border-none"}
                onClick={e => {
                  e.preventDefault();
                  this.addMoreTest();
                }}
              >
                <Icon type="plus" />
              </Button>
            </div>
            <div className="mb16 fontsize12 subdued">
              {formatMessage(messages.clinicalReadingsSubtitle)}
            </div>
            <div className="mt20">
              <div>{medicalReadings}</div>
            </div>
          </div>
        </Element>
      </div>
    );
  }
}

export default injectIntl(MedicalSection);
