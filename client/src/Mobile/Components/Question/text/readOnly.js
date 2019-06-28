import React, { Component } from "react";
import { Input } from "antd";

const { TextArea } = Input;

class TextReadOnly extends Component {
  render() {
    return <TextArea disabled />;
  }
}

export default TextReadOnly;
