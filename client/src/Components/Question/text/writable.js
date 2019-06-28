import React, { Component } from "react";
import { Input } from "antd";

const { TextArea } = Input;

class TextWritable extends Component {
  render() {
    const { data, onTextChange } = this.props;
    const { _id: questionId } = data;
    return (
      <TextArea
        onChange={e => {
          const value = e.target.value;
          onTextChange(questionId, value);
        }}
      />
    );
  }
}

export default TextWritable;
