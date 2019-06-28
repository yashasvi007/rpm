import React, { Component } from "react";
import { Layout, Form, Button, Input, Icon } from "antd";
import AppHeader from "../Header";
import axios from "axios";
import SignIn from "../SignIn";

const FormItem = Form.Item;

const PASSWORD = "password";
const CONFIRM_PASSWORD = "confirmPassword";

const ErrorState = ({ errorMsg }) => {
  return (
    <div>
      <AppHeader />
      <div
        className="flex justify-content-center "
        style={{ paddingTop: "150px" }}
      >
        <p className="bold">{errorMsg}</p>
      </div>
    </div>
  );
};

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

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    const passwordError = isFieldTouched(PASSWORD) && getFieldError(PASSWORD);
    const confirmPasswordError =
      isFieldTouched(CONFIRM_PASSWORD) && getFieldError(CONFIRM_PASSWORD);

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="New Password"
          validateStatus={passwordError ? "error" : ""}
          help={passwordError || ""}
        >
          {getFieldDecorator(PASSWORD, {
            rules: [
              {
                required: true,
                message: "Please enter your password"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="New Password"
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
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              onBlur={this.handleConfirmBlur}
            />
          )}
        </FormItem>
        <FormItem className="pull-right">
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Change Password
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default class Identify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignIn: false,
      valid: true,
      link: this.props.match.params.link
    };

    this.emailOrPhone = "";
    this.ChangePasswordForm = Form.create()(ChangePasswordForm);
    this.checkValidation = this.checkValidation.bind(this);
  }

  checkValidation = async () => {
    let res = null;
    try {
      const url = "/api/validate";
      res = await axios.post(url, {
        link: this.state.link
      });

      if (res.status === 200) {
        // eslint-disable-next-line no-unused-vars
        const data = res.data.payload.data;

        if (res.data.status) {
          this.setState({
            valid: true
          });
        }
      } else {
        this.setState({ error: res.data.payload.error.message, valid: false });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.payload) {
          const data = error.response.data.payload.error;

          this.setState(
            {
              error: data.message,
              valid: false,
              errorState: true
            },
            function() {}
          );
        }
      }
    }
  };

  componentDidMount() {
    this.checkValidation();
  }

  handleChangePassword = async data => {
    const url = "/api/change-forgotten-password";
    const res = await axios.post(url, {
      password: data.password,
      confirmPassword: data.confirmPassword,
      link: this.state.link
    });
    if (res.data.status) {
      this.setState({ showSignIn: true });
    }
  };

  render() {
    const { ChangePasswordForm } = this;

    if (this.state.valid != null) {
      if (this.state.valid) {
        return this.state.showSignIn === false ? (
          <Layout justify="center" align="middle">
            <AppHeader />
            <div
              className=" text-align-l flex justify-content-center "
              style={{ paddingTop: "150px" }}
            >
              <ChangePasswordForm
                handleChangePassword={this.handleChangePassword}
              />
            </div>
          </Layout>
        ) : (
          <SignIn {...this.props} />
        );
      } else {
        return <ErrorState errorMsg={this.state.error} />;
      }
    } else {
      return <div />;
    }
  }
}
