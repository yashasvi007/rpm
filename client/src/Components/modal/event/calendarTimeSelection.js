import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { DatePicker } from "antd";
import FullCalendar from "fullcalendar-reactwrapper";
import "fullcalendar-reactwrapper/dist/css/fullcalendar.min.css";
// // import isEqual from "lodash-es/isEqual";

import next from "../../../Assets/images/ico-calendar-nav-next.svg";
import prev from "../../../Assets/images/ico-calendar-nav-prev.svg";
import dropDownIcon from "../../../Assets/images/ico-dropdown.svg";
import userPlaceHolder from "../../../Assets/images/ico-placeholder-userdp.svg";

import messages from "./message";
import moment from "moment";
import { EVENT_TYPE } from "../../../constant";

const DropDownIcon = <img src={dropDownIcon} alt="d" className="w14 h14" />;

class CalendarComponent extends Component {
  eventResize = (event, duration) => {
    const { start, end } = event;
    const { onEventDurationChange } = this.props;
    onEventDurationChange(start, end);
  };

  eventResizeStart = (event, ...args) => {};

  eventResizeStop = (event, ...args) => {};

  eventDragStart = (event, args) => {};

  eventDrop = (event, duration) => {
    const { start, end } = event;
    const { onEventDurationChange } = this.props;
    onEventDurationChange(start, end);
  };

  eventDragStop = event => {};

  componentDidMount() {
    this.adjustCurrentEvent();
  }

  componentDidUpdate(prevProps, prevState) {
    this.adjustCurrentEvent();
  }

  adjustCurrentEvent = () => {
    const currentEvent = window.document.getElementsByClassName("current");
    if (currentEvent && currentEvent.length > 0) {
      currentEvent[0].scrollIntoView({
        // behavior: "smooth",
        block: "center"
      });
    }
  };

  render() {
    const { event, bookedEvents } = this.props;
    const {
      eventDragStart,
      eventDragStop,
      eventResize,
      eventResizeStop,
      eventResizeStart,
      eventDrop
    } = this;
    return (
      <div id="12717728812718t27182t1">
        <FullCalendar
          header={{
            left: "",
            center: "",
            right: ""
          }}
          defaultDate={event === null ? null : event.start}
          events={event === null ? [] : [event, ...bookedEvents]}
          editable={true}
          eventLimit={true}
          defaultView="agendaDay"
          eventDurationEditable={true}
          eventStartEditable={true}
          eventDragStart={eventDragStart}
          eventDragStop={eventDragStop}
          eventDrop={eventDrop}
          eventResize={eventResize}
          eventResizeStart={eventResizeStart}
          eventResizeStop={eventResizeStop}
          timezone={"local"}
        />
      </div>
    );
  }
}

class CalendarTimeSelecton extends Component {
  formatMessage = messageId => {
    const {
      intl: { formatMessage }
    } = this.props;
    return formatMessage(messageId);
  };

  getParentNode = t => t.parentNode;

  render() {
    const {
      className,
      //eventTitle,
      eventEndTime,
      eventStartTime,
      onEventDurationChange,
      startDate,
      //endDate,
      //range,
      //onEndDateChange,
      onStartDateChange,
      //disabledEndDate,
      disabledStartDate,
      disabledStartDateOnEdit,
      onPrev,
      onNext,
      //repeatInterValError,
      eventMode,
      bookedEvents,
      participant: {
        basicInfo: { name, profilePicLink = userPlaceHolder } = {}
      } = {}
    } = this.props;
    const { formatMessage } = this;
    const event = {
      start: eventStartTime,
      end: eventEndTime,
      className: "current"
    };

    let today = false;
    if (startDate && startDate !== null) {
      if (startDate.isValid) {
        today = moment().isSame(startDate, "day");
      }
    }

    return (
      <div className={className}>
        <div className="mask" />
        {eventMode === EVENT_TYPE.APPOINTMENT && (
          <Fragment>
            <div className=" header fontsize16 dark medium">
              {formatMessage(messages.chooseWhen)}
            </div>
            <div className="calendar-toolbar mt16 flex justify-content-start align-items-center">
              {/* //  {!range && ( */}
              <Fragment>
                <img
                  className={`mr8  ${
                    today || disabledStartDateOnEdit
                      ? "not-allowed"
                      : "clickable"
                  } `}
                  src={prev}
                  alt="prev"
                  onClick={today || disabledStartDateOnEdit ? null : onPrev}
                />
                <img
                  className={`mr8  ${
                    disabledStartDateOnEdit ? "not-allowed" : "clickable"
                  } `}
                  src={next}
                  alt="prev"
                  onClick={disabledStartDateOnEdit ? null : onNext}
                />
              </Fragment>
              {/* )} */}
              <div className="mr16">
                <DatePicker
                  disabledDate={disabledStartDate}
                  disabled={disabledStartDateOnEdit}
                  allowClear={false}
                  className="date-picker"
                  format="DD/MM/YYYY, ddd"
                  suffixIcon={DropDownIcon}
                  value={startDate === null ? null : moment(startDate)}
                  onChange={onStartDateChange}
                  getCalendarContainer={this.getParentNode}
                />
              </div>
              <div
                className={
                  "flex-1 flex justify-content-end align-items-center mr8 ml8"
                }
              >
                {name && (
                  <div className="flex justify-content-start align-items-center iqvia-user-snippet bg-transparent">
                    <img alt={"u"} src={profilePicLink} />
                    <div className="deep-sea-blue fontsize12 medium mr8">{`${name}'s Calendar`}</div>
                  </div>
                )}
              </div>
              {/* {range && (
                <Fragment>
                  <div className="mr16">-</div>
                  <div className="mr16">
                    <DatePicker
                      allowClear={false}
                      disabled={repeatInterValError}
                      disabledDate={disabledEndDate}
                      className="date-picker "
                      format="DD/MM/YYYY, ddd"
                      suffixIcon={DropDownIcon}
                      value={endDate === null ? null : moment(endDate)}
                      onChange={onEndDateChange}
                    />
                  </div>
                </Fragment>
              )} */}
            </div>
          </Fragment>
        )}
        <CalendarComponent
          onEventDurationChange={onEventDurationChange}
          event={eventMode === EVENT_TYPE.REMINDER ? null : event}
          bookedEvents={bookedEvents}
        />
      </div>
    );
  }
}

export default injectIntl(CalendarTimeSelecton);
