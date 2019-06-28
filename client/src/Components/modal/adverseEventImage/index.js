import React, { Component } from "react";
import { Modal, Button, Icon } from "antd";
import { injectIntl } from "react-intl";
import axios from "axios";
import "./style.less";
import PdfViewer from "../../PdfViewer";
// import DocumentViewer from "../../DocumentViewer";
import PreviewDoc from "../../Common/docPreview/previewDoc";
import dateFns from "date-fns";
import messages from "./message";
import { REQUEST_TYPE } from "../../../constant";
import config from "../../../config";

const baseUrl = config.BASE_DOC_URL;
let zip = new window.JSZip();
const request = url => {
  return new Promise(async function(resolve) {
    axios({
      method: REQUEST_TYPE.GET,
      url: baseUrl + url,
      responseType: "blob"
    }).then(result => {
      zip.file(url, result.data);
      resolve();
    });
  });
};
class AdverseEventsImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPdf: false,
      currentIndex: 0,
      totalSize: 0,
      docs: []
    };
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  componentDidMount() {
    this.isPdf();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.adverseEventId !== this.props.adverseEventId) {
      const { events: { events } = {}, adverseEventId } = this.props;
      const documents = events ? events[adverseEventId] || {} : {};
      const { details: { docs = [], at } = {} } = documents;
      this.setState({ docs, currentIndex: 0, title: at }, this.isPdf);
      zip = new window.JSZip();
    }
  }

  isPdf = () => {
    const { docs = [] } = this.state;
    if (docs.length && docs[this.state.currentIndex].includes(".pdf")) {
      this.setState({ isPdf: true, totalSize: docs.length });
    } else {
      this.setState({ isPdf: false, totalSize: docs.length });
    }
    this.getElementIntoView();
  };

  nextDocument = () => {
    if (this.state.currentIndex + 1 < this.state.totalSize) {
      const index = this.state.currentIndex + 1;
      this.setState(
        {
          currentIndex: index
        },
        this.isPdf
      );
    }
  };

  previousDocument = () => {
    if (this.state.currentIndex - 1 >= 0) {
      const index = this.state.currentIndex - 1;
      this.setState(
        {
          currentIndex: index
        },
        this.isPdf
      );
    }
  };

  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  getElementIntoView = () => {
    const { currentIndex, docs = [] } = this.state;
    const element = document.getElementById(docs[currentIndex]);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  getScroll = () => {
    let options = [];
    const { docs = [], currentIndex } = this.state;
    if (docs.length > 0) {
      for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        options.push(
          <div key={doc} className="preview-block">
            <PreviewDoc
              key={doc}
              id={doc}
              type={doc.includes("pdf") ? "pdf" : "image"}
              className={
                currentIndex === i ? "case-image outline" : "case-image"
              }
              src={baseUrl + doc}
            />
          </div>
        );
      }
    }
    return options;
  };

  downloadAll = () => {
    const { docs: urls } = this.state;

    let options = [];

    Promise.all(
      urls.map(function(url) {
        return request(url);
      })
    )
      .then(function() {
        console.log("sds", zip);
        zip
          .generateAsync({
            type: "blob"
          })
          .then(function(content) {
            window.open(URL.createObjectURL(content), "_blank");
          });
      })
      .catch(err => {
        console.log("error:", err);
      });
    return options;
  };

  footer = () => {
    const { formatMessage } = this;
    return (
      <div className="flex align-items-center justify-content-end h72px mr24">
        <Button ghost type="primary iqvia-btn" onClick={this.handleCancel}>
          {formatMessage(messages.cancelButton)}
        </Button>
        <Button
          type="primary iqvia-btn"
          onClick={this.downloadAll}
          //loading={requesting}
        >
          {formatMessage(messages.downloadAllButton)}
        </Button>
      </div>
    );
  };

  render() {
    const { show: visible } = this.props;
    const { docs, currentIndex, isPdf, totalSize, title } = this.state;
    const { formatMessage } = this;
    let showIndex = docs.length < 1 ? 0 : this.state.currentIndex + 1;
    const modalProps = {
      visible: visible,
      title:
        formatMessage(messages.imagesFrom) +
        dateFns.format(title, "DD/MM/YYYY, h:mm a") +
        " " +
        formatMessage(messages.report),
      onCancel: this.handleCancel,
      wrapClassName: "global-modal",
      destroyOnClose: true,
      bodyStyle: { height: "auto" },
      width: "1360px",
      footer: this.footer(),
      className: "adverse-event-image-modal"
    };

    return (
      <Modal {...modalProps}>
        <div className="adverse-event-image-modal-text">
          <div className="text-left">
            {showIndex} / {totalSize}
          </div>
          <div className="text-right">
            {formatMessage(messages.uploadedOn)}{" "}
            {dateFns.format(title, "DD/MM/YYYY, h:mm a")}
          </div>
        </div>
        <div className="document-wrapper">
          {isPdf && (
            <div className="full-height">
              <PdfViewer doc={{ file: docs[currentIndex] }} baseUrl={baseUrl} />
            </div>
          )}
          {!isPdf && (
            <div className="">
              <img
                alt="curr-docs"
                style={{ height: "400px", width: "700px" }}
                src={baseUrl + docs[currentIndex]}
              />
              {/*<DocumentViewer*/}
              {/*  doc={{ file: docs[currentIndex] }}*/}
              {/*  baseUrl={baseUrl}*/}
              {/*/>*/}
            </div>
          )}
        </div>

        <div className="nav-container flex align-items-center justify-content-space-between">
          <Icon
            className={currentIndex - 1 < 0 ? "icons disabled" : "icons"}
            onClick={this.previousDocument}
            type="left"
          />
          <div className="image-navigation-wrapper flex-1">
            <div className="image-navigation">
              {docs.length > 0 && this.getScroll()}
            </div>
          </div>
          <Icon
            className={
              currentIndex + 1 >= totalSize ? "icons disabled" : "icons"
            }
            onClick={this.nextDocument}
            type="right"
          />
        </div>
      </Modal>
    );
  }
}

export default injectIntl(AdverseEventsImage);
