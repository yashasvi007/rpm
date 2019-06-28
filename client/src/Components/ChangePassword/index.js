import React, { Component } from "react";
import { Form, Button, Input, Row, Col } from "antd";
import AppHeader from "../Header";
import backIcon from "../../Assets/images/ico-back.svg";
import icoError from "../../Assets/images/ico-err.svg";
import placeHolder from "../../Assets/images/ico_placeholder_userdp.png";
import hide from "../../Assets/images/icon-flat-hide.svg";
import show from "../../Assets/images/icon-flat-show.svg";

import "./style.less";

const FormItem = Form.Item;

const CONFIRM_PASSWORD = "confirmPassword";
const CURRENT_PASSWORD = "currentPassword";
const NEW_PASSWORD = "newPassword";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ChangePasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: []
    };
  }

  hideShowCurrentPass = e => {
    e.preventDefault();
    const current = this.state.showCurrentPass;
    this.setState({ showCurrentPass: !current });
  };

  hideShowNewPass = e => {
    e.preventDefault();
    const current = this.state.showNewPass;
    this.setState({ showNewPass: !current });
  };

  hideShowConfirmPass = e => {
    e.preventDefault();
    const current = this.state.showConfirmPass;
    this.setState({ showConfirmPass: !current });
  };

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
    const { handleChangePassword } = this.props;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        handleChangePassword(values);
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue(NEW_PASSWORD)) {
      callback("Please ensure if password entered is correct & matching");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields([CONFIRM_PASSWORD], { force: true });
    }
    callback();
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const currentPassword =
      isFieldTouched(CURRENT_PASSWORD) && getFieldError(CURRENT_PASSWORD);
    const passwordError =
      isFieldTouched(NEW_PASSWORD) && getFieldError(NEW_PASSWORD);
    const confirmPasswordError =
      isFieldTouched(CONFIRM_PASSWORD) && getFieldError(CONFIRM_PASSWORD);

    return (
      <Form onSubmit={this.handleSubmit} className={"w100"}>
        <FormItem
          label="Current Password"
          validateStatus={currentPassword ? "error" : ""}
          help={currentPassword || ""}
        >
          {getFieldDecorator(CURRENT_PASSWORD, {
            rules: [
              {
                required: true,
                message: "Please input current password!"
              }
            ]
          })(
            <Input
              type={this.state.showCurrentPass ? "plain" : "password"}
              onChange={e => {
                e.preventDefault();
                if (this.state.showCurrentPass === undefined) {
                  this.setState({
                    showCurrentPass: false
                  });
                }
              }}
              placeholder=""
              suffix={
                <img
                  alt=""
                  onClick={this.hideShowCurrentPass}
                  className={
                    this.state.showCurrentPass === undefined ? "hidden" : ""
                  }
                  src={this.state.showCurrentPass === true ? hide : show}
                />
              }
            />
          )}
        </FormItem>
        <FormItem
          label="New Password"
          validateStatus={passwordError ? "error" : ""}
          help={passwordError || ""}
        >
          {getFieldDecorator(NEW_PASSWORD, {
            rules: [
              {
                required: true,
                message: "Please enter your password!"
              },
              {
                min: 6,
                message: "Password must be at least 6 characters"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              type={this.state.showNewPass ? "plain" : "password"}
              onChange={e => {
                e.preventDefault();
                if (this.state.showNewPass === undefined) {
                  this.setState({
                    showNewPass: false
                  });
                }
              }}
              placeholder=""
              suffix={
                <img
                  alt=""
                  onClick={this.hideShowNewPass}
                  className={
                    this.state.showNewPass === undefined ? "hidden" : ""
                  }
                  src={this.state.showNewPass === true ? hide : show}
                />
              }
            />
          )}
        </FormItem>
        <FormItem
          label="Confirm Password"
          validateStatus={confirmPasswordError ? "error" : ""}
          help={confirmPasswordError || ""}
        >
          {getFieldDecorator(CONFIRM_PASSWORD, {
            rules: [
              {
                required: true,
                message: "Please confirm your password!"
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(
            <Input
              onBlur={this.handleConfirmBlur}
              type={this.state.showConfirmPass ? "plain" : "password"}
              onChange={e => {
                e.preventDefault();
                if (this.state.showConfirmPass === undefined) {
                  this.setState({
                    showConfirmPass: false
                  });
                }
              }}
              placeholder=""
              suffix={
                <img
                  alt=""
                  onClick={this.hideShowConfirmPass}
                  className={
                    this.state.showConfirmPass === undefined ? "hidden" : ""
                  }
                  src={this.state.showConfirmPass === true ? hide : show}
                />
              }
            />
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
              Change
            </Button>
          </FormItem>
        </div>

        <div className="change-password-sticky-footer hide-desktop">
          <FormItem className="pull-right flex align-center mr16">
            <Button
              className="iqvia-btn"
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Change
            </Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

export default class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignIn: false,
      valid: true,
      link: this.props.match.params.link
    };

    this.emailOrPhone = "";
    this.ChangePasswordForm = Form.create()(ChangePasswordForm);
  }

  componentDidMount() {}

  handleChangePassword = async data => {
    const { changePassword } = this.props;
    changePassword(data);
  };

  clearError = e => {
    e.preventDefault();
    this.setState({
      msg: null,
      error: false
    });
  };

  gotoMyProfile = e => {
    e.preventDefault();
    this.props.history.push("/my-profile");
  };

  render() {
    const { ChangePasswordForm } = this;
    const {
      // is_password_changing,
      is_password_changed,
      is_changing_password_error = false,
      change_password_error
    } = this.props;
    // const menu = (
    //   <Menu>
    //     <Menu.Item>
    //       <a onClick={this.gotoMyProfile}>My Profile</a>
    //     </Menu.Item>
    //   </Menu>
    // );
    const profilePicLink = placeHolder;

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
              <AppHeader userDp={profilePicLink} />

              <div
                className=" text-align-l flex column align-items-start justify-content-center w100 "
                style={{ paddingTop: "100px" }}
              >
                <div
                  className={
                    "flex row align-items-center justify-content-start w100 mb20"
                  }
                >
                  <img
                    alt=""
                    onClick={e => {
                      e.preventDefault();
                      this.props.history.goBack();
                    }}
                    src={backIcon}
                    style={{ width: "20px" }}
                  />
                  <h1 className={"text-align-l bold dark fontsize18 mb0 pl20"}>
                    Change Password
                  </h1>
                </div>
                <ChangePasswordForm
                  handleChangePassword={this.handleChangePassword}
                />
              </div>
            </Col>
          </Row>
        </div>
        {is_changing_password_error && (
          <div className="error-component">
            <div className="flex  pr8 pl8 pt16 pb16">
              <Row className="w100">
                <Col xs={12} sm={12} md={10} lg={10} xl={10} xxl={10}>
                  <div>
                    <img alt="" src={icoError} className="mr8 inline" />
                    <div className="fontsize12 medium warning-color inline">
                      {change_password_error.message}
                    </div>
                  </div>
                </Col>
                {/* <Col xs={12} sm={12} md={2} lg={2} xl={2} xxl={2}>
                  <Button className="got-it-btn" onClick={this.clearError}>
                    <div className="flex align-items-center justify-content-center">
                      <img alt="" src={checkMark} />
                      <div className="dark fontsize14 medium ">Got It</div>
                    </div>
                  </Button>
                </Col> */}
              </Row>
            </div>
          </div>
        )}
      </div>
    );
  }
}
