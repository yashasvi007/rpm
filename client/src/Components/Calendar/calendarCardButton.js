import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { injectIntl } from "react-intl";
import "./style.less";
import { EVENT } from "../../constant";
import messages from "./messages";

class CalendarCardButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      setAppointmentStatus,
      formatMessage,
      isDisabled,
      status,
      eventDetails
    } = this.props;
    const {
      data: { activityMode }
    } = eventDetails;

    if (activityMode === EVENT.ACTIVITY_MODE.CHAT) {
      if (status === EVENT.STATUS.PENDING || status === EVENT.STATUS.STARTED) {
        return (
          <div className="calendar-card-button">
            <Link
              to={`${"/remoteConsulting/" + eventDetails.id}`}
              target="_blank"
            >
              <Button
                className="done-button"
                disabled={status === EVENT.STATUS.STARTED ? false : true}
                //onClick={() => joinCall(eventDetails.id)}
              >
                {formatMessage(messages.joinCallButton)}
              </Button>
            </Link>
          </div>
        );
      } else {
        return null;
      }
    }

    return (
      <div className="calendar-card-button">
        <Button
          disabled={isDisabled}
          className={
            status === EVENT.STATUS.COMPLETED ? "undo-button" : "done-button"
          }
          onClick={setAppointmentStatus}
        >
          {status === EVENT.STATUS.COMPLETED
            ? formatMessage(messages.undoButton)
            : formatMessage(messages.doneButton)}
        </Button>
      </div>
    );
  }
}

export default injectIntl(CalendarCardButton);
