import React, { Component, Fragment } from "react";
import dateFns from "date-fns";
import { Avatar, Card } from "antd";
import "./style.less";
import messages from "./messages";
import { injectIntl } from "react-intl";
import { EVENT, REPEAT_TYPE } from "../../constant";
import cardReminder from "../../Assets/images/calendar/ico-reminder-flat-clr.svg";
import profilePicPlaceHolder from "../../Assets/images/ico-placeholder-userdp.svg";

const cardReminderIcon = <img className="icons" alt="" src={cardReminder} />;
const { Meta } = Card;

class ReminderCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      cardClicked: false,
      modalOpen: false
    };
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  handleClick = () => {
    this.setState({
      visible: this.state.visible ? false : true
    });
  };

  handleCardClick = () => {
    this.setState({
      cardClicked: true
    });
  };

  handleLeave = () => {
    this.setState({
      visible: false,
      cardClicked: false
    });
  };

  handleDelete = e => {
    e.preventDefault();
    const {
      deleteReminder,
      eventDetails: { id },
      openedUserId
    } = this.props;
    deleteReminder(id, openedUserId);
  };

  handleEditReminder = e => {
    e.preventDefault();
    const {
      editReminder,
      eventDetails: { id, data: { repeat } = {} }
    } = this.props;
    const series = repeat && repeat !== REPEAT_TYPE.NONE ? true : false;
    editReminder(id, series);
  };

  handleAddNotes = e => {
    e.preventDefault();
    const {
      addNotes,
      eventDetails: { id }
    } = this.props;
    addNotes(id);
  };

  handleAddVitals = () => {};
  handleAddMedication = () => {};
  handleAddClinicalReadings = () => {};

  render() {
    const {
      eventDetails,
      currentUserId,
      openedUserId,
      users = {},
      modal = false,
      cancel = false
    } = this.props;
    const {
      handleDelete,
      handleAddNotes,
      handleEditReminder,
      handleClick,
      handleLeave,
      handleCardClick,
      formatMessage
    } = this;
    const { participantOne, participantTwo } = eventDetails.data;
    const otherUserId =
      participantOne === openedUserId ? participantTwo : participantOne;

    const {
      basicInfo: {
        profilePicLink: otherUserProfilePic = profilePicPlaceHolder,
        name: otherUserName
        // category: otherUserCategory
      } = {}
    } = users[otherUserId] || {};

    const startTime = dateFns.format(
      dateFns.parse(eventDetails.startTime),
      "h:mm A"
    );

    const reminderDate = dateFns.format(
      dateFns.parse(eventDetails.startTime),
      "D MMM YYYY"
    );

    const title =
      eventDetails.data.title !== undefined ? eventDetails.data.title : false;
    const notes =
      eventDetails.data.notes !== undefined ? eventDetails.data.notes : false;

    const status = eventDetails.status;
    const isDisabled = status === EVENT.STATUS.PASSED;

    let creatorName = null;
    if (users[participantOne]) {
      creatorName =
        currentUserId === participantOne
          ? "Me"
          : users[participantOne].basicInfo.name;
    }

    //const statusName =eventDetails.status.charAt(0).toUpperCase() +eventDetails.status.slice(1);

    const { visible } = this.state;
    return (
      <Fragment>
        <Card
          onMouseLeave={modal ? null : handleLeave}
          onClick={handleCardClick}
          hoverable={cancel ? false : true}
          title={[
            <div key={eventDetails.id}>
              <div className="card-top">Scheduled By {creatorName}</div>
              <div className="card-title">
                {cardReminderIcon}
                <span className="time-text">
                  {startTime}, {reminderDate}
                </span>
              </div>
              <div className="card-modal-options">
                <div className="card-cover">
                  <div className="coach-activity-reminder">
                    {title
                      ? title.length < 30
                        ? title
                        : title.substr(0, 30) + "..."
                      : null}
                  </div>
                  {otherUserName && (
                    <span className="coach-avatar">
                      <Avatar src={otherUserProfilePic} />
                      {otherUserName}
                    </span>
                  )}
                </div>
                {cancel !== true && (
                  <div className="more-options mt12">
                    <div className="mr25" onClick={handleClick}>
                      <span>{visible ? "" : "More Options"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* {!cancel && visible && (
                <div className="text-overflow break-word pt4">
                  {notes ? notes : null}
                </div>
              )} */}
            </div>
          ]}
        >
          {!cancel && (
            <Meta
              description={
                notes
                  ? [
                      <div
                        key={eventDetails.id}
                        className="card-meta text-overflow break-word"
                      >
                        {/* {modal && ( */}
                        <div className={visible ? "visible" : "invisible"}>
                          {notes}
                        </div>
                      </div>
                    ]
                  : []
              }
            />
          )}
          {!cancel && visible && (
            <Fragment>
              {
                <div key={eventDetails.id} className="options">
                  <div className="more-options">
                    <hr />
                    <div onClick={handleClick}>
                      {visible ? "Less Options" : "More Options"}
                    </div>
                  </div>
                  <div
                    className={`${isDisabled ? "disabled-options" : ""} 
                    ${visible ? "visible" : "invisible"}`}
                  >
                    <div
                      className="drop-down"
                      onClick={isDisabled ? undefined : handleAddNotes}
                    >
                      {formatMessage(messages.editNotes)}
                    </div>
                    <div
                      className="drop-down"
                      onClick={isDisabled ? undefined : handleEditReminder}
                    >
                      {formatMessage(messages.editReminder)}
                    </div>
                    <div
                      onClick={isDisabled ? undefined : handleDelete}
                      className="drop-down cancel"
                    >
                      {formatMessage(messages.deleteReminder)}
                    </div>
                  </div>
                </div>
              }
            </Fragment>
          )}
        </Card>
      </Fragment>
    );
  }
}
export default injectIntl(ReminderCard);
