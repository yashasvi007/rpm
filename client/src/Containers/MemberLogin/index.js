import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Icon, Col, Row } from "antd";
import axios from "axios";
import { getAllCities } from "../../Actions/cityActions";
import { fetchMember } from "../../Actions/memberActions";
import "./style.css";
import Footer from "../../Components/Footer";

class MemberLoginContainer extends Component {
  constructor() {
    super();
    this.state = {
      characters: 0,
      quoteCounter: 0,
      quotes: [
        "Skip the Long Queues!!!",
        "Skip the regular visits!!!",
        "Talk to an expert, at your convenience!!!"
      ],
      speed: 150,
      username: null,
      password: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    //this.updateTypewriterHeading();
  }

  async checkMemberLoggedIn() {
    let response = await axios.get("/api/fetchLoggedInMember");
    let loggedInMember = response.data;

    if (!loggedInMember.err) {
      this.props.history.push("/member/home");
    } else {
      this.props.history.push("/member/login");
    }
  }

  updateTypewriterHeading() {
    if (this.state.quoteCounter < this.state.quotes.length) {
      if (
        this.state.characters <
        this.state.quotes[this.state.quoteCounter].length
      ) {
        document.getElementById(
          "typewriterHeading"
        ).innerHTML += this.state.quotes[this.state.quoteCounter].charAt(
          this.state.characters
        );
        let updatedCharacters = this.state.characters + 1;
        this.setState({ characters: updatedCharacters }, () =>
          setTimeout(() => this.updateTypewriterHeading(), this.state.speed)
        );
      } else {
        let updatedQuoteCounter = this.state.quoteCounter + 1;
        if (updatedQuoteCounter < this.state.quotes.length) {
          document.getElementById("typewriterHeading").innerHTML = "&nbsp;";
          this.setState(
            { quoteCounter: updatedQuoteCounter, characters: 0 },
            () => setTimeout(() => this.updateTypewriterHeading(), 500)
          );
        }
      }
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    axios.post("/api/memberLogin", {
      username: this.state.username,
      password: this.state.password
    });
  }

  render() {
    return (
      <div className="backgroundLayer">
        {/* <Route path="/home" component={MemberHome} /> */}
        <h1 className="appHeading">E-Consulting Application</h1>
        <div className="typewriterHeader" id="typewriterHeading">
          Talk to an expert, at your convenience!!!
        </div>
        <div>
          <Row>
            <Col sm={{ span: 12, offset: 6 }} xs={{ span: 20, offset: 2 }}>
              <Row>
                <Col sm={{ span: 12, offset: 6 }} xs={{ span: 24 }}>
                  <div className="loginFormDiv">
                    <form
                      className="loginForm"
                      action="/api/login"
                      method="POST"
                    >
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
                      </div>
                      <div className="loginInputDiv">
                        <input
                          type="submit"
                          value="Login"
                          className="loginButton"
                        />
                      </div>
                      <a className="loginFormForgot" href="">
                        Forgot password?
                      </a>
                    </form>

                    {/* <Form
                      // action="/api/memberLogin"
                      // method="POST"
                      onSubmit={this.handleSubmit}
                      className="loginForm"
                    >
                      <FormItem>
                        <Input
                          prefix={
                            <Icon
                              type="user"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          required
                          name="username"
                          onChange={this.handleInputChange}
                          placeholder="Email"
                        />
                      </FormItem>
                      <FormItem>
                        <Input
                          prefix={
                            <Icon
                              type="lock"
                              style={{ color: "rgba(0,0,0,.25)" }}
                            />
                          }
                          required
                          name="password"
                          onChange={this.handleInputChange}
                          type="password"
                          placeholder="Password"
                        />
                      </FormItem>
                      <FormItem>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="loginFormButton"
                        >
                          Log in
                        </Button>
                        <a className="loginFormForgot" href="">
                          Forgot password?
                        </a>
                      </FormItem>
                    </Form> */}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <Footer />
        {/* <footer className="footer">
          <div>
            <img src={IqviaLogo} className="iqviaFooterLogo" />
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
        </footer> */}
      </div>
    );
  }
}
const mapStateToProps = ({ citiesReducer }) => {
  return {
    cities: citiesReducer.cities
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { getAllCities, fetchMember }
  )(MemberLoginContainer)
);
