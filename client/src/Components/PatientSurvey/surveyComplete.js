import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import SmilyFace from "../../Assets/images/asset-fb-smiley.svg";
import messages from "./message";

const COUNTDOWN_DEFAULT = 3;

class SurveyComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countdown: COUNTDOWN_DEFAULT
    };
  }

  tick = () => {
    const { countdown } = this.state;

    if (countdown === 0) {
      this.props.history.push("/");
    } else {
      this.setState({ countdown: countdown - 1 });
    }
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { countdown } = this.state;
    const {
      intl: { formatMessage }
    } = this.props;
    return (
      <Fragment>
        <div className="survey-completed">
          <div className="flex column align-items-center">
            <img src={SmilyFace} alt="" />
            <div className="fontsize32 dark">
              {formatMessage(messages.thanksfortakingsurvey)}
            </div>
            <div className="fontsize14 label-color">
              {`${formatMessage(
                messages.redirectingtoDashboardin
              )} ${countdown} ${formatMessage(messages.seconds)}`}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(SurveyComplete);
