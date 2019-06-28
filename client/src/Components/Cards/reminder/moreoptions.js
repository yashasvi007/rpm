import React, { Component } from "react";
import { injectIntl } from "react-intl";

import { ACTIONS } from "../../../Helper/event/reminder/constant";

import messages from "./message";

class MoreOptions extends Component {
  formatMessage = data => this.props.intl.formatMessage(data);

  handleEditNotes = e => {
    e.preventDefault();
    const { editNotes } = this.props;
    editNotes();
  };

  handleReschedule = e => {
    e.preventDefault();
    const { rescheduleEvent } = this.props;
    rescheduleEvent(false);
  };

  handleRescheduleAll = e => {
    e.preventDefault();
    const { rescheduleEvent } = this.props;
    rescheduleEvent(true);
  };

  handleCancel = e => {
    e.preventDefault();
    const { openCancelModal } = this.props;
    openCancelModal();
  };

  moreOptions = key => {
    const {
      formatMessage,
      handleReschedule,
      handleRescheduleAll,
      handleEditNotes,
      handleCancel
    } = this;
    switch (key) {
      case ACTIONS.EDIT_NOTES_OF_REMINDER: {
        return (
          <div key={key} className="drop-down" onClick={handleEditNotes}>
            {formatMessage(messages.editNotes)}{" "}
          </div>
        );
      }
      case ACTIONS.CANCEL_REMINDER: {
        return (
          <div key={key} className="drop-down cancel" onClick={handleCancel}>
            {formatMessage(messages.cancel)}
          </div>
        );
      }
      case ACTIONS.RESCHEDULE_REMINDER: {
        return (
          <div key={key} className="drop-down" onClick={handleReschedule}>
            {formatMessage(messages.reschedule)}
          </div>
        );
      }
      case ACTIONS.RESCHEDULE_THIS_REMINDER: {
        return (
          <div key={key} className="drop-down" onClick={handleReschedule}>
            {formatMessage(messages.rescheduleThis)}
          </div>
        );
      }
      case ACTIONS.RESCHEDULE_ALL_REMINDER: {
        return (
          <div key={key} className="drop-down" onClick={handleRescheduleAll}>
            {formatMessage(messages.rescheduleAll)}
          </div>
        );
      }
      default:
        return null;
    }
  };

  render() {
    const { actions = [] } = this.props;

    return actions.map(val => this.moreOptions(val));
  }
}

export default injectIntl(MoreOptions);
