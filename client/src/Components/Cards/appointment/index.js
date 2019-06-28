import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import withRouter from "react-router/es/withRouter";
import { Avatar, Card } from "antd";
import moment from "moment";
import messages from "./message";
import ActionButton from "./actionButton";
import MoreOptions from "./moreoptions";
import ActivityIcon from "./activityIcon";
import AppointmentIcon from "./appointmentTypeIcon";
import AppointmentHelper from "../../../Helper/event/appointment";
import profilePicPlaceHolder from "../../../Assets/images/ico-placeholder-userdp.svg";
import { USER_CATEGORY, EVENT } from "../../../constant";
//import "../style.less";

const { Meta } = Card;

class AppointmentCard extends Component {
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
      visible: !this.state.visible
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

  handleEditNotes = () => {
    const { editNotes } = this.props;
    editNotes();
  };

  handleCancel = () => {
    const { openCancelModal } = this.props;
    openCancelModal();
  };

  handleMarkAsDone = () => {
    const { setAppointmentStatus } = this.props;
    setAppointmentStatus(EVENT.STATUS.COMPLETED);
  };

  handleUndo = () => {
    const {
      setAppointmentStatus,
      event: { startTime, endTime }
    } = this.props;
    const current = moment();
    console.log(current, moment(endTime));
    if (moment(endTime).isBefore(current)) {
      setAppointmentStatus(EVENT.STATUS.PASSED);
    } else if (moment(startTime).isAfter(current)) {
      setAppointmentStatus(EVENT.STATUS.PENDING);
    } else if (
      moment(startTime).isBefore(current) &&
      moment(endTime).isAfter(current)
    ) {
      setAppointmentStatus(EVENT.STATUS.STARTED);
    }
  };

  handleRescheduleThis = () => {
    const { rescheduleEvent } = this.props;
    rescheduleEvent(false);
  };

  handleRescheduleAll = () => {
    const { rescheduleEvent } = this.props;
    rescheduleEvent(true);
  };

  getPatientId = () => {
    const {
      participantOne: {
        basicInfo: {
          category: participantOneCategory,
          _id: participantOneId
        } = {}
      } = {},
      participantTwo: { basicInfo: { _id: participantTwoId } = {} } = {}
    } = this.props;

    return participantOneCategory === USER_CATEGORY.PATIENT
      ? participantOneId
      : participantTwoId;
  };

  handleUpdateVitals = () => {
    const { viewer: { basicInfo: { category = {} } = {} } = {} } = this.props;
    const id = this.getPatientId();
    if (category === USER_CATEGORY.CARE_COACH) {
      this.props.history.push({
        pathname: `/patient/${id}/Medical-Details`,
        state: {
          currentMedicalField: "Vital"
        }
      });
    } else if (category === USER_CATEGORY.PATIENT) {
      this.props.history.push("/medicals/Vital");
    }
  };

  handleUpdateMedication = () => {
    const { viewer: { basicInfo: { category = {} } = {} } = {} } = this.props;
    const id = this.getPatientId();
    if (category === USER_CATEGORY.CARE_COACH) {
      this.props.history.push({
        pathname: `/patient/${id}/Medical-Details`,
        state: {
          currentMedicalField: "Medication"
        }
      });
    } else if (category === USER_CATEGORY.PATIENT) {
      this.props.history.push("/medicals/Medication");
    }
  };

  handleUpdateClinicalReading = () => {
    const { viewer: { basicInfo: { category = {} } = {} } = {} } = this.props;
    const id = this.getPatientId();
    if (category === USER_CATEGORY.CARE_COACH) {
      this.props.history.push({
        pathname: `/patient/${id}/Medical-Details`,
        state: {
          currentMedicalField: "Clinical-Reading"
        }
      });
    } else if (category === USER_CATEGORY.PATIENT) {
      this.props.history.push("/medicals/Clinical-Reading");
    }
  };

  getAppointmentWithCategoryText = user => {
    const { basicInfo: { category } = {} } = user;
    switch (category) {
      case USER_CATEGORY.CARE_COACH:
        return "Coach";
      case USER_CATEGORY.DOCTOR:
        return "Doctor";
      case USER_CATEGORY.PATIENT:
        return "Patient";
      default:
        return null;
    }
  };

  render() {
    const { event = {}, modal = false, hideAction = false } = this.props;
    const { id, status } = event;
    const appointmentHelper = new AppointmentHelper(this.props);

    const {
      handleCancel,
      handleUpdateClinicalReading,
      handleUpdateMedication,
      handleUpdateVitals,
      handleRescheduleThis,
      handleRescheduleAll,
      handleEditNotes,
      handleClick,
      handleLeave,
      handleCardClick,
      formatMessage
    } = this;

    const startTime = appointmentHelper.getStartTime();
    // const isDisabled = appointmentHelper.isCardEnable();
    const notes = appointmentHelper.getNotes();
    const statusName = appointmentHelper.getStatus();
    const activityName = appointmentHelper.getActivityName();
    const activityTypeName = appointmentHelper.getActivityTypeName();
    const eventDuration = appointmentHelper.getEventDuration();

    const lastActedUserName = appointmentHelper.getLastActedUser();

    const appointmentWith = appointmentHelper.getAppointmentWithTag();
    const {
      basicInfo: {
        name: appointmentWithUserName,
        profilePicLink: appointmentWithProfilePic = profilePicPlaceHolder
      } = {}
    } = appointmentWith;

    const categoryName = this.getAppointmentWithCategoryText(appointmentWith);

    //const { match: { params: { entity } = {} } = {} } = this.props;

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
          className="calender-card"
          hoverable={!hideAction}
          title={[
            <div key={id}>
              <div className="card-top">
                {cardStatusCompletedBy} {lastActedUserName}
              </div>
              <div className="card-title">
                <AppointmentIcon event={event} />
                <span className="time-text">
                  {startTime}, {eventDuration}
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
                {!hideAction && (
                  <ActionButton
                    event={event}
                    data={appointmentHelper.getAction()}
                    handleMarkAsDone={this.handleMarkAsDone}
                    handleUndo={this.handleUndo}
                  />
                )}
              </div>
              <div className="card-cover">
                <span className="coach-activity">
                  {categoryName} {activityName}
                </span>
                <span className="coach-avatar">
                  <Avatar src={appointmentWithProfilePic} />
                  {appointmentWithUserName}
                </span>
                <div className="card-modal-options">
                  <div className="card-activity">
                    <ActivityIcon event={event} />
                    <span>{activityTypeName}</span>
                  </div>
                  {hideAction !== true && (
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
          {!hideAction && (
            <Meta
              description={
                notes
                  ? [
                      <div
                        key={id}
                        className="card-meta text-overflow break-word"
                      >
                        <div className={visible ? "visible" : "invisible"}>
                          {notes}
                        </div>
                      </div>
                    ]
                  : []
              }
            />
          )}
          {!hideAction && (
            <Fragment>
              <div key={id} className="options">
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
                {visible && (
                  <MoreOptions
                    actions={appointmentHelper.getMoreOption()}
                    {...this.props}
                    editNotes={handleEditNotes}
                    handleCancel={handleCancel}
                    handleRescheduleThis={handleRescheduleThis}
                    handleRescheduleAll={handleRescheduleAll}
                    handleUpdateVitals={handleUpdateVitals}
                    handleUpdateMedication={handleUpdateMedication}
                    handleUpdateClinicalReading={handleUpdateClinicalReading}
                  />
                )}
              </div>
            </Fragment>
          )}
        </Card>
      </Fragment>
    );
  }
}
//export default CalendarCard;
export default withRouter(injectIntl(AppointmentCard));
