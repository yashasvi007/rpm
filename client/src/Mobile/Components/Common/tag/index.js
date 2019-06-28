import React from "react";
import { Form, Select } from "antd";

const FormItem = Form.Item;
export default ({
  className,
  initialValue,
  getFieldDecorator,
  fieldName,
  onChange
}) => {
  return (
    <FormItem>
      {getFieldDecorator(fieldName, {
        initialValue: initialValue !== "" ? initialValue : null
      })(
        <Select
          className={`iqvia-tag ${className}`}
          dropdownStyle={{ display: "none" }}
          mode="tags"
          style={{ width: "100%" }}
          tokenSeparators={[","]}
          onChange={onChange}
        />
      )}
    </FormItem>
  );
};
