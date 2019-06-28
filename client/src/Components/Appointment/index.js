import React, { Component } from "react";
import { Divider, Dropdown, Menu, Button, Icon } from "antd";
export default class AppointMent extends Component {
  render() {
    const options = (
      <Menu>
        <Menu.Item key="1">Edit Appointment</Menu.Item>
        <Menu.Item key="2">Contact {this.props.to}</Menu.Item>
        <Menu.Item key="3">Cancel Appointment</Menu.Item>
      </Menu>
    );

    return (
      <div>
        <div>Today • 16 Nov 2018</div>
        <div className="content-space-between">
          <p>{this.props.timing}</p>
          <p className="pull-right">{this.props.status}</p>
        </div>
        <p>{this.props.to}</p>
        <div className="content-space-between">
          <p>{this.props.mode}</p>
          <div className="pull-right">
            <Button style={{ margin: "0 10px" }}>
              {this.props.actionType}
            </Button>
            <Dropdown overlay={options}>
              <Button>
                <Icon type="down" />
              </Button>
            </Dropdown>
          </div>
        </div>
        <Divider />
      </div>
    );
  }
}
