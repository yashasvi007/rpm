import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Tabs, DatePicker, Card, Alert, Icon } from "antd";
import moment from "moment";
import lodash from "lodash";

import { fetchBookingRequestByDateAndProvider } from "../../../../Actions/bookingRequestActions";

import "./style.css";

const { TabPane } = Tabs;
const { WeekPicker } = DatePicker;

class HomeBodyContainer extends Component {
  showDetail = (e, data) => {
    this.props.setProviderHomeState("current", 3);
    this.props.setProviderHomeState("bookingDetails", data);
  };

  renderTabContent = (data, day) => {
    let bookingReqData = data.filter(bookingReqs => {
      return moment(bookingReqs["date"]).format("dddd") == day;
    });
    bookingReqData = lodash.sortBy(bookingReqData, "time");

    let date = moment()
      .day(day)
      .year(this.props.getProviderHomeCurrentState("selectedYear"))
      .week(this.props.getProviderHomeCurrentState("selectedWeek"))
      .format("DD-MM-YYYY");

    return bookingReqData.length > 0 ? (
      <Row>
        <Row style={{ paddingLeft: "5px" }}>
          <strong>Date:</strong>
          &nbsp;
          {date}
        </Row>
        <Row
          className="resultCardHolder"
          gutter={{ sm: 20, lg: 30, xl: 40, xxl: 20 }}
          type="flex"
          justify="center"
          align="middle"
        >
          {bookingReqData.map((bookingReqDataVal, index) => {
            return (
              <Col xl={7} xxl={7} style={{ marginBottom: "10px" }} key={index}>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  onClick={(e, data = bookingReqDataVal) => {
                    this.showDetail(e, data);
                  }}
                  className="BookingReqCard"
                >
                  <Row className="CardHeader">
                    <Col className="CardHeaderIconContainer">
                      <Icon type="user" theme="outlined" />
                    </Col>
                    <Col className="clearFixVerticalVS" />
                    <Col className="CardHeaderTitleContainer">
                      <h3>
                        {bookingReqDataVal.memberId.firstName +
                          " " +
                          bookingReqDataVal.memberId.lastName}
                      </h3>
                    </Col>
                  </Row>
                  <Row className="CardBodyContainer">
                    <Row>
                      <div className="clearFixHorizontalVS" />
                    </Row>
                    <Row>
                      <strong>Time: </strong>
                      {`${bookingReqDataVal.time}:00 Hrs`}
                    </Row>
                    <Row>
                      <strong>Concern: </strong>
                      {`${bookingReqDataVal.concern}`}
                    </Row>
                    <Row>
                      <div className="clearFixHorizontalVS" />
                    </Row>
                  </Row>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Row>
    ) : (
      <Row>
        <Row style={{ paddingLeft: "5px" }}>
          <strong>Date:</strong>
          &nbsp;
          {date}
        </Row>
        <Row className="noResultContainer">
          <Alert
            message="No Bookings!!"
            description="No Bookings for this day!!"
            type="info"
          />
        </Row>
      </Row>
    );
  };
  disabledDate = current => {
    return (
      current <
      moment({})
        .startOf("isoWeek")
        .add(-1, "days")
    );
  };
  onDateChange = (date, dateString) => {
    let selectedDate = dateString.split(" ");
    let startOfWeek = moment(selectedDate[0])
      .startOf("week")
      .toISOString();
    let endOfWeek = moment(selectedDate[0])
      .endOf("week")
      .toISOString();

    if (this.props.providerData) {
      this.props.fetchBookingRequestByDateAndProvider(
        this.props.providerData._id,
        [startOfWeek, endOfWeek],
        "Approved"
      );
      this.props.setProviderHomeState("selectedDateRange", [
        startOfWeek,
        endOfWeek
      ]);
      this.props.setProviderHomeState(
        "selectedYear",
        selectedDate[0].split("-")[0]
      );
      this.props.setProviderHomeState(
        "selectedWeek",
        selectedDate[1].substr(0, 2)
      );
    }
  };
  renderBookingResult = () => {
    let result = this.props.bookingRequestData ? (
      <Tabs>
        <TabPane tab="Monday" key="1">
          {this.renderTabContent(this.props.bookingRequestData, "Monday")}
        </TabPane>
        <TabPane tab="Tuesday" key="2">
          {this.renderTabContent(this.props.bookingRequestData, "Tuesday")}
        </TabPane>
        <TabPane tab="Wednusday" key="3">
          {this.renderTabContent(this.props.bookingRequestData, "Wednusday")}
        </TabPane>
        <TabPane tab="Thurday" key="4">
          {this.renderTabContent(this.props.bookingRequestData, "Thursday")}
        </TabPane>
        <TabPane tab="Friday" key="5">
          {this.renderTabContent(this.props.bookingRequestData, "Friday")}
        </TabPane>
        <TabPane tab="Saturday" key="6">
          {this.renderTabContent(this.props.bookingRequestData, "Saturday")}
        </TabPane>
        <TabPane tab="Sunday" key="7">
          {this.renderTabContent(this.props.bookingRequestData, "Sunday")}
        </TabPane>
      </Tabs>
    ) : (
      ""
    );
    return result;
  };
  render() {
    return (
      <Card id="HomeBodyContainer">
        <Row id="HomeBodyWeekContainer">
          <WeekPicker
            placeholder="Select week"
            onChange={this.onDateChange}
            disabledDate={this.disabledDate}
            format="YYYY-MM-DD wo"
          />
        </Row>
        {this.renderBookingResult()}
        <Row />
      </Card>
    );
  }
}

const mapStateToProps = ({ bookingRequestReducer }) => {
  return { bookingRequestData: bookingRequestReducer.data };
};

export default connect(
  mapStateToProps,
  { fetchBookingRequestByDateAndProvider }
)(HomeBodyContainer);
