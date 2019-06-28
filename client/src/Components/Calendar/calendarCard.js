import React, { Component, Fragment } from "react";
import dateFns from "date-fns";
import { Avatar, Card } from "antd";
import "./style.less";
import messages from "./messages";
import { injectIntl } from "react-intl";
import CalendarCardButton from "./calendarCardButton";

import cardVisit from "../../Assets/images/calendar/ico-visit-activity-flat-clr.png";
import cardVisitMissed from "../../Assets/images/calendar/ico-visit-activity-missed-flat-clr.svg";
import cardCall from "../../Assets/images/calendar/ico-mobile-activity-flat-clr.svg";
import cardCallMissed from "../../Assets/images/calendar/ico-mobile-activity-missed-flat-clr.svg";
import cardVideoCall from "../../Assets/images/calendar/ico-call-activity-flat-clr.svg";
import cardVideoCallMissed from "../../Assets/images/calendar/ico-video-activity-missed-flat-clr.svg";
import cardReminder from "../../Assets/images/calendar/ico-reminder-flat-clr.svg";
import medic from "../../Assets/images/calendar/ico-apt-type-line.png";
import profilePicPlaceHolder from "../../Assets/images/ico-placeholder-userdp.svg";

import {
  USER_CATEGORY,
  EVENT,
  USER_STATUS,
  APPOINTMENT_TYPE,
  REPEAT_TYPE
} from "../../constant";

const { Meta } = Card;

const cardVisitIcon = <img className="icons" alt="" src={cardVisit} />;
const cardVisitIconMissed = (
  <img className="icons" alt="" src={cardVisitMissed} />
);
const cardCallIcon = <img className="icons" alt="" src={cardCall} />;
const cardCallIconMissed = (
  <img className="icons" alt="" src={cardCallMissed} />
);
const cardVideoCallIcon = <img className="icons" alt="" src={cardVideoCall} />;
const cardVideoCallIconMissed = (
  <img className="icons" alt="" src={cardVideoCallMissed} />
);
const cardReminderIcon = <img className="icons" alt="" src={cardReminder} />;
const medicationIcon = (
  <img className="icon-activity-modes" alt="" src={medic} />
);

export const getPatientParticipant = (users, eventDetails) => {
  const { participantTwo, participantOne } = eventDetails.data;
  const { basicInfo: { category } = {} } = users[participantOne] || {};
  if (category === USER_CATEGORY.PATIENT) {
    return participantOne;
  } else {
    return participantTwo;
  }
};

class CalendarCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      cardClicked: false,
      modalOpen: false
    };
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  renderCardIcon = (activityMode, status) => {
    switch (activityMode) {
      case EVENT.ACTIVITY_MODE.CALL:
        return status === EVENT.STATUS.PASSED
          ? cardCallIconMissed
          : cardCallIcon;
      case EVENT.ACTIVITY_MODE.VISIT:
        return status === EVENT.STATUS.PASSED
          ? cardVisitIconMissed
          : cardVisitIcon;
      case EVENT.ACTIVITY_MODE.CHAT:
        return status === EVENT.STATUS.PASSED
          ? cardVideoCallIconMissed
          : cardVideoCallIcon;
      default:
        return cardReminderIcon;
    }
  };

  renderCardStatus = status => {
    switch (status) {
      case EVENT.STATUS.PENDING:
        return "Scheduled";
      case EVENT.STATUS.PASSED:
        return "Overdue";
      case EVENT.STATUS.COMPLETED:
        return "Completed";
      case EVENT.STATUS.STARTED:
        return "Active";
      default:
        return null;
    }
  };

  getDifference = (from, to) => {
    let diff = dateFns.differenceInMinutes(
      dateFns.parse(to),
      dateFns.parse(from)
    );
    if (diff > 60) {
      diff =
        dateFns.differenceInHours(dateFns.parse(to), dateFns.parse(from)) +
        " hr";
    } else if (diff > 0 && diff <= 60) {
      diff = diff + " min";
    } else {
      diff = null;
    }
    return diff;
  };

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

  handleCancel = e => {
    e.preventDefault();
    const {
      openCancelModal,
      eventDetails: { id },
      openedUserId
    } = this.props;
    openCancelModal(id, openedUserId);
  };

  handleEditNotes = e => {
    e.preventDefault();
    const {
      editNotes,
      eventDetails: { id }
    } = this.props;
    editNotes(id);
  };

  handleReschedule = e => {
    e.preventDefault();
    const {
      rescheduleEvent,
      eventDetails: { id, data: { repeat } = {} }
    } = this.props;
    const series = repeat && repeat !== REPEAT_TYPE.NONE ? true : false;
    rescheduleEvent(id, series);
  };

  handleAddVitals = e => {
    e.preventDefault();
    const { eventDetails, handleUpdateVital, users } = this.props;
    const user = getPatientParticipant(users, eventDetails);

    handleUpdateVital(user);
  };
  handleAddMedication = e => {
    e.preventDefault();
    const { eventDetails, handleUpdateMedication, users } = this.props;
    const user = getPatientParticipant(users, eventDetails);

    handleUpdateMedication(user);
  };
  handleAddClinicalReadings = e => {
    e.preventDefault();
    const { eventDetails, handleUpdateClinicalReading, users } = this.props;
    const user = getPatientParticipant(users, eventDetails);

    handleUpdateClinicalReading(user);
  };

  checkToDisableCard = (participantOne, participantTwo) => {
    const { users = {} } = this.props;
    const {
      basicInfo: { category: userOneCategory } = {},
      status: userOneStatus
    } = users[participantOne] || {};
    const {
      basicInfo: { category: userTwoCategory } = {},
      status: userTwoStatus
    } = users[participantTwo] || {};
    if (
      userOneCategory === USER_CATEGORY.PATIENT &&
      userOneStatus !== USER_STATUS.ENROLLED
    ) {
      return true;
    } else if (
      userTwoCategory === USER_CATEGORY.PATIENT &&
      userTwoStatus !== USER_STATUS.ENROLLED
    ) {
      return true;
    } else {
      return false;
    }
  };

  setAppointmentStatus = () => {
    const {
      setAppointmentStatus,
      fetchEventsAgain,
      openedUserId: userId,
      eventDetails: {
        id: eventId,
        calendarStartingDate,
        calendarEndingDate,
        status: currentStatus
      }
    } = this.props;
    const status =
      currentStatus === EVENT.STATUS.COMPLETED
        ? EVENT.STATUS.PASSED
        : EVENT.STATUS.COMPLETED;
    const details = {
      eventId: eventId,
      userId: userId,
      status: status
      //calendarStartingDate: calendarStartingDate,
      //calendarEndingDate: calendarEndingDate
    };
    setAppointmentStatus(details).then(response =>
      fetchEventsAgain(userId, calendarStartingDate, calendarEndingDate)
    );
  };

  renderButton = (isDisabled, status, eventDetails) => {
    const { setAppointmentStatus, formatMessage } = this;
    return (
      <CalendarCardButton
        setAppointmentStatus={setAppointmentStatus}
        formatMessage={formatMessage}
        isDisabled={isDisabled}
        status={status}
        eventDetails={eventDetails}
      />
    );
  };

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
      handleCancel,
      handleAddClinicalReadings,
      handleAddMedication,
      handleAddVitals,
      handleReschedule,
      handleEditNotes,
      handleClick,
      handleLeave,
      handleCardClick,
      formatMessage
    } = this;
    const { participantOne, participantTwo } = eventDetails.data;
    const otherUserId =
      participantOne === openedUserId ? participantTwo : participantOne;
    const showYou = otherUserId === currentUserId ? " (You)" : "";
    let creatorName = null;
    if (users[participantOne]) {
      creatorName =
        currentUserId === participantOne
          ? "Me"
          : users[participantOne].basicInfo.name;
    }

    const {
      basicInfo: {
        profilePicLink: otherUserProfilePic = profilePicPlaceHolder,
        name: otherUserName,
        category: otherUserCategory
      } = {}
    } = users[otherUserId] || {};

    const startTime = dateFns.format(
      dateFns.parse(eventDetails.startTime),
      "h:mm A"
    );

    const { basicInfo: { category: loggedInUserCategory } = {} } = users[
      currentUserId
    ];

    // const {
    //   status: openedUserStatus,
    //   basicInfo: { category: openedUserCategory } = {}
    // } = users[openedUserId] || {};
    const isDisabled = this.checkToDisableCard(participantOne, participantTwo);

    const notes =
      eventDetails.data.notes !== undefined ? eventDetails.data.notes : false;

    const status = eventDetails.status;
    const activityMode = eventDetails.data.activityMode;
    const icon = this.renderCardIcon(activityMode, status);

    const statusName = this.renderCardStatus(eventDetails.status);

    const activityName =
      activityMode.charAt(0).toUpperCase() + activityMode.slice(1);

    const difference =
      eventDetails.startTime && eventDetails.endTime
        ? this.getDifference(eventDetails.startTime, eventDetails.endTime)
        : null;

    const categoryName =
      otherUserCategory === USER_CATEGORY.CARE_COACH
        ? "Coach"
        : otherUserCategory === USER_CATEGORY.DOCTOR
        ? "Doctor"
        : "Patient";

    const { match: { params: { entity } = {} } = {} } = this.props;

    const cardStatusCompletedBy =
      status === EVENT.STATUS.COMPLETED
        ? formatMessage(messages.markAsDoneBy)
        : formatMessage(messages.scheduledBy);

    const { visible } = this.state;
    return (
      <Fragment>
        <Card
          onMouseLeave={modal ? null : handleLeave}
          onClick={handleCardClick}
          hoverable={cancel ? false : true}
          title={[
            <div key={eventDetails.id}>
              <div className="card-top">
                {cardStatusCompletedBy} {creatorName}
              </div>
              <div className="card-title">
                {icon}
                <span className="time-text">
                  {startTime}, {difference}
                </span>
                <div
                  className={`status ${
                    status === EVENT.STATUS.COMPLETED ||
                    status === EVENT.STATUS.STARTED
                      ? "status-completed"
                      : status === EVENT.STATUS.PASSED
                      ? "status-overdue"
                      : "status-upcoming"
                  }`}
                >
                  {statusName}
                </div>
                {!cancel && this.renderButton(isDisabled, status, eventDetails)}
              </div>
              <div className="card-cover">
                <span className="coach-activity">
                  {categoryName} {activityName}
                </span>
                <span className="coach-avatar">
                  <Avatar src={otherUserProfilePic} />
                  {otherUserName} {showYou}
                </span>
                <div className="card-modal-options">
                  <div className="card-activity">
                    {activityMode === APPOINTMENT_TYPE.MEDICATION
                      ? medicationIcon
                      : medicationIcon}
                    {activityName}
                  </div>
                  {cancel !== true && (
                    <div className="more-options">
                      <div className="mr25" onClick={handleClick}>
                        <span>{visible ? "" : "More Options"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                        {/* )} */}
                        {/* {!modal && (
                          <div
                            className={
                              visible || cardClicked ? "visible" : "invisible"
                            }
                          >
                            {notes}
                          </div>
                        )} */}
                      </div>
                    ]
                  : []
              }
            />
          )}
          {!cancel && (
            <Fragment>
              <div key={eventDetails.id} className="options">
                {/* {!modal && (
                  <div className="more-options">
                    <hr />
                    <div onClick={handleClick}>
                      <span>{visible ? "Less Options" : "More Options"}</span>
                    </div>
                  </div>
                )} */}
                <div className="more-options">
                  {visible ? <hr /> : ""}
                  <div onClick={handleClick}>
                    <span>{visible ? "Less Options" : ""}</span>
                  </div>
                </div>

                {status === EVENT.STATUS.COMPLETED ? (
                  loggedInUserCategory === USER_CATEGORY.DOCTOR ||
                  entity === USER_CATEGORY.DOCTOR ? (
                    <div
                      className={`${isDisabled ? "disabled-options" : ""} 
                    ${
                      visible && otherUserCategory !== "doctor"
                        ? "visible"
                        : "invisible"
                    }`}
                    >
                      <div
                        className="drop-down"
                        onClick={isDisabled ? undefined : handleEditNotes}
                      >
                        {formatMessage(messages.editNotes)}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`${isDisabled ? "disabled-options" : ""} 
                    ${
                      visible && otherUserCategory !== "doctor"
                        ? "visible"
                        : "invisible"
                    }`}
                    >
                      <div
                        className="drop-down"
                        onClick={isDisabled ? undefined : handleAddVitals}
                      >
                        {formatMessage(messages.updateVitals)}
                      </div>
                      {loggedInUserCategory !== USER_CATEGORY.PATIENT && (
                        <div
                          className="drop-down"
                          onClick={isDisabled ? undefined : handleAddMedication}
                        >
                          {formatMessage(messages.updateMedication)}
                        </div>
                      )}
                      <div
                        className="drop-down"
                        onClick={
                          isDisabled ? undefined : handleAddClinicalReadings
                        }
                      >
                        {formatMessage(messages.updateClinicalReadings)}
                      </div>
                      <div
                        className="drop-down"
                        onClick={isDisabled ? undefined : handleEditNotes}
                      >
                        {formatMessage(messages.editNotes)}
                      </div>
                    </div>
                  )
                ) : (
                  <div
                    className={`${isDisabled ? "disabled-options" : ""} 
                    ${visible ? "visible" : "invisible"}`}
                  >
                    <div
                      className="drop-down"
                      onClick={isDisabled ? undefined : handleReschedule}
                    >
                      {formatMessage(messages.reschedule)}
                    </div>
                    <div
                      className="drop-down"
                      onClick={isDisabled ? undefined : handleEditNotes}
                    >
                      {formatMessage(messages.editNotes)}
                    </div>
                    {status !== EVENT.STATUS.PASSED && (
                      <div
                        onClick={isDisabled ? undefined : handleCancel}
                        className="drop-down cancel"
                      >
                        {formatMessage(messages.cancel)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Fragment>
          )}
        </Card>
        {/* {this.cancelAppointment()} */}
        {/* {modalOpen && <CancelAppointment {...this.props} />}; */}
      </Fragment>
    );
  }
}
//export default CalendarCard;
export default injectIntl(CalendarCard);
