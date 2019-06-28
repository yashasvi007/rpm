import React, { Component } from "react";
import dateFns from "date-fns";
import { EVENT, EVENT_TYPE } from "../../../constant";
import "./style.less";

class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { date, events } = this.props;
    this.setState({ currentDate: date, events: events });
  }

  renderDots() {
    const dots = [];
    const { events } = this.props;
    let count = 0;
    events.forEach(event => {
      if (count === 4) {
        return false;
      }
      if (
        event.eventType === EVENT_TYPE.APPOINTMENT ||
        event.eventType === EVENT_TYPE.REMINDER
      ) {
        count++;
        if (event.status === EVENT.STATUS.COMPLETED) {
          dots.push(
            <div key={event.id} className={`mobile-dot silver ml2 mr2`} />
          );
        } else if (event.status === EVENT.STATUS.PASSED) {
          dots.push(
            <div key={event.id} className={`mobile-dot orange ml2 mr2`} />
          );
        } else {
          dots.push(
            <div key={event.id} className={`mobile-dot dark ml2 mr2`} />
          );
        }
      }
    });
    return <div className="cell-dots-wrapper">{dots}</div>;
  }

  onDateClick = () => {
    const { onDateClick, date } = this.props;
    onDateClick(date);
  };

  render() {
    const { date, isSelected, disabled } = this.props;
    const { onDateClick } = this;
    return (
      <div className="cell" onClick={onDateClick} key={date}>
        <div
          className={`digits ${disabled ? "disable-date" : ""} ${
            isSelected ? "selected-digit" : ""
          }`}
        >
          {dateFns.format(date, "D")}
        </div>
        {this.renderDots()}
      </div>
    );
  }
}

export default Cell;
