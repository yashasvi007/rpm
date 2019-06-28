import React, { Component } from "react";
import { Divider, Button, Dropdown, Row, Col, Icon, Menu } from "antd";

const Program = ({ key, data }) => {
  const { program_name, expires_on, enrolled, products } = data;
  let productComponent = [];
  products.forEach((value, index) => {
    productComponent.push(
      <div
        key={index}
        style={{
          backgroundColor: "rgb(#d4d7d9,.33)",
          borderRadius: "20px",
          margin: "0 10px 0 0"
        }}
      >
        <p style={{ margin: "8px" }}>{value}</p>
      </div>
    );
  });

  const options = (
    <Menu>
      <Menu.Item key="1">x</Menu.Item>
      <Menu.Item key="2">y</Menu.Item>
      <Menu.Item key="3">z</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Row>
        <Col xs={0} sm={0} md={12} lg={12} xl={12} xxl={12}>
          <div>{program_name}</div>
          <div style={{ display: "flex", margin: "0 0 10px 0" }}>
            {productComponent}
          </div>
        </Col>
        <Col xs={0} sm={0} md={4} lg={6} xl={6} xxl={6}>
          <div>Enrolled</div>
          <div>{enrolled}</div>
        </Col>
        <Col xs={0} sm={0} md={8} lg={6} xl={6} xxl={6}>
          <div className="pull-right">
            <div>{expires_on}</div>
            <div>
              <Button style={{ margin: "0 10px" }}>Enroll Patients</Button>
              <Dropdown overlay={options}>
                <Button>
                  <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
          <div>{program_name}</div>
          <div>
            {products.length} Products • {enrolled}
          </div>
        </Col>
        <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
          <div className="content-space-between">
            <div>{expires_on}</div>
            <div>
              <Button style={{ margin: "0 10px" }}>
                <Icon type="user" />
              </Button>
              <Dropdown overlay={options}>
                <Button>
                  <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>
      <Divider />
    </div>
  );
};

export default class Programs extends Component {
  render() {
    const program = {
      program_name: "Micro Labs’ program at Nigeria",
      expires_on: "Expires on 31 Dec 2019",
      enrolled: "435 Patients",
      products: ["product A", "product B", "product C", "product D"]
    };
    const programs = [program, program, program, program];

    let programComponent = [];
    programs.forEach((value, index) => {
      programComponent.push(<Program key={index} data={value} />);
    });

    return <div>{programComponent}</div>;
  }
}
