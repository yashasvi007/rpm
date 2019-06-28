import React, { Component } from "react";
import { Button, Form, Input } from "antd";
import AppHeader from "../Header";
import "./style.css";
import ErrorComponent from "../CommonError";
import { injectIntl } from "react-intl";
import messages from "./message";

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SignInForm extends Component {
  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    const { handleSignIn } = this.props;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        handleSignIn(values);
      }
    });
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const passwordError =
      isFieldTouched("password") && getFieldError("password");
    const emailError = isFieldTouched("email") && getFieldError("email");

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label={this.formatMessage(messages.email)}
          validateStatus={this.props.error || emailError ? "error" : ""}
          help={emailError || ""}
        >
          {getFieldDecorator("email", {
            rules: [
              {
                required: true,
                message: this.formatMessage(messages.enterEmail)
              },
              {
                type: "email",
                message: this.formatMessage(messages.validEmail)
              }
            ]
          })(<Input type="email" placeholder="" />)}
        </FormItem>
        <FormItem
          label={this.formatMessage(messages.password)}
          validateStatus={this.props.error || passwordError ? "error" : ""}
          help={passwordError || ""}
        >
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: this.formatMessage(messages.passwordError)
              }
            ]
          })(<Input type="password" placeholder="" />)}
        </FormItem>

        <FormItem className="pull-right">
          <div className="flex">
            <Button className="mr8" onClick={this.props.showForgotPassword}>
              {this.formatMessage(messages.forgotPassword)}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              {this.formatMessage(messages.signIn)}
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email,
      category: this.props.category,
      isLogedIn: this.props.isLogedIn
    };
    this.password = "";
    this.email = "";
    this.showForgotPassword = this.showForgotPassword.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.SignInForm = Form.create()(SignInForm);
  }

  showForgotPassword() {
    this.props.history.push("/forgot-password");
  }

  handleSignIn(data) {
    const { location: { state = false } = {} } = this.props;
    if (state) {
      data.lastUrl = state ? state[0].slice(1) : null;
    }
    this.props.signIn({ ...data });
  }

  render() {
    const { SignInForm } = this;
    const {
      error,
      intl: { formatMessage, locale }
    } = this.props;

    return (
      <div className="flex align-items-center justify-content-center">
        <AppHeader />
        <div className="page-container text-align-l pt100">
          <div className="bold fontsize18 mt56 mb16">Sign In</div>
          <SignInForm
            handleSignIn={this.handleSignIn}
            error={this.state.invalidUser}
            showForgotPassword={this.showForgotPassword}
            intl={{ formatMessage, locale }}
          />
        </div>
        {error && (
          <ErrorComponent
            msg={error.message}
            close={this.props.clearError}
            className={"top60"}
          />
        )}
      </div>
    );
  }
}

export default injectIntl(SignIn);
