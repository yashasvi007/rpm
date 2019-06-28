import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { ACTIONS } from "../../../../Helper/event/appointment/constant";
import messages from "./message";
//import { EVENT } from "../../../constant";

class ActionsButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  handleMarkAsDone = () => {
    const { handleMarkAsDone } = this.props;
    handleMarkAsDone();
  };

  handleUndo = () => {
    const { handleUndo } = this.props;
    handleUndo();
  };

  render() {
    const { formatMessage, handleUndo, handleMarkAsDone } = this;
    const { data: { type, disabled } = {}, event: { id } = {} } = this.props;
    switch (type) {
      case ACTIONS.JOIN_CALL: {
        return (
          <div className="calendar-card-button">
            <Link to={`/remoteConsulting/${id}`} target="_blank">
              <Button className="done-button" disabled={disabled}>
                {formatMessage(messages.joinCallButton)}
              </Button>
            </Link>
          </div>
        );
      }
      case ACTIONS.MARK_AS_DONE: {
        return (
          <div className="calendar-card-button">
            <Button
              disabled={disabled}
              onClick={handleMarkAsDone}
              className={"done-button"}
            >
              {formatMessage(messages.doneButton)}
            </Button>
          </div>
        );
      }
      case ACTIONS.UNDO: {
        return (
          <div className="calendar-card-button">
            <Button
              disabled={disabled}
              onClick={handleUndo}
              className={"undo-button"}
            >
              {formatMessage(messages.undoButton)}
            </Button>
          </div>
        );
      }
      default:
        return null;
    }
  }
}

export default injectIntl(ActionsButton);
