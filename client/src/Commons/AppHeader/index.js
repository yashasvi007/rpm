import React, { Component } from "react";
import { Layout, Row, Col } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { fetchMember, updateMemberConsent } from "../../Actions/memberActions";
import IqviaLogo from "../../Assets/images/iqvia_logo.png";
import "./style.css";

const { Header } = Layout;

const AppHeader = props => {
  return (
    <Row id="appHeaderContainer">
      <h1>Econsulting Application</h1>
      <Row className="welcomeMessage">
        {props.loggedInMemberData ? (
          <h3>Welcome {props.loggedInMemberData.firstName}</h3>
        ) : (
          ""
        )}
      </Row>
    </Row>
  );
};

export default AppHeader;
// const mapStateToProps = ({ memberReducer }) => {
//   return {
//     loggedInMemberData: memberReducer.data
//   };
// };

// export default withRouter(
//   connect(
//     mapStateToProps,
//     { fetchMember, updateMemberConsent }
//   )(AppHeader)
// );
