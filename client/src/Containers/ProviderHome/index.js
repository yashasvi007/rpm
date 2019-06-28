import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Row } from "antd";

import AppHeader from "../../Commons/AppHeader";
import SideNavBar from "./components/SideNavBar";
import HomeBodyContainer from "./components/HomeBodyContainer";
import HistoryBodyContainer from "./components/HistoryBodyContainer";
import ProviderConsultationContainer from "./components/ProviderConsultationContainer";
import BookingDetails from "./components/BookingDetails";

import { fetchProvider } from "../../Actions/providerActions";

import "./style.css";

class ProviderHomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      bookingDetails: null,
      selectedDateRange: null,
      selectedYear: null,
      selectedWeek: null
    };
  }

  componentDidMount() {
    this.props.fetchProvider();
  }

  handleClick = e => {
    this.setState({
      current: e.key,
      bookingDetails: null
    });
  };

  setProviderHomeState = (stateName, stateVal) => {
    switch (stateName) {
      case "current":
        this.setState({ current: stateVal });
        break;
      case "bookingDetails":
        this.setState({ bookingDetails: stateVal });
        break;
      case "selectedDateRange":
        this.setState({ selectedDateRange: stateVal });
        break;
      case "selectedYear":
        this.setState({ selectedYear: stateVal });
        break;
      case "selectedWeek":
        this.setState({ selectedWeek: stateVal });
        break;
      default:
        return "invalid state name";
    }
  };
  getProviderHomeCurrentState = stateName => {
    return this.state[stateName];
  };

  render() {
    return (
      <Row id="ProviderHome-Container">
        <Row id="ProviderHome-HeaderContainer">
          <AppHeader
            loggedInMemberData={
              this.props.loggedInProviderData
                ? this.props.loggedInProviderData
                : null
            }
          />
        </Row>
        <Row id="ProviderHome-ContentContainer">
          <Row id="ProviderHome-SideBarContainer">
            <SideNavBar handleClick={this.handleClick} />
          </Row>
          <Row className="clearFixVerticalVS" />
          <Row
            id="ProviderHome-BodyContainer"
            style={{
              width: this.state.current == 5 ? "95%" : "76%",
              background: this.state.current == 5 ? "#f0f2f3" : "#ffffff",
              boxShadow:
                this.state.current == 5 ? "none" : "1px 1px 1px 1px gray"
            }}
          >
            {this.state.current == 1 ? (
              <HomeBodyContainer
                providerData={this.props.loggedInProviderData}
                setProviderHomeState={this.setProviderHomeState}
                getProviderHomeCurrentState={this.getProviderHomeCurrentState}
              />
            ) : (
              ""
            )}
            {this.state.current == 2 ? <HistoryBodyContainer /> : ""}
            {this.state.current == 3 && this.state.bookingDetails ? (
              <BookingDetails
                bookingReqDetails={this.state.bookingDetails}
                setProviderHomeState={this.setProviderHomeState}
                getProviderHomeCurrentState={this.getProviderHomeCurrentState}
              />
            ) : (
              ""
            )}
            {this.state.current == 5 && this.state.bookingDetails ? (
              <ProviderConsultationContainer
                bookingReqData={this.state.bookingDetails}
              />
            ) : (
              ""
            )}
          </Row>
        </Row>
      </Row>
    );
  }
}

const mapStateToProps = ({ providerReducer }) => {
  return {
    loggedInProviderData: providerReducer.provider
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { fetchProvider }
  )(ProviderHomeContainer)
);
