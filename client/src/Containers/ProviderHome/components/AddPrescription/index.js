import React, { Component } from "react";
import axios from "axios";

import { Col, AutoComplete, Card, Button, Select } from "antd";

import "./style.css";

const { Option } = AutoComplete;

class AddPrescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescriptionListCount: 1,
      prescriptionListPrevCount: 0,
      priscriptionData: []
    };
  }

  getDrugsList = async query => {
    let drugData = await axios.get(
      "https://drugapi.hcpspace.solutions.iqvia.com/search/tradeName/" +
        query.toLowerCase()
    );
    drugData = drugData.data;
    if (drugData && drugData.result.length > 0) {
      this.setState({ drugList: [] });
      let drugApiResponse = drugData.result;
      this.setState({
        drugList: drugApiResponse.map((value, index) => {
          return `${value._source.tradeName} (${value._source.company})-${
            value._source.drug_id
          }`;
        })
      });
    } else {
      this.setState({ drugList: [] });
    }
  };

  sendPrescription = () => {
    if (this.state.priscriptionData.length > 0) {
      axios
        .post("/api/sendPrescription", {
          bookingData: this.props.bookingReqData,
          prescriptionData: this.state.priscriptionData
        })
        .then(response => {
          if (response && response.data) {
            if (this.props.chatClient && this.props.channelSid) {
              this.props.chatClient
                .getChannelBySid(this.props.channelSid)
                .then(channel => {
                  channel.sendMessage(
                    `mediaMsg-${response.data.apiResponse.Key}`
                  );
                });
            }
          } else {
          }
        });
    }
  };
  addPrescriptionDataToState = (data, index, name) => {
    let current = this.state.priscriptionData;
    if (
      current[index] == undefined ||
      Object.keys(current[index]).length === 0
    ) {
      current[index] = {};
    }
    current[index][name] = data;
    this.setState({ priscriptionData: current }, () => {});
  };

  addMorePrescription = () => {
    this.setState(
      {
        prescriptionListCount: this.state.prescriptionListCount + 1,
        prescriptionListPrevCount: this.state.prescriptionListCount
      },
      () => {}
    );
  };

  removePrescription = index => {
    if (this.state.prescriptionListCount > 1) {
      let current = this.state.priscriptionData;
      if (current[index]) current.splice(index, 1);
      this.setState({ priscriptionData: current });
      this.setState(
        {
          prescriptionListCount: this.state.prescriptionListCount - 1,
          prescriptionListPrevCount: this.state.prescriptionListCount
        },
        () => {}
      );
    }
  };

  renderQuantity = index => {
    return (
      <Select
        placeholder="Quantity"
        style={{ width: 120 }}
        onSelect={e => {
          this.addPrescriptionDataToState(e, index, "quantity");
        }}
      >
        <Option value="1">1 Tablet</Option>
        <Option value="2">2 Tablets</Option>
        <Option value="3">3 Tablets</Option>
        <Option value="4">4 Tablets</Option>
      </Select>
    );
  };
  renderDuration = index => {
    return (
      <Select
        palceholder="Duration"
        style={{ width: 120 }}
        onSelect={e => {
          this.addPrescriptionDataToState(e, index, "duration");
        }}
      >
        <Option value="3/1">3 Times a day</Option>
        <Option value="2/1">2 Times a day</Option>
        <Option value="1/1">1 Times a day</Option>
        <Option value="1/2">1 Times in 2 days</Option>
        <Option value="1/3">1 Times in 3 days</Option>
        <Option value="2/3">2 Times in 3 days</Option>
        <Option value="3/3">3 Times in 3 days</Option>
      </Select>
    );
  };

  renderPriscriptionCard = () => {
    let cardData = [];
    for (let i = 0; i < this.state.prescriptionListCount; i++) {
      cardData.push(
        <Card className="prescriptionCard" key={`presCard-${i}`}>
          <Col style={{ width: "80%" }}>
            <AutoComplete
              onChange={this.getDrugsList}
              onSelect={e => {
                this.addPrescriptionDataToState(e, i, "drugName");
              }}
              placeholder="Select Drug"
              dataSource={this.state.drugList}
              style={{ width: "100%" }}
            />
          </Col>
          <Col className="clearFixVerticalVS" />
          <Col>{this.renderQuantity(i)}</Col>
          <Col className="clearFixVerticalVS" />
          <Col>{this.renderDuration(i)}</Col>
          <Col className="clearFixVerticalVS" />
          <Col>
            <Button
              icon="plus"
              type="primary"
              onClick={this.addMorePrescription}
            />
          </Col>
          <Col className="clearFixVerticalVS" />
          <Col>
            <Button
              icon="minus"
              type="danger"
              onClick={e => {
                this.removePrescription(i);
              }}
            />
          </Col>
        </Card>
      );
    }
    return <Col style={{ width: "100%" }}>{cardData}</Col>;
  };

  render() {
    return (
      <Col id="PrescriptionContainer">
        {this.state.prescriptionListCount !=
        this.state.prescriptionListPrevCount
          ? this.renderPriscriptionCard()
          : ""}
        <Col className="clearFixHorizontalVS" />
        <Col>
          <Button
            type="primary"
            size="large"
            icon="file-done"
            ghost
            style={{ width: "100%" }}
            onClick={this.sendPrescription}
          >
            Send Priscription
          </Button>
        </Col>
      </Col>
    );
  }
}

export default AddPrescription;
