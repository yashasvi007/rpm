import React, { Component } from "react";
import { Form, Input } from "antd";

const { Item: FormItem } = Form;

class ReminderTitle extends Component {
  componentDidMount() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
  }
  componentWillUnmount() {
    const {
      form: { validateFields }
    } = this.props;
    validateFields();
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      fieldName,
      value,
      label,
      disabled
    } = this.props;

    const error = isFieldTouched(fieldName) && getFieldError(fieldName);

    return (
      <FormItem
        label={label}
        style={{ marginBottom: "16px" }}
        validateStatus={error ? "error" : ""}
        help={error || ""}
      >
        {getFieldDecorator(fieldName, {
          rules: [
            {
              required: true,
              message: "Enter reminder title"
            }
          ],
          initialValue: value
        })(<Input disabled={disabled} />)}
      </FormItem>
    );
  }
}

export default ReminderTitle;
