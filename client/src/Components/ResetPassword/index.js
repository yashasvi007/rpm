import React, { Component } from "react";
import { Layout, Form, Button, Input } from "antd";
import AppHeader from "../Header";
import axios from "axios";
import { hasErrors } from "../../Helper/validation";
const FormItem = Form.Item;

const PASSWORD = "password";
const CONFIRM_PASSWORD = "confirm";

const ERROR_PRONES_FIELD = [PASSWORD, CONFIRM_PASSWORD];

class ResetPasswordForm extends Component {
  constructor(props) {
    super(props);
    this.state = { confirmDirty: false };
  }
  componentDidMount() {
    this.props.form.validateFields();
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue(PASSWORD)) {
      callback("Two passwords that you enter is inconsistent!");
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

  validateFields = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { password, confirm } = values;
        if (password === confirm) {
          this.handleChangePassWord({
            password: this.password,
            confirmPassword: this.confirmPassword,
            link: this.props.link
          });
        }
      }
    });
  };

  handleChangePassWord = async data => {
    const url = "/api/change-forgotten-password";
    await axios
      .post(url, {
        ...data
      })
      .then(result => {
        const {
          data: { status }
        } = result;
        if (status) {
          this.props.history.push("/sign-in");
        } else {
          this.props.form.resetFields();
        }
      });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      isFieldTouched,
      getFieldError
    } = this.props.form;
    let fieldError = {};
    ERROR_PRONES_FIELD.forEach(field => {
      const error = isFieldTouched(field) && getFieldError(field);
      fieldError = { ...fieldError, [field]: error };
    });

    return (
      <Form className="">
        <FormItem label="Email">
          <Input placeholder="Email" readOnly={true} value={this.props.email} />
        </FormItem>
        <Form.Item
          label="New Password"
          validateStatus={fieldError[PASSWORD] ? "error" : ""}
          help={fieldError[PASSWORD] || ""}
        >
          {getFieldDecorator(PASSWORD, {
            rules: [
              {
                required: true,
                message: "Please input new password!"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              placeholder="New Password"
              type="password"
              onChange={e => {
                this.password = e.target.value;
              }}
            />
          )}
        </Form.Item>
        <Form.Item
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
              placeholder="Confirm Password"
              type="password"
              onChange={e => {
                this.confirmPassword = e.target.value;
              }}
              onBlur={this.handleConfirmBlur}
            />
          )}
        </Form.Item>
        <FormItem className="pull-right">
          <Button
            type="primary"
            disabled={hasErrors(getFieldsError())}
            onClick={this.validateFields}
          >
            Reset Password
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      valid: false,
      link: this.props.match.params.link
    };
    this.ResetPasswordForm = Form.create()(ResetPasswordForm);
    this.password = "";
    this.confirmPassword = "";
  }

  componentDidMount() {
    this.props.validateLink({ link: this.state.link });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.email !== this.props.email) {
      this.setState({ valid: this.props.valid, email: this.props.email });
    }
  }

  render() {
    const { ResetPasswordForm } = this;
    return this.state.valid === true ? (
      <Layout justify="center" align="middle">
        <AppHeader />
        <div className="page-container text-align-l">
          <ResetPasswordForm {...this.props} />
        </div>
      </Layout>
    ) : (
      <div />
    );
  }
}
