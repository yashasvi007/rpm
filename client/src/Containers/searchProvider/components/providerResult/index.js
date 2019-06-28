import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Col, Row, Button, Alert } from "antd";

import ProviderDetailModal from "../providerDetailModal";
import "./style.css";

class ProviderResultComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      providerDetailData: null,
      showDetailModal: false
    };
  }
  setModalToVisible = val => {
    this.setState({ showModal: val });
  };

  handleProviderSelection(provider) {
    localStorage.setItem("provider", JSON.stringify(provider));
    this.props.history.push("/member/scheduleAppointment");
  }

  renderFilterResult = (data, k) => {
    return (
      <Row className="providerResultCardContainer" key={k}>
        <Col className="providerResultCardImage" lg={4}>
          <img
            src={
              data.photoUrl
                ? data.photoUrl
                : "https://thumbs.dreamstime.com/b/full-length-confident-young-doctor-white-background-smiling-showing-thumbs-up-31416804.jpg"
            }
            style={{ height: "100%", width: "100%" }}
            alt="providerPhoto"
          />
        </Col>
        <Col className="providerResultCardData" lg={6}>
          <div>
            <p>
              <strong>Name:</strong>
              {data.firstName + " " + data.lastName}
            </p>
          </div>
          <div>
            <p>
              <strong>Speciality:</strong>
              {data.specialityId.specialityName}
            </p>
          </div>
        </Col>
        <Col className="providerResultCardData" lg={6}>
          <div>
            <p>
              <strong>Qualification:</strong>
              {data.education.length > 20
                ? data.education.substr(0, 20) + "..."
                : data.education}
            </p>
          </div>
          <div>
            <p>
              <strong>Contact:</strong>
              {data.phone}
            </p>
          </div>
        </Col>
        <Col className="providerResultCardButtonHolder" lg={8}>
          <div className="buttonInnerHolder">
            <Button
              type="primary"
              onClick={() =>
                this.setState({
                  providerDetailData: data,
                  showDetailModal: true
                })
              }
              style={{ width: "50%" }}
            >
              Detail
            </Button>
          </div>

          <div className="clearFixVS" />
          <div className="buttonInnerHolder">
            <Button
              type="danger"
              onClick={() => this.handleProviderSelection(data)}
              style={{ width: "50%" }}
            >
              Select
            </Button>
          </div>
        </Col>
      </Row>
    );
  };
  renderNoResultsFound = () => {
    return (
      <Row className="errorAlert">
        <Alert
          message="Error"
          description="No Results Found"
          type="error"
          showIcon
        />
      </Row>
    );
  };
  showModal = val => {
    this.setState({ showDetailModal: val });
  };

  renderDetailModal = () => {
    return this.state.providerDetailData ? (
      <ProviderDetailModal
        providerData={this.state.providerDetailData}
        isVisible={this.state.showDetailModal}
        showModal={this.showModal}
      />
    ) : (
      ""
    );
  };
  render() {
    return (
      <Row id="providerResultContainer">
        {this.props.providerData.length >= 1
          ? this.props.providerData.map((row, i) => {
              return this.renderFilterResult(this.props.providerData[i], i);
            })
          : this.renderNoResultsFound()}
        {this.state.providerDetailData && this.state.showDetailModal ? (
          <ProviderDetailModal
            providerData={this.state.providerDetailData}
            isVisible={this.state.showDetailModal}
            showModal={this.showModal}
          />
        ) : (
          ""
        )}
      </Row>
    );
  }
}

export default withRouter(ProviderResultComponent);
