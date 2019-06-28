import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Modal, Button } from "antd";

import "./style.css";

class ProviderDetailModal extends Component {
  render() {
    return (
      <Modal
        title="Provider Details"
        centered
        visible={this.props.isVisible}
        onCancel={() => this.props.showModal(false)}
        footer={[
          <Link
            to={{
              pathname: "/member/scheduleAppointment",
              provider: this.props.providerData
            }}
          >
            <Button key="submit" type="primary">
              Select
            </Button>
          </Link>,
          <Button
            key="back"
            onClick={() => this.props.showModal(false)}
            type="danger"
          >
            Cancel
          </Button>
        ]}
      >
        <Row className="providerModalBodyContainer">
          <Row className="providerModalBodyLine1" gutter={40}>
            <Col className="providerDetailImageContainer" lg={6}>
              <img
                src={this.props.providerData.photoUrl}
                style={{ height: "100%", width: "100%" }}
                alt="providerphoto"
              />
            </Col>
            <Col lg={10}>
              <Col>
                <strong>Name</strong>:
                {this.props.providerData.firstName +
                  " " +
                  this.props.providerData.lastName}
              </Col>
              <Col>
                <strong>Email</strong>:{this.props.providerData.email}
              </Col>
              <Col>
                <strong>Contact</strong>:{this.props.providerData.phone}
              </Col>
              <Col>
                <strong>Bio</strong>:{this.props.providerData.bio}
              </Col>
              <Col>
                <strong>Qualification</strong>:
                {this.props.providerData.education}
              </Col>
            </Col>
          </Row>
        </Row>
      </Modal>
    );
  }
}

export default ProviderDetailModal;
