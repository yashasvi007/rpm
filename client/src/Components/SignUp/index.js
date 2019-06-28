import React, { Component } from "react";
import { Form, Input, Button, Row, Col, Checkbox } from "antd";
import AppHeader from "../Header";
import "./style.less";
import CalendarSync from "../CalendarSync";
import { injectIntl } from "react-intl";
import messages from "./message";

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: []
    };
  }
  formatMessage = data => this.props.intl.formatMessage(data);

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
    const { handleSignUp } = this.props;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        handleSignUp(values);
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback(this.formatMessage(messages.passwordEnsure));
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm_password"], { force: true });
    }
    callback();
  };

  checkCheckBox = (rule, value, callback) => {
    if (!value) {
      callback(this.formatMessage(messages.ensureAgreement));
    } else {
      callback();
    }
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const passwordError =
      isFieldTouched("password") && getFieldError("password");
    const confirmPasswordError =
      isFieldTouched("confirm_password") && getFieldError("confirm_password");
    const privacyTermError =
      isFieldTouched("is_agree") && getFieldError("is_agree");
    return (
      <Form className="" onSubmit={this.handleSubmit}>
        <div>
          <FormItem label={this.formatMessage(messages.email)}>
            <Input
              className="non-editable-input"
              placeholder={this.formatMessage(messages.email)}
              readOnly={true}
              value={this.props.email}
            />
          </FormItem>
          <FormItem
            label={this.formatMessage(messages.password)}
            validateStatus={passwordError ? "error" : ""}
            help={passwordError || ""}
          >
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: this.formatMessage(messages.passwordError)
                },
                {
                  min: 6,
                  message: this.formatMessage(messages.passwordLengthError)
                },
                {
                  validator: this.validateToNextPassword
                }
              ]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem
            label={this.formatMessage(messages.confirmPassword)}
            validateStatus={confirmPasswordError ? "error" : ""}
            help={confirmPasswordError || ""}
          >
            {getFieldDecorator("confirm_password", {
              rules: [
                {
                  required: true,
                  message: this.formatMessage(messages.confirmPasswordError)
                },
                {
                  validator: this.compareToFirstPassword
                }
              ]
            })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
          </FormItem>

          <FormItem
            validateStatus={privacyTermError ? "error" : ""}
            help={privacyTermError || ""}
          >
            {getFieldDecorator("is_agree", {
              rules: [
                {
                  required: true,
                  message: this.formatMessage(messages.checkbox)
                },
                { validator: this.checkCheckBox }
              ],
              valuePropName: "checked"
            })(
              <Checkbox
                className="fontsize14"
                style={{ color: "black", fontSize: "14px" }}
              >
                {this.formatMessage(messages.agreement)}{" "}
                <span className="fontsize14 primary-color">
                  {this.formatMessage(messages.privacy)}
                </span>
                <span>{` & `}</span>
                <span className="fontsize14 primary-color">
                  {this.formatMessage(messages.conditions)}
                </span>
              </Checkbox>
            )}
          </FormItem>
          <div className="hide-mobile hide-tablet-7 hide-tablet-9">
            <FormItem className="pull-right">
              <Button
                className="iqvia-btn"
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                {this.formatMessage(messages.signUp)}
              </Button>
            </FormItem>
          </div>

          <div className="signup-sticky-footer hide-desktop">
            <FormItem className="pull-right flex align-center mr16">
              <Button
                className="signup-btn"
                type="primary"
                htmlType="submit"
                disabled={hasErrors(getFieldsError())}
              >
                {this.formatMessage(messages.signUp)}
              </Button>
            </FormItem>
          </div>
        </div>
      </Form>
    );
  }
}

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: true,
      signupCompleted: false,
      passwordEmpty: false,
      passwordMismatch: false
    };
    this.handleSignUp = this.handleSignUp.bind(this);
    this.password = "";
    this.confirmPassword = " ";
    this.isAgree = false;
    this.SignUpForm = Form.create()(SignUpForm);
  }

  handleSignUp(data) {
    const { link, email, category } = this.props;

    const { contactNo } = this.state;
    const { password, confirm_password } = data;

    this.props.signUp({
      link: link,
      category: category,
      contactNo: contactNo,
      email: email,
      password: password,
      confirmPassword: confirm_password
    });

    // if (res.status === 200) {
    //   const data = res.data;
    //   if (data.status) {
    //     this.props.history.push("/calendar-sync");
    //   }
    // }
  }

  /* for redirection // removing "redirect" from store
  componentWillReceiveProps(prevProps, nextProp) {
    
    
    
  }

  componentDidUpdate(prevProps) {
    
    
    if (this.props.redirect !== prevProps.redirect && this.props.redirect) {
      this.props.history.push("/calendar-sync");
    }
  }
  */

  render() {
    const {
      intl: { formatMessage, locale }
    } = this.props;

    const { SignUpForm } = this;
    const userName = this.props.email
      ? formatMessage(messages.salutation) +
        " " +
        this.props.email.split("@")[0]
      : formatMessage(messages.salutationWithoutName);
    return (
      <div className="flex justify-content-center">
        <AppHeader />
        <div className={"pt60 main-iqvia-container main-form-container"}>
          <Row className="signup-container">
            <Col xs={12} sm={12} md={7} lg={7} xl={7} xxl={7}>
              {this.state.signupCompleted === true ? (
                <CalendarSync />
              ) : (
                <div className="text-align-l margin-signup-content">
                  <div className={"bold fontsize18 mb8"}>{userName}</div>
                  <div className="fontsize22  mb42 dark">
                    {formatMessage(messages.clickAway)}
                  </div>
                  <SignUpForm
                    handleSignUp={this.handleSignUp}
                    email={this.props.email}
                    intl={{ formatMessage, locale }}
                  />
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default injectIntl(SignUp);
