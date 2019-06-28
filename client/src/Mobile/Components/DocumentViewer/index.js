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
    const { doc = [] } = this.props;
    if (doc !== undefined) {
      this.renderImage();
    }

    return (
      <Fragment>
        <div id="document-gallery">
          <div className="document-container" />
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(DocumentViewer);
