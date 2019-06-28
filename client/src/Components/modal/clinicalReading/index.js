import React, { Component } from "react";
import { Modal, Button, Form, Input, Select } from "antd";
import { injectIntl } from "react-intl";
import messages from "./message";
import get from "lodash-es/get";
import forIn from "lodash-es/forIn";
import dropdown from "../../../Assets/images/material-icons-black-arrow-drop-down.svg";

// const testTemplate = {
//   ABI_TEST: {
//     content: {
//       arm: {
//         content: {
//           left: "Left",
//           right: "Right",
//           suffix: "mmHg"
//         },
//         label: "Arm"
//       },
//       leftAnkle: {
//         content: {
//           pt: "PT",
//           dt: "DT",
//           suffix: "mmHg"
//         },
//         label: "Left Ankle"
//       },
//       rightAnkle: {
//         content: {
//           pt: "PT",
//           dt: "DT",
//           suffix: "mmHg"
//         },
//         label: "Right Ankle"
//       },
//       abiIndex: {
//         content: {
//           overAllAbiIndex: "Over All ABI Index",
//           suffix: "mmHg"
//         },
//         label: "ABI Index"
//       }
//     },
//     label: "ABI Test"
//   }
// };
const EDIT = "EDIT";
const ADD = "ADD";
const SUFFIX = "suffix";
const NONE = "";
const Option = Select.Option;
const dropdownIcon = <img alt="" src={dropdown} />;

const FormItem = Form.Item;
class ClinicalReading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testTemplate: {},
      testToBeAdded: NONE
    };
  }

  // =====================================ComponentDidUpdate=======================================================

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.clinicalTestTemplates_data !==
      prevProps.clinicalTestTemplates_data
    ) {
      this.setState({ testTemplate: this.props.clinicalTestTemplates_data });
    }
  }

  // =============================Handle cases for canel and submit================================================

  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    this.setState({ testToBeAdded: NONE });

    close();
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      UpdateClinicalReadingData,
      patient_id: userId,
      medicals_data,
      close
    } = this.props;

    const medicalConditionId = medicals_data._id;

    //
    this.props.form.validateFields((err, values) => {
      //
      if (!err) {
        UpdateClinicalReadingData(medicalConditionId, values, userId);
      }
    });

    this.setState({ testToBeAdded: NONE });
    close();
  };

  getParentNode = t => t.parentNode;

  // =====================================Getting forms element===================================================

  getInputFormElement = (test, section, content) => {
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

  getReadingAttributeForTestReading = (test, content) => {
    let contents = [];

    forIn(content, (value, key) => {
      contents.push(
        <div key={`${test}.${key}`} className="mt10 mb30">
          <div className="bold fontsize14">{value.label}</div>
          {this.getInputFormElement(test, key, value.content)}
        </div>
      );
    });
    return contents;
  };

  getClinicalReadingForm = testReading => {
    // const test = this.state.clinicalReadings[index];
    const { testToBeAdded } = this.state;
    const { test_selected, purpose } = this.props;
    let formName = "";
    if (purpose === EDIT) {
      formName = test_selected;
    } else {
      formName = testToBeAdded;
    }
    //
    return this.getReadingAttributeForTestReading(
      formName,
      testReading.content
    );
  };

  // ================================Creating the testTemplateReading=============================================

  getseconreading = (data, label, sectionlabel) => {
    let sections = {};
    const suffix = data[SUFFIX];
    const { medicals_data, purpose, test_selected = "" } = this.props;
    let clinicalReading = {};
    if (medicals_data && purpose === EDIT) {
      const { clinicalReadings = {} } = medicals_data;
      clinicalReading = clinicalReadings;
    }
    let inputs = {};
    forIn(data, (value, key) => {
      if (key !== SUFFIX) {
        // (
        //   clinicalReading["ABI_TEST"],
        //   label,
        //   key,
        //   get(clinicalReading["ABI_TEST"], `${label}.${key}`)
        // );

        const { data } = clinicalReading[test_selected] || {};
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

  gettestreading = data => {
    let section = {};
    forIn(data, (value, key) => {
      //
      if (value.hasOwnProperty("content")) {
        section[key] = this.getseconreading(value.content, key, value.label);
      }
    });

    return section;
  };

  // =====================================format message=======================================================

  formatMessage = data => this.props.intl.formatMessage(data);

  // =====================================Footer=======================================================

  footer = () => {
    const { requesting } = this.props;
    const { formatMessage, handleCancel, handleSubmit } = this;
    return (
      <div className="flex align-items-center justify-content-end h72px mr24">
        <Button className="iqvia-btn cancel mr8" onClick={handleCancel}>
          {formatMessage(messages.cancel)}
        </Button>
        <Button
          className="iqvia-btn Submit"
          type="primary"
          loading={requesting}
          onClick={handleSubmit}
        >
          {formatMessage(messages.submitButton)}
        </Button>
      </div>
    );
  };

  changeClinicalReadingType = e => {
    //
    this.setState({ testToBeAdded: e });
  };

  // =====================================Options for select===============================================

  getTestOptions = () => {
    const { clinicalTestTemplates_data, medicals_data } = this.props;
    let testTaken = {};
    if (medicals_data) {
      const { clinicalReadings = {} } = medicals_data;
      testTaken = clinicalReadings;
    }
    const tests = Object.keys(testTaken);
    const allTests = Object.keys(clinicalTestTemplates_data);

    const testAvailabele = allTests.filter(test => {
      return !tests.includes(test);
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

  // =====================================render=======================================================

  render() {
    const {
      show: visible,
      isError,
      intl: { formatMessage },
      test_selected,
      purpose
    } = this.props;

    if (visible === false) {
      return null;
    }

    const { handleCancel, footer, getTestOptions } = this;
    const { testTemplate, testToBeAdded } = this.state;

    //

    let testTemplateReading = {};
    const allTestTemplates = Object.keys(testTemplate);
    if (
      allTestTemplates.length > 0 &&
      (testToBeAdded !== NONE || purpose === EDIT)
    ) {
      let testName = "";
      if (purpose === EDIT) {
        testName = test_selected;
      } else {
        testName = testToBeAdded;
      }

      testTemplateReading.type = testTemplate[testName].label;
      testTemplateReading.content = this.gettestreading(
        testTemplate[testName].content
      );
      //
    }

    const modalProps = {
      visible: visible || isError,
      title: formatMessage(messages.clinicalReading),
      okButtonProps: {},
      onCancel: handleCancel,
      wrapClassName: "global-modal full-height",
      destroyOnClose: true,
      bodyStyle: { height: "100%", overflowY: "hidden" },
      width: "480px",
      footer: footer()
    };
    const testOption = getTestOptions();
    const showForm = testToBeAdded !== NONE || purpose === EDIT;
    return (
      <Modal {...modalProps}>
        {purpose === ADD && (
          <div className="pl48 pr24">
            <Select
              className={"full-width iqvia-style-select fontsize14"}
              suffixIcon={dropdownIcon}
              onChange={this.changeClinicalReadingType}
              getPopupContainer={this.getParentNode}
            >
              {testOption}
            </Select>
          </div>
        )}
        <div className="pl48 pr24 clinical-reading-form">
          {showForm && (
            <Form className="event-form">
              {this.getClinicalReadingForm(testTemplateReading)}
            </Form>
          )}
        </div>
      </Modal>
    );
  }
}

export default Form.create()(injectIntl(ClinicalReading));
