import React, { Component, Fragment } from "react";
import { Progress, Button } from "antd";
import { injectIntl } from "react-intl";
import { Link, scroller } from "react-scroll";
import GoBack from "../../Assets/images/ico-back.svg";
import messages from "./message";

class SurveyResponseHeader extends Component {
  scrollToElement = name => {
    scroller.scrollTo(name, {
      duration: 100,
      delay: 0,
      smooth: true,
      offset: -180
    });
  };

  render() {
    const {
      percent,
      increase,
      decline,
      nextDisable,
      prevDisable,
      questionIndex,
      totalQuestion,
      handleOnSubmit,
      intl: { formatMessage },
      handleGoBack
    } = this.props;
    return (
      <Fragment>
        <div className="survey-response-header">
          <div className="flex justify-content-space-between h100 align-items-center response-header">
            <div className="flex-1">
              <img
                alt=""
                src={GoBack}
                className="backButton clickable mr8"
                onClick={handleGoBack}
              />
              <span className="previousLocation">All Surveys</span>
            </div>
            <div className="flex align-items-center flex-1 justify-content-end prev-next-btn">
              <div className="flex align-items-center progress-bar-div flex-1 mr24">
                <div className="fontsize14 mr8 label-color">
                  {`${percent}% Completed`}
                </div>
                <div className="flex-1">
                  <Progress
                    strokeColor="#ffa300"
                    percent={percent}
                    showInfo={false}
                  />
                </div>
              </div>
              <Link
                activeClass="active"
                to={`${questionIndex}`}
                duration={250}
                containerId="containerElement"
                className="links"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.scrollToElement(`${questionIndex}`);
                }}
              >
                <Button
                  onClick={decline}
                  disabled={prevDisable}
                  className="mr16 change-btn"
                >
                  <span className={prevDisable ? `dark-50` : `dark`}>
                    {formatMessage(messages.prev)}
                  </span>
                </Button>
              </Link>
              <Link
                activeClass="active"
                to={`${questionIndex}`}
                className="links"
                duration={250}
                containerId="containerElement"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.scrollToElement(`${questionIndex}`);
                }}
              >
                <Button
                  onClick={increase}
                  disabled={nextDisable}
                  className="change-btn"
                >
                  <span className={nextDisable ? `dark-50` : `dark`}>
                    {formatMessage(messages.next)}
                  </span>
                </Button>
              </Link>
              {totalQuestion === questionIndex && (
                <Button
                  className="iqvia-btn ml16"
                  type="primary"
                  onClick={handleOnSubmit}
                >
                  {formatMessage(messages.completeSurvey)}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(SurveyResponseHeader);
