import React, { Component } from "react";
import { Layout } from "antd";

import AppHeader from "../../Containers/Header";
import PageContent from "./pageContent";
import { USER_CATEGORY } from "../../constant";

class ProgramDetials extends Component {
  constructor(props) {
    super();
    this.state = {
      ProgramisLoading: false
    };
  }

  componentDidMount() {
    const pid = this.props.match.params.id;
    const {
      user_data: { basicInfo: { category } = {} } = {},
      getCurrentProgram
    } = this.props;
    this.setState({ ProgramisLoading: true });
    getCurrentProgram(pid).then(status => {
      this.setState({ ProgramisLoading: !status });
    });
    this.props.getProgramPatients(pid);
    if (category === USER_CATEGORY.CARE_COACH) {
      this.props.getProgramDoctor(pid);
    }
  }
  render() {
    const { ProgramisLoading } = this.state;
    return (
      (!ProgramisLoading && (
        <Layout>
          <AppHeader />
          <PageContent {...this.props} />
        </Layout>
      )) ||
      ""
    );
  }
}

export default ProgramDetials;
