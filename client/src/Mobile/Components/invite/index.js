import React, { Component } from "react";
import AppHeader from "../../../Components/Header";
import SignUp from "../../Containers/SignUp";

const ErrorState = ({ errorMsg }) => {
  return (
    <div>
      <AppHeader />
      <div
        className="flex justify-content-center "
        style={{ paddingTop: "150px" }}
      >
        <p className="bold">{errorMsg.message}</p>
      </div>
    </div>
  );
};

class Invite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.match.params.link
    };
  }

  componentDidMount() {
    this.props.validateLink({ link: this.state.link });
  }

  render() {
    if (this.props.valid === true) {
      return <SignUp />;
    } else if (this.props.error) {
      return <ErrorState errorMsg={this.props.error} />;
    } else {
      return <div />;
    }
  }
}

export default Invite;
