import React, { Component } from "react";
import { Modal, Button, Input } from "antd";
import { injectIntl } from "react-intl";
import messages from "../message";
import "../../style.less";
import alertIcon from "../../../../Assets/images/round-warning-24-px.svg";
import CalendarCard from "../../../../Containers/cards/appointment";
import ReminderCard from "../../../../Containers/cards/reminder";
import { REPEAT_TYPE, EVENT_TYPE } from "../../../../constant";

const { TextArea } = Input;

class CancelAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reasonForCancel: ""
    };
  }
  formatMessage = data => this.props.intl.formatMessage(data);

  componentDidMount() {}

  handleOnTextChange = e => {
    this.setState({ reasonForCancel: e.target.value });
  };

  handleOk = e => {
    const {
      eventDetails: { id: eventId, eventType },
      cancelAppointment,
      cancelReminder
    } = this.props;
    const { reasonForCancel } = this.state;
    if (eventType === EVENT_TYPE.APPOINTMENT) {
      const reason = { reason: reasonForCancel };
      cancelAppointment(eventId, true, reason);
    } else if (eventType === EVENT_TYPE.REMINDER) {
      cancelReminder(eventId, true);
    }
  };

  handleCancelAll = () => {
    console.log("this.props ----", this.props);
    const {
      eventDetails: { id: eventId, eventType },
      cancelAppointment,
      cancelReminder
    } = this.props;
    if (eventType === EVENT_TYPE.APPOINTMENT) {
      cancelAppointment(eventId, false);
    } else if (eventType === EVENT_TYPE.REMINDER) {
      cancelReminder(eventId, false);
    }
  };

  handleCancel = () => {
    const { close } = this.props;
    close();
  };

  footer = () => {
    const { formatMessage, handleCancelAll, handleOk, handleCancel } = this;
    const {
      eventDetails: { eventType, data: { repeat } = {} } = {}
    } = this.props;

    return (
      <div className="flex align-items-center justify-content-space-between">
        <Button className="iqvia-btn cancel ml8 mr8" onClick={handleCancel}>
          {formatMessage(messages.goback)}
        </Button>

        <div className="flex align-items-center justify-content-end h72px mr24">
          {repeat !== REPEAT_TYPE.NONE && (
            <Button
              className="iqvia-btn warning-all-button mr8"
              onClick={handleCancelAll}
            >
              {formatMessage(messages.buttonCancelAll)}
            </Button>
          )}
          <Button
            className="iqvia-btn warning"
            type="primary"
            loading={this.props.requesting}
            onClick={handleOk}
          >
            {formatMessage(
              repeat === REPEAT_TYPE.NONE
                ? eventType === EVENT_TYPE.APPOINTMENT
                  ? messages.cancelAppointment
                  : messages.cancelReminder
                : messages.buttonCancelThisOnly
            )}
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { formatMessage, handleCancel, footer, handleOnTextChange } = this;
    const {
      show: visible,
      currentUserId,
      eventDetails: { eventType, id } = {}
    } = this.props;
    const modalProps = {
      visible: visible,
      title: `${
        eventType === EVENT_TYPE.APPOINTMENT
          ? formatMessage(messages.cancelAppointment)
          : formatMessage(messages.cancelReminder)
      }`,
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
          {`${
            eventType === EVENT_TYPE.APPOINTMENT
              ? formatMessage(messages.contentAppt)
              : formatMessage(messages.contentRem)
          }`}
        </div>
        <div className="black fontsize16 pl48 pr24 mt16">
          {`${
            eventType === EVENT_TYPE.APPOINTMENT
              ? formatMessage(messages.messageAppt)
              : formatMessage(messages.messageRem)
          }`}
        </div>
        <div className=" pl48 pr24 mt16">
          {eventType === EVENT_TYPE.APPOINTMENT && (
            <TextArea
              placeholder={formatMessage(messages.reason)}
              onChange={handleOnTextChange}
            />
          )}
        </div>
        <div className="black fontsize16 pl48 pr24 mt16">
          {eventType === EVENT_TYPE.APPOINTMENT && (
            <CalendarCard
              id={id}
              calendarUserId={currentUserId}
              hideAction={true}
              modal={true}
            />
          )}
          {eventType === EVENT_TYPE.REMINDER && (
            <ReminderCard
              id={id}
              calendarUserId={currentUserId}
              hideAction={true}
              modal={true}
            />
          )}
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

export default injectIntl(CancelAppointment);
