import React, { Component } from "react";
import { Layout, Icon, Row, Col } from "antd";
import IqviaLogo from "../../Assets/images/iqvia_logo.png";
import "./style.css";
const { Footer } = Layout;

class appFooter extends Component {
  render() {
    return (
      <footer className="pageFooter">
        <div>
          <img src={IqviaLogo} className="iqviaFooterLogo" alt="logo" />
        </div>
        <div>
          <h3>
            Copyright
            <Icon
              type="copyright"
              theme="outlined"
              style={{ color: "rgba(255,255,255)", fontSize: 20 }}
            />{" "}
            2018 Econsulting Application
          </h3>
        </div>
      </footer>
    );
  }
}

export default appFooter;
