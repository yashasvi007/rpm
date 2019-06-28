import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Form } from "antd";
// import { Tags } from "../../../../Helper/tagify";
import forIn from "lodash-es/forIn";
import isEmpty from "lodash-es/isEmpty";
import moment from "moment";
import messages from "../message";
import { PATIENTDASHBOARD } from "../../../../../constant";

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

const UPDATEDAT = "updatedAt";
class ClinicalReading extends Component {
  constructor(props) {
    super(props);
    const { clinicalTestTemplates, programId } = this.props;
    this.state = {
      testTemplate: clinicalTestTemplates[programId] || {}
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.programId !== prevProps.programId) {
      const { clinicalTestTemplates, programId } = this.props;
      this.setState({ testTemplate: clinicalTestTemplates[programId] });
    }
  }

  getInputElement = (currentContext, content) => {
    let inputs = [];

    //
    forIn(content, (value, key) => {
      inputs.push(
        <div key={key} className="mt8">
          <div className="fontSize12 label-color">{currentContext[key]}</div>
          <div className="flex baseline mr30">
            <span className=" fontsize16 mr8">{value}</span>
            <span className=" fontsize12 subdued">{currentContext.suffix}</span>
          </div>
        </div>
      );
    });
    return inputs;
  };

  getReadingAttributeForTest = (currentContext, content) => {
    let contents = [];

    forIn(content, (value, key) => {
      console
        .log
        // "in my profile 2nd value",
        // currentContext,"|||",
        // content,
        // key,
        // currentContext[key]
        ();
      if (key !== UPDATEDAT) {
        contents.push(
          <div key={key} className="mb20">
            <div className="fontsize14 medium">{currentContext[key].label}</div>
            <div className="flex">
              {this.getInputElement(currentContext[key].content, value)}
            </div>
          </div>
        );
      }
    });
    return contents;
  };
  getClinicalReadings = (reading, currentTest) => {
    const { testTemplate } = this.state;
    const {
      intl: { formatMessage },
      pageIs
    } = this.props;
    const { updatedAt, data } = reading;
    const updatedOnDate = moment(updatedAt).format("L");
    const updatedOnTime = moment(updatedAt).format("LT");

    return (
      <div key={currentTest} className="clinical-reading-detail">
        <div className="mt16 mb10">
          <span className="fontsize14 dark bold ">
            {testTemplate[currentTest].label}
          </span>
          <span className="fontsize12 ml8 label-color ">
            {formatMessage(messages.updateAt)}, {updatedOnDate}, {updatedOnTime}
          </span>
        </div>
        {pageIs === PATIENTDASHBOARD && (
          <div className="medication-horizontal-line " />
        )}
        <div>
          {this.getReadingAttributeForTest(
            testTemplate[currentTest].content,
            data
          )}
        </div>
      </div>
    );
  };

  render() {
    const {
      clinicalReadings = [],
      intl: { formatMessage },
      programId,
      pageIs
    } = this.props;
    const { testTemplate } = this.state;

    const { getClinicalReadings } = this;
    const testsTakenByPatient = Object.keys(clinicalReadings);
    // if(testsTakenByPatient.length > 0){
    //   testsTakenByPatient.map((test) => {
    //      allTests.push(clinicalReadings[test])
    //   })
    // }
    let medicalReadings = [];
    if (programId !== "" && !isEmpty(testTemplate)) {
      medicalReadings = testsTakenByPatient.map(test => {
        return getClinicalReadings(clinicalReadings[test], test);
      });
    }

    return (
      <div className="clinicalReading patient-medical-tab-content">
        {medicalReadings.length > 0 ? (
          <div>
            {pageIs !== PATIENTDASHBOARD && (
              <div className=" bold">
                <div className="medium fontsize16 ">
                  {formatMessage(messages.ClinicalReading)}
                </div>
              </div>
            )}

            <div className="mt16">
              {pageIs === PATIENTDASHBOARD && (
                <div className="mt24">
                  <div className="medium fontsize16 ">
                    {formatMessage(messages.latestReading)}
                  </div>
                  <div className="medication-horizontal-line " />
                </div>
              )}
              <div className="flex justify-content-start flex-wrap">
                {medicalReadings}
              </div>
            </div>
          </div>
        ) : (
          <div>{formatMessage(messages.noClinicalReading)}</div>
        )}
      </div>
    );
  }
}

const ClinicalReadingForm = Form.create()(injectIntl(ClinicalReading));

export default ClinicalReadingForm;
