import React, { Component } from "react";
import { Button } from "antd";
import { injectIntl } from "react-intl";
import moment from "moment";
import GoBack from "../../../Assets/images/ico-back.svg";
import multiselect from "../../../Assets/images/ico-multiselect.png";
import "./style.less";
import messages from "./message";

class QuestionnaireHeader extends Component {
  render() {
    const { handleGoBack, surveytemplates = [] } = this.props;

    const { templateId } = this.props.match.params;
    let name = "";

    if (surveytemplates[templateId]) {
      const { title } = surveytemplates[templateId];
      name = title;
    }
    return (
      <div className="profileHead">
        <div className="back-location flex align-items-center">
          <img
            alt=""
            src={GoBack}
            className="backButton clickable mr16"
            onClick={handleGoBack}
          />
          <span className="ml16">All Surveys</span>
          <span className="previousLocation ml16">{name}</span>
        </div>
      </div>
    );
  }
}

export default injectIntl(QuestionnaireHeader);
