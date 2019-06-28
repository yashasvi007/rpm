import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import isEmpty from "lodash-es/isEmpty";
import Spin from "antd/es/spin";
import AppHeader from "../../Containers/Header";
import Icon from "antd/es/icon";
import moment from "moment";
import "./summaryStyles.less";
import CapsuleIcon from "../../../Assets/images/ico-capsule-flat-clr.png";

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currentProgram: null,
      programId: null
    };
  }

  componentDidMount() {
    const { getCurrentProgram } = this.props;
    getCurrentProgram()
      .then(() => {
        const { programs = {}, programId, products } = this.props;
        const currentProgram = programs[programId];
        this.setState({ currentProgram, programId, products });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  goBack = () => {
    const { history } = this.props;
    history.goBack();
  };

  render() {
    console.log("this.props --SUMMARY--", this.props);
    console.log("this.state ----", this.state);
    const { loading, currentProgram, products } = this.state;
    return (
      <Fragment>
        <AppHeader />
        <div className="summary">
          {loading && (
            <div className="loading">
              <Spin />
            </div>
          )}
          <div className="summary-content">
            {!loading && (
              <Fragment>
                <div className="clearFix-8" />
                <div className="flex row align-items-center fontsize16 medium dark fw500">
                  Program Info
                </div>
                <div className="clearFix-24" />
                <div className="flex column">
                  <div className="flex row align-items-center medium fontsize12 cool-grey">
                    Pharma Co
                  </div>
                  <div className="clearFix-4" />
                  <div className="flex row align-items-center medium fontsize14">
                    {(currentProgram && currentProgram.name) || ""}
                  </div>
                </div>
                <div className="clearFix-24" />
                <div className="flex column">
                  <div className="flex row align-items-center medium fontsize12 cool-grey">
                    Target Location
                  </div>
                  <div className="clearFix-4" />
                  <div className="flex row align-items-center medium fontsize14">
                    {(currentProgram &&
                      currentProgram.targetLocation &&
                      `${currentProgram.targetLocation.country},${
                        currentProgram.targetLocation.city
                      }`) ||
                      ""}
                  </div>
                </div>
                <div className="clearFix-24" />
                <div className="flex column">
                  <div className="flex row align-items-center medium fontsize12 cool-grey">
                    Created On
                  </div>
                  <div className="clearFix-4" />
                  <div className="flex row align-items-center medium fontsize14 dark">
                    {(currentProgram &&
                      currentProgram.createdAt &&
                      moment(currentProgram.createdAt).format(
                        "DD MMMM YYYY"
                      )) ||
                      ""}
                  </div>
                </div>
                <div className="clearFix-24" />
                <div className="flex column">
                  <div className="flex row align-items-center medium fontsize12 cool-grey">
                    Expires On
                  </div>
                  <div className="clearFix-4" />
                  <div className="flex row align-items-center medium fontsize14">
                    {(currentProgram &&
                      currentProgram.expiresOn &&
                      moment(currentProgram.expiresOn).format(
                        "DD MMMM YYYY"
                      )) ||
                      ""}
                  </div>
                </div>
                <div className="clearFix-24" />
                <div className="flex column">
                  <div className="flex row align-items-center medium fontsize12 cool-grey">
                    Description
                  </div>
                  <div className="clearFix-4" />
                  <div className="flex row align-items-center medium fontsize14">
                    {(currentProgram && currentProgram.description) || ""}
                  </div>
                </div>
                <div className="clearFix-24" />
                <div className="flex column">
                  <div className="flex row align-items-center medium fontsize12 cool-grey ">
                    {(products && Object.keys(products).length) || 0} Products
                    selected
                  </div>
                  <div className="clearFix-4" />
                  <div className="flex flex-wrap">
                    {!isEmpty(products)
                      ? Object.keys(products).map((key, index) => {
                          let value = products[key];
                          return (
                            <div className="product" key={index}>
                              <span>
                                <img src={CapsuleIcon} alt="product" />
                              </span>
                              <span>{value.name}</span>
                            </div>
                          );
                        })
                      : ""}
                  </div>
                </div>
              </Fragment>
            )}
            <div>
              <div />
            </div>
          </div>
          <div className="summary-footer">
            <div className="arrow-wrapper">
              <Icon type="arrow-left" onClick={this.goBack} />
            </div>
            <div className="text">My Calendar Details</div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(Summary);
