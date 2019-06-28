import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { ACTIONS } from "../../../Helper/event/appointment/constant";
import messages from "./message";

class MoreOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  handleEditNotes = () => {
    const { editNotes } = this.props;
    editNotes();
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
  };

  handleRescheduleThis = () => {
    const { handleRescheduleThis } = this.props;
    handleRescheduleThis();
  };

  handleRescheduleAll = () => {
    const { handleRescheduleAll } = this.props;
    handleRescheduleAll();
  };

  handleUpdateVitals = () => {
    const { handleUpdateVitals } = this.props;
    handleUpdateVitals();
  };

  handleUpdateMedication = () => {
    const { handleUpdateMedication } = this.props;
    handleUpdateMedication();
  };

  handleUpdateClinicalReading = () => {
    const { handleUpdateClinicalReading } = this.props;
    handleUpdateClinicalReading();
  };

  moreOptions = key => {
    const {
      formatMessage,
      handleUpdateClinicalReading,
      handleUpdateMedication,
      handleUpdateVitals,
      handleRescheduleAll,
      handleRescheduleThis,
      handleEditNotes,
      handleCancel
    } = this;
    switch (key) {
      case ACTIONS.EDIT_NOTES_OF_APPOINTMENT: {
        return (
          <div key={key} className="drop-down" onClick={handleEditNotes}>
            {formatMessage(messages.editNotes)}{" "}
          </div>
        );
      }
      case ACTIONS.CANCEL_APPOINTMENT: {
        return (
          <div key={key} className="drop-down cancel" onClick={handleCancel}>
            {formatMessage(messages.cancel)}
          </div>
        );
      }
      case ACTIONS.RESCHEDULE_APPOINTMENT: {
        return (
          <div key={key} className="drop-down" onClick={handleRescheduleThis}>
            {formatMessage(messages.reschedule)}
          </div>
        );
      }
      case ACTIONS.RESCHEDULE_THIS_APPOINTMENT: {
        return (
          <div key={key} className="drop-down" onClick={handleRescheduleThis}>
            {formatMessage(messages.rescheduleThis)}
          </div>
        );
      }
      case ACTIONS.RESCHEDULE_ALL_APPOINTMENT: {
        return (
          <div key={key} className="drop-down" onClick={handleRescheduleAll}>
            {formatMessage(messages.rescheduleAll)}
          </div>
        );
      }
      case ACTIONS.UPADTE_VITALS: {
        return (
          <div key={key} className="drop-down" onClick={handleUpdateVitals}>
            {formatMessage(messages.updateVitals)}
          </div>
        );
      }
      case ACTIONS.UPDATE_CLINICAL_READING: {
        return (
          <div
            key={key}
            className="drop-down"
            onClick={handleUpdateClinicalReading}
          >
            {formatMessage(messages.updateClinicalReadings)}
          </div>
        );
      }
      case ACTIONS.UPDATE_MEDICATION: {
        return (
          <div key={key} className="drop-down" onClick={handleUpdateMedication}>
            {formatMessage(messages.updateMedication)}
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
