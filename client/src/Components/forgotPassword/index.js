import React, { Component } from "react";
import { Row, Col, Form, Button, Input } from "antd";
import AppHeader from "../Header";
import axios from "axios";
import "./style.less";
import { hasErrors } from "../../Helper/validation";
import verifiedIcon from "../../Assets/images/ico-verified.svg";

const FormItem = Form.Item;

class ForgotPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: []
    };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handleForgotPassword } = this.props;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        handleForgotPassword(values);
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const emailError = isFieldTouched("email") && getFieldError("email");

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="Email"
          validateStatus={emailError ? "error" : ""}
          help={emailError || ""}
        >
          {getFieldDecorator("email", {
            rules: [
              {
                required: true,
                type: "email",
                message: "Please enter your valid email"
              }
            ]
          })(<Input type="email" placeholder="enter your email" />)}
        </FormItem>

        <div className="hide-mobile hide-tablet-7 hide-tablet-9">
          <FormItem className="pull-right">
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Find My Account
            </Button>
          </FormItem>
        </div>

        <div className="change-password-sticky-footer hide-desktop">
          <FormItem className="pull-right flex align-center mr16">
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Find My Account
            </Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forgotPasswordHandled: false
    };
    this.emailOrPhone = "";
    this.ForgotPasswordForm = Form.create()(ForgotPasswordForm);
  }

  handleForgotPassword = async data => {
    const url = "/api/forgot-password";
    await axios.post(url, {
      ...data
    });
    this.setState({ forgotPasswordHandled: true });
  };

  render() {
    const { ForgotPasswordForm } = this;
    return (
      <div className="flex align-items-center justify-content-center">
        <div className="main-iqvia-container flex align-items-center">
          <Row className=" change-password">
            <Col
              xs={12}
              sm={12}
              md={7}
              lg={7}
              xl={7}
              xxl={7}
              className={"h100"}
            >
              <AppHeader />
              <div className="text-align-l pt100">
                <ForgotPasswordForm
                  handleForgotPassword={this.handleForgotPassword}
                />
                {this.state.forgotPasswordHandled && (
                  <div className="msg">
                    <div
                      className={
                        "w100 absolute  absolute flex row align-items-center justify-content-start"
                      }
                      style={{
                        backgroundColor: "rgba(227, 243, 223, 0.5)",
                        bottom: "0",
                        height: "40px"
                      }}
                    >
                      <div
                        style={{
                          display: "block",
                          width: "13px",
                          marginLeft: "24px"
                        }}
                      >
                        <img
                          alt=""
                          src={verifiedIcon}
                          className={"w100"}
                          style={{ display: "block" }}
                        />
                      </div>
                      <div
                        className={"pl10 fontsize12"}
                        style={{ color: "#43b02a" }}
                      >
                        An email has been send to your mail.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
