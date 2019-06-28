import React, { Component, Fragment } from "react";
import withRouter from "react-router/es/withRouter";
import { Avatar, Card } from "antd";
import messages from "./message";
import { injectIntl } from "react-intl";
import { USER_CATEGORY } from "../../../../constant";
import cardReminder from "../../../../Assets/images/calendar/ico-reminder-flat-clr.svg";
import profilePicPlaceHolder from "../../../../Assets/images/ico-placeholder-userdp.svg";
import ReminderHelper from "../../../../Helper/event/reminder";
import MoreOptions from "./moreoptions";
//import "../style.less";

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

  /*  handleDelete = e => {
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
    const series = repeat && repeat !== REPEAT_TYPE.NONE;
    editReminder(id, series);
  };

  handleAddNotes = e => {
    e.preventDefault();
    const {
      addNotes,
      eventDetails: { id }
    } = this.props;
    addNotes(id);
  };*/

  getReminderWithCategoryText(user = {}) {
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
  }

  render() {
    const { event = {}, hideAction = false, modal = false } = this.props;
    const { handleClick, handleLeave, handleCardClick, formatMessage } = this;

    const { id } = event;

    const reminderHelper = new ReminderHelper(this.props);

    const startTime = reminderHelper.getStartTime();
    const startDate = reminderHelper.getStartDate();
    // const isDisabled = reminderHelper.isCardEnable();
    const notes = reminderHelper.getNotes();

    const lastActedUserName = reminderHelper.getLastActedUser();

    const reminderWith = reminderHelper.getReminderWithTag();

    const title = reminderHelper.getReminderTitle();

    const {
      basicInfo: {
        name: reminderWithUserName,
        profilePicLink: reminderWithProfilePic = profilePicPlaceHolder
      } = {}
    } = reminderWith || {}; //some time reminder have only one participant

    const categoryName = this.getReminderWithCategoryText(reminderWith);

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
                {formatMessage(messages.scheduledBy)} {lastActedUserName}
              </div>
              <div className="card-title">
                <div className="reminder-card-title">
                  {cardReminderIcon}
                  <span className="time-text">
                    {startTime}, {startDate}
                  </span>
                </div>
              </div>
              <div className="card-modal-options">
                <div className="card-cover">
                  <div className="coach-activity-reminder mb8">
                    {title
                      ? title.length < 30
                        ? title
                        : title.substr(0, 30) + "..."
                      : null}
                  </div>
                  {reminderWith && (
                    <Fragment>
                      <span className="coach-activity">{categoryName}</span>
                      <span className="coach-avatar">
                        <Avatar src={reminderWithProfilePic} />
                        {reminderWithUserName}
                      </span>
                    </Fragment>
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
          {hideAction !== true && (
            <div className="reminder-more-options">
              <div className="right" onClick={handleClick}>
                <span>{visible ? "" : "More Options"}</span>
              </div>
            </div>
          )}
          {!hideAction && (
            <Fragment>
              <div key={id} className="options">
                <div className="more-options">
                  {visible ? <hr /> : ""}
                  <div onClick={handleClick}>
                    <span>{visible ? "Less Options" : ""}</span>
                  </div>
                </div>
                {visible && (
                  <MoreOptions
                    actions={reminderHelper.getMoreOption()}
                    {...this.props}
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
export default withRouter(injectIntl(ReminderCard));
