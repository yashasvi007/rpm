import React, { Component, Fragment } from "react";

class RadioReadOnly extends Component {
  render() {
    const { data } = this.props;
    const { options } = data;
    return (
      <Fragment>
        {options &&
          options.map(singleOption => {
            const { id, value } = singleOption;
            return (
              <div key={id}>
                {id}. {value}
              </div>
            );
          })}
      </Fragment>
    );
  }
}

export default RadioReadOnly;
