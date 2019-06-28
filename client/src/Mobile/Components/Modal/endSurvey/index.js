import React, { Component } from "react";
import { Modal, Button } from "antd";
import { injectIntl } from "react-intl";
import isEmpty from "lodash-es/isEmpty";
import messages from "./message";
import alertIcon from "../../../../Assets/images/round-warning-24-px.svg";

class EndSurvey extends Component {
  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  handleEndSurvey = async e => {
    const { surveyId, endSurveys } = this.props;
    try {
      await endSurveys(surveyId);
      window.location.href = "/surveys/Completed";
    } catch (err) {}
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  footer = () => {
    const { requesting } = this.props;
    const { formatMessage, handleCancel, handleEndSurvey } = this;
    return (
      <div className="flex align-items-center justify-content-end h72px mr24">
        <Button className="iqvia-btn cancel mr8" onClick={handleCancel}>
          {formatMessage(messages.cancel)}
        </Button>
        <Button
          className="iqvia-btn warning"
          type="primary"
          loading={requesting}
          onClick={handleEndSurvey}
        >
          {formatMessage(messages.endSurveyButton)}
        </Button>
      </div>
    );
  };

  render() {
    const {
      show: visible,
      isError,
      intl: { formatMessage },
      programId,
      programs_data = {}
    } = this.props;

    if (visible === false) {
      return null;
    }

    let progrmaName = "";
    if (!isEmpty(programs_data)) {
      const { name } = programs_data[programId] || {};
      progrmaName = name;
    }

    const { handleCancel, footer } = this;

    const modalProps = {
      visible: visible || isError,
      title: `${formatMessage(messages.endSurvey)} ${progrmaName}`,
      okButtonProps: {},
      onCancel: handleCancel,
      wrapClassName: "global-modal full-height",
      destroyOnClose: true,
      bodyStyle: { height: "100%" },
      width: "480px",
      footer: footer()
    };
    return (
      <Modal {...modalProps}>
        <div className="black fontsize16 pl48 pr24 mt8">
          {formatMessage(messages.content)}
        </div>
        <div className="black fontsize16 pl48 pr24 mt16">
          {formatMessage(messages.message)}
        </div>
        <div className="flex align-items-center alert w100 pl24">
          <img alt="alert" src={alertIcon} className="mr16" />
          <div className="steel-grey fontsize12">
            {formatMessage(messages.alert)}
          </div>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(EndSurvey);
