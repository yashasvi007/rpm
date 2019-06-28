import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import moment from "moment";
import messages from "./message";
import "./style.less";

class DocumentViewer extends Component {
  constructor(props) {
    super(props);
    this.imageViewer = "";
    this.state = {};
  }

  componentDidMount() {
    this.renderImage();
  }

  renderImage = () => {
    const element = document.getElementsByClassName("document-container");
    this.imageViewer = window.ImageViewer(element);
    this.showImage();
  };

  onClickImage = e => {
    e.preventDefault();
  };

  showImage = () => {
    const { baseUrl } = this.props;
    const { doc } = this.props;
    if (doc !== undefined) {
      this.imageViewer.load(
        `${baseUrl}${doc.file}`
        //`${baseUrl}${doc.file}`
      );
    }
  };

  componentWillUnmount() {}

  render() {
    const {
      intl: { formatMessage }
    } = this.props;

    const { doc = [] } = this.props;
    if (doc !== undefined) {
      this.renderImage();
    }

    const savedOn = doc.uploadedOn;
    const uploadDate = new moment(savedOn).format("DD/MM/YYYY hh:mm A");
    return (
      <Fragment>
        {savedOn ? (
          <div className="full-width flex justify-content-space-between">
            <div className="fontsize12 cool-grey">{`${formatMessage(
              messages.uploadedOn
            )} ${uploadDate}`}</div>
          </div>
        ) : null}
        <div id="document-gallery">
          <div className="document-container" />
        </div>
        {/* <div className="fontsize12 cool-grey mt8 mb8 hide-mobile hide-tablet-9 hide-tablet-7">
          Use CTRL + Scroll for Zoom in/out
        </div> */}
        <div className="fontsize12 cool-grey mt8 mb8 hide-desktop">
          Use Two finger pinch for Zoom in/out
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(DocumentViewer);
