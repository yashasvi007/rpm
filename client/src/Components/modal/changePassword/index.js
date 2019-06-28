import React, { Component, Fragment } from "react";
import { Modal, Button, Form, Input } from "antd";
import { injectIntl } from "react-intl";
import "../style.less";
import messages from "./message";
import hide from "../../../Assets/images/icon-flat-hide.svg";
import show from "../../../Assets/images/icon-flat-show.svg";
import icoError from "../../../Assets/images/ico-err.svg";
import { hasErrors } from "../../../Helper/validation";

const FormItem = Form.Item;

const CONFIRM_PASSWORD = "confirmPassword";
const CURRENT_PASSWORD = "currentPassword";
const NEW_PASSWORD = "newPassword";
const ERROR_PRONES_FIELD = [CONFIRM_PASSWORD, CURRENT_PASSWORD, NEW_PASSWORD];

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      currPass: null,
      newPass: null,
      confirmPass: null
    };
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  componentDidUpdate(prevprops, prevstate) {
    if (prevprops.show !== this.props.show) {
      this.props.form.validateFields();
    }
  }

  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  //   handleSubmit = e => {
  //     e.preventDefault();

  //     this.props.form.validateFields((err, values) => {
  //       //
  //       if (!err) {

  //       }
  //     });

  //     close();
  //   };

  formatMessage = data => this.props.intl.formatMessage(data);

  footer = (currPass, newPass, confirmPass) => {
    const { formatMessage, handleCancel } = this;
    const { getFieldsError } = this.props.form;

    return (
      <Fragment>
        <div
          className={`flex align-items-center justify-content-end h72px mr24 ml24`}
        >
          <div className="flex align-items-center justify-content-end">
            <Button className="iqvia-btn cancel mr8" onClick={handleCancel}>
              {formatMessage(messages.cancel)}
            </Button>
            <Button
              type="primary iqvia-btn"
              htmlType="submit"
              onClick={this.handleSubmit}
              disabled={hasErrors(getFieldsError())}
            >
              {formatMessage(messages.changeButton)}
            </Button>
          </div>
        </div>
      </Fragment>
    );
  };

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

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleChangePassword = async data => {
    const { changePassword } = this.props;
    changePassword(data);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { handleChangePassword } = this;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        handleChangePassword(values);
      }
    });

    // const { is_password_changed, close } = this.props;
    //
    // if (is_password_changed) {
    //   close();
    // }
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
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const {
      show: visible,
      isError,
      change_password_error,
      is_changing_password_error = false
    } = this.props;

    if (!visible) {
      return null;
    }

    const { handleCancel, footer } = this;
    const title = "ChangePassword";

    const modalProps = {
      visible: visible || isError,
      title: title,
      onCancel: handleCancel,
      wrapClassName: "global-modal full-height",
      destroyOnClose: true,
      bodyStyle: { height: "100%" },
      width: "480px",
      footer: footer(
        this.state.currPass,
        this.state.newPass,
        this.state.confirmPass
      )
    };

    let fieldError = {};
    ERROR_PRONES_FIELD.forEach(field => {
      const error = isFieldTouched(field) && getFieldError(field);
      fieldError = { ...fieldError, [field]: error };
    });

    return (
      <Modal {...modalProps}>
        <div className="pl48 pr24">
          <Form className="event-form">
            <FormItem
              label="Current Password"
              validateStatus={fieldError[CURRENT_PASSWORD] ? "error" : ""}
              help={fieldError[CURRENT_PASSWORD] || ""}
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
                    this.setState({ currPass: e.target.value });
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
                      className={`clickable ${
                        this.state.showCurrentPass === undefined ? "hidden" : ""
                      }`}
                      src={this.state.showCurrentPass === true ? hide : show}
                    />
                  }
                />
              )}
            </FormItem>
            <FormItem
              label="New Password"
              validateStatus={fieldError[NEW_PASSWORD] ? "error" : ""}
              help={fieldError[NEW_PASSWORD] || ""}
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
                    this.setState({ newPass: e.target.value });
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
                      className={`clickable ${
                        this.state.showNewPass === undefined ? "hidden" : ""
                      }`}
                      src={this.state.showNewPass === true ? hide : show}
                    />
                  }
                />
              )}
            </FormItem>
            <FormItem
              label="Confirm Password"
              validateStatus={fieldError[CONFIRM_PASSWORD] ? "error" : ""}
              help={fieldError[CONFIRM_PASSWORD] || ""}
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
                    this.setState({ confirmPass: e.target.value });
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
          </Form>
          {is_changing_password_error && (
            <div
              className={
                "w100 absolute flex row align-items-center justify-content-start"
              }
              style={{
                backgroundColor: "#fff8f5",
                bottom: "70px",
                height: "40px",
                marginLeft: "-48px"
              }}
            >
              <div
                style={{
                  display: "block",
                  width: "13px",
                  marginLeft: "24px",
                  textAlign: "center"
                }}
              >
                <img
                  alt=""
                  src={icoError}
                  className={"w100"}
                  style={{ display: "block" }}
                />
              </div>
              <div className={"fontsize12 medium warning-color ml8"}>
                {change_password_error.message}
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

export default Form.create()(injectIntl(ChangePassword));
