import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Button } from "antd";
import isEmpty from "lodash-es/isEmpty";
import Doc from "./doc";
import messages from "./messages";
import backIcon from "../../../Assets/images/ico-back.svg";

class PatientResponseHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadSuccess: true,
      prepareDoc: false
    };
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (
      !isEmpty(this.props.medicalsData) &&
      !isEmpty(this.props.users) &&
      !isEmpty(this.props.questions) &&
      !isEmpty(this.props.response) &&
      (this.props.medicalsData !== prevProps.medicalsData ||
        this.props.users !== prevProps.users ||
        this.props.questions !== prevProps.questions ||
        this.props.response !== prevProps.response)
    ) {
      this.setState({
        prepareDoc: true
      });
    }
  }

  render() {
    const { handleGoBack, surveyTitle = "" } = this.props;
    const { formatMessage } = this;
    const { prepareDoc } = this.state;
    return (
      <Fragment>
        <div className="fixed-header-sticky-patient-response">
          <div className=" flex align-items-center justify-content-space-between w100">
            <div className="  text-align-l flex column align-items-start justify-content-space-between">
              <div
                className={
                  "flex row align-items-center justify-content-space-between w100 pl20"
                }
              >
                <img
                  className="clickable"
                  alt=""
                  onClick={handleGoBack}
                  src={backIcon}
                  style={{ width: "20px" }}
                />
                <div className="dark fontsize12 pl20">
                  {formatMessage(messages.survey_Details)}
                </div>
              </div>
            </div>
            <div className="flex justify-content-end align-items-center">
              <div className="fontsize12">
                <Button className={"iqvia-primary-btn primary-color"}>
                  {prepareDoc && <Doc {...this.props} />}
                </Button>
              </div>
              <div className="mr16 ml16" />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(PatientResponseHeader);
