import React, { Component } from "react";
import { Form, Input } from "antd";
import { injectIntl } from "react-intl";
import { isNumber } from "../../../../../Helper/validation";
import messages from "../message";

const { Item: FormItem } = Form;

class RepeatInterval extends Component {
  componentDidMount() {
    this.validateFields();
  }
  componentWillUnmount() {
    this.validateFields();
  }

  validateFields = () => {
    const {
      form: { validateFields },
      setRepeatIntervalError
    } = this.props;
    validateFields((error, values) => {
      if (error !== null) {
        const { repeatInterval } = error;
        setRepeatIntervalError(repeatInterval !== undefined);
      }
    });
  };

  validateRepeatInterval = (rule, value, callback) => {
    const res = isNumber(value);

    if (value && res.valid === false) {
      callback(`${value} is not valid Repeat Interval.`);
    } else if (value > 1000) {
      callback("Repeat Interval cannot be greater than 1000");
    }
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      fieldName,
      value,
      getRepeatTypeStr,
      onRepeatIntervalChange,
      intl: { formatMessage }
    } = this.props;
    console.log(fieldName);
    const { validateRepeatInterval } = this;

    const repeatIntervalError =
      isFieldTouched(fieldName) && getFieldError(fieldName);

    return (
      <div className="ml16">
        <FormItem
          className="flex-1 flex repeat-interval"
          label={"Repeats Every"}
          validateStatus={repeatIntervalError ? "error" : ""}
          help={repeatIntervalError || ""}
        >
          {getFieldDecorator(fieldName, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.repeatIntervalError)
              },

              {
                validator: validateRepeatInterval
              }
            ],
            initialValue: value
          })(
            <Input
              onBlur={onRepeatIntervalChange}
              className="full-width repeat-interval"
              min={1}
              style={{ width: "100%" }}
            />
          )}
          <div className="repeat-type">{getRepeatTypeStr()}</div>
        </FormItem>
      </div>
    );
  }
}

export default injectIntl(RepeatInterval);
