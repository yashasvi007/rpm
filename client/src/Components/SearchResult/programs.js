import React, { Component } from "react";
import ProgramCard from "../Cards/programCard";
import "./style.less";

class Program extends Component {
  render() {
    const { programs, handleOnClick } = this.props;

    return programs.map(program => {
      return (
        <ProgramCard
          key={program.id}
          data={program}
          handleOnClick={handleOnClick}
        />
      );
    });
  }
}

export default Program;
