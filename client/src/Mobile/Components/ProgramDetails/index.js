import React, { Component, Fragment } from "react";
import { Layout } from "antd";
import "./style.less";

import AppHeader from "../../Containers/Header";
import PageContent from "./pageContent";
import { USER_CATEGORY } from "../../../constant";

class ProgramDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProgramIsLoading: false
    };
  }

  componentDidMount() {
    const pid = this.props.match.params.id;
    const {
      user_data: { basicInfo: { category } = {} } = {},
      getCurrentProgram
    } = this.props;
    this.setState({ ProgramIsLoading: true });
    getCurrentProgram(pid).then(status => {
      this.setState({ ProgramIsLoading: !status });
    });
    this.props.getProgramPatients(pid);
    if (category === USER_CATEGORY.CARE_COACH) {
      this.props.getProgramDoctor(pid);
    }
  }
  render() {
    const { ProgramIsLoading } = this.state;
    return (
      (!ProgramIsLoading && (
        <Fragment>
          <AppHeader />
          <div className="program-details-wrapper">
            <PageContent {...this.props} />
          </div>
        </Fragment>
      )) ||
      ""
    );
  }
}

export default ProgramDetails;
