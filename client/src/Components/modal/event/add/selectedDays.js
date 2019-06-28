import React, { Component, Fragment } from "react";
import { Form, Input } from "antd";

const { Item: FormItem } = Form;

class SelectedDays extends Component {
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
      form: { getFieldDecorator },
      fieldName,
      value,
      label
    } = this.props;
    return (
      <Fragment>
        <FormItem label={label} style={{ display: "none" }}>
          {getFieldDecorator(fieldName, {
            rules: [
              {
                required: true
              }
            ],
            initialValue: value
          })(<Input />)}
        </FormItem>
      </Fragment>
    );
  }
}

export default SelectedDays;
