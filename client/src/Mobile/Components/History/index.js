import React, { Component } from "react";
import "./styles.less";
import AppointmentHistory from "../../Containers/AppointmentsHistory";
import AppHeader from "../../Containers/Header";
import Icon from "antd/es/icon";

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    console.log("this.props ----", this.props);
    const { userId } = this.props;
    return (
      <div className="history-wrapper">
        <AppHeader signup={false} {...this.props} />
        <div className="history-container hide-scroll">
          <AppointmentHistory userId={userId} />
        </div>
        <div className="back-footer">
          <div className="arrow-wrapper">
            <Icon type="arrow-left" onClick={this.goBack} />
          </div>
          <div className="text">My Calendar Details</div>
        </div>
      </div>
    );
  }
}

export default History;
