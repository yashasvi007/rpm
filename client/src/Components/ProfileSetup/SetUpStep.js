import React from "react";
import { Steps, Icon } from "antd";
import { injectIntl } from "react-intl";
import messages from "./message";

const Step = Steps.Step;
const circleIcon = <Icon type="check-circle" theme="filled" />;

const SetUpStep = props => {
  const {
    intl: { formatMessage },
    current,
    className = ""
  } = props;

  const step1 = (
    <div className="fontsize12">{formatMessage(messages.step1)}</div>
  );
  const step2 = (
    <div className="fontsize12">{formatMessage(messages.step2)}</div>
  );
  const step3 = (
    <div className="fontsize12">{formatMessage(messages.step3)}</div>
  );
  return (
    <Steps
      className={`setup-step ${className}`}
      labelPlacement="vertical"
      current={current}
    >
      <Step title={step1} icon={circleIcon} />
      <Step title={step2} icon={circleIcon} />
      <Step title={step3} icon={circleIcon} />
    </Steps>
  );
};

export default injectIntl(SetUpStep);
