import React, { Component, Fragment } from "react";
import { Col } from "antd";
import { injectIntl } from "react-intl";
import SurveyTemplateCard from "../Cards/surveyTemplatesCard";
import "./style.less";

class Surveys extends Component {
  render() {
    const { surveytemplates = [], handleOnClick } = this.props;
    const { surveytemplatesId } = this.props;
    return (
      <Fragment>
        {surveytemplatesId.map(id => {
          return (
            <SurveyTemplateCard
              key={id}
              data={surveytemplates[id]}
              id={id}
              handleOnClick={handleOnClick}
            />
          );
        })}
      </Fragment>
    );
  }
}

export default injectIntl(Surveys);
