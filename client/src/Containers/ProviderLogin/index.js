import React, { Component } from "react";
import { Row, Icon } from "antd";
import "./style.css";

class ProviderLoginContainer extends Component {
  render() {
    return (
      <Row id="ProviderLoginContainer">
        <Row id="ProviderLoginFormContainer">
          <form className="loginForm" action="/api/login" method="POST">
            <div className="loginInputDiv">
              <Icon
                type="user"
                style={{
                  color: "rgba(0,0,0,0.5)",
                  fontSize: 22,
                  marginRight: "3%",
                  position: "absolute",
                  top: 10,
                  left: 10
                }}
              />
              <input
                className="loginTextBoxes"
                type="text"
                name="username"
                placeholder="Username"
              />
            </div>
            <div className="loginInputDiv">
              <Icon
                type="lock"
                style={{
                  color: "rgba(0,0,0,0.5)",
                  fontSize: 22,
                  marginRight: "3%",
                  position: "absolute",
                  top: 10,
                  left: 10
                }}
              />
              <input
                className="loginTextBoxes"
                type="password"
                name="password"
                placeholder="Password"
              />
              <input
                style={{ display: "none" }}
                type="text"
                name="entity"
                value="provider"
                placeholder="Username"
              />
            </div>
            <div className="loginInputDiv">
              <input type="submit" value="Login" className="loginButton" />
            </div>
            <a className="loginFormForgot" href="">
              Forgot password?
            </a>
          </form>
        </Row>
      </Row>
    );
  }
}

export default ProviderLoginContainer;
