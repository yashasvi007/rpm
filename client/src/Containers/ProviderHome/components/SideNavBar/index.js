import React, { Component } from "react";
import { Layout, Menu, Icon } from "antd";

const { Sider } = Layout;

class SideNavBar extends Component {
  render() {
    return (
      <Sider width={"100%"} style={{ background: "#fff" }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
          onClick={this.props.handleClick}
        >
          <Menu.Item key="1">
            <Icon type="home" />
            <span>Home</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="file" />
            <span>History</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="thunderbolt" />
            <span>Availability</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

export default SideNavBar;
