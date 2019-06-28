import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Button, Icon } from "antd";
import AppHeader from "../../Header";
import DocumentViewer from "../../DocumentViewer";
import PdfViewer from "../../PdfViewer";
import backIcon from "../../../../Assets/images/ico-back.svg";
import "./style.less";
import messages from "./messages";
import moment from "moment";
import CommonUpload from "../../Common/upload";
import PreviewDoc from "../../../../Components/Common/docPreview/previewDoc";

class ConsentDocumentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPdf: false,
      currentIndex: 0,
      totalSize: 0
    };
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  componentDidMount() {
    window.scrollTo(0, 0);
    this.isPdf();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.modal &&
      this.props.user_data.documents !== prevProps.user_data.documents
    ) {
      this.setState(
        {
          currentIndex: 0
        },
        this.isPdf
      );
    }
  }

  isPdf = () => {
    const {
      user_data: {
        documents: { consentForm: consentDocs = [] },
        isConsentFormUploaded
      }
    } = this.props;
    if (
      isConsentFormUploaded &&
      consentDocs[this.state.currentIndex].file.includes(".pdf")
    ) {
      this.setState({ isPdf: true, totalSize: consentDocs.length });
    } else {
      this.setState({ isPdf: false, totalSize: consentDocs.length });
    }
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

  getScroll = () => {
    let options = [];
    const { currentIndex } = this.state;
    const {
      user_data: {
        documents: { consentForm: docs = [] },
        baseDocUrl: baseUrl
      }
    } = this.props;
    if (docs.length > 0) {
      for (let i = 0; i < docs.length; i++) {
        const doc = docs[i].file;
        options.push(
          <div
            key={doc}
            className="preview-block"
            onClick={() => this.setState({ currentIndex: i })}
          >
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

  render() {
    const {
      user_data: {
        documents: { consentForm: consentDocs = [] },
        baseDocUrl
      }
    } = this.props;
    let showIndex = consentDocs.length < 1 ? 0 : this.state.currentIndex + 1;
    const { isPdf, currentIndex, totalSize } = this.state;
    const doc = consentDocs[currentIndex];
    const { uploadedOn: savedOn = [] } = doc;
    console.log("doc ----", doc);
    const uploadDate = new moment(savedOn).format("DD/MM/YYYY hh:mm A");
    console.log(
      "---- 111111111111111111111111 ----",
      `${baseDocUrl}${doc.file}`
    );
    const { formatMessage } = this;
    return (
      <Fragment>
        <div className="consent-document-viewer">
          <div className="consent-header">
            <div className="consent-header-left">
              {showIndex}/{totalSize}
            </div>
            <div className="consent-header-right">
              <div className="fontsize12 cool-grey">{`${formatMessage(
                messages.uploadedOn
              )} ${uploadDate}`}</div>
            </div>
          </div>
          <div className="consent-body">
            {isPdf && (
              <div className="full-width full-height">
                <PdfViewer
                  doc={consentDocs[currentIndex]}
                  baseUrl={baseDocUrl}
                />
              </div>
            )}
            {!isPdf && (
              <div className="full-width">
                <img
                  alt="curr-docs"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                  src={`${baseDocUrl}${doc.file}`}
                />
                {/*<Viewer*/}
                {/*  visible={true}*/}
                {/*  onClose={() => {*/}
                {/*    this.setState({ visible: false });*/}
                {/*  }}*/}
                {/*  images={[{src: `${baseDocUrl}${doc.file}`, alt: ''}]}*/}
                {/*  //images={[`${baseDocUrl}${consentDocs[currentIndex]}`]}*/}
                {/*  noNavbar={true}*/}
                {/*  noToolbar={true}*/}
                {/*  noImgDetails={true}*/}
                {/*  noFooter={true}*/}
                {/*/>*/}
                {/*<DocumentViewer*/}
                {/*  doc={consentDocs[currentIndex]}*/}
                {/*  baseUrl={baseDocUrl}*/}
                {/*/>*/}
              </div>
            )}
          </div>
          <div className="consent-footer">
            <div className="consent-instructions">
              <div className="top-text fontsize12 cool-grey">
                Use Two finger pinch for Zoom in/out
              </div>
              <div className="bottom-text fontsize12 cool-grey">
                Re-uploading will replace the existing files
              </div>
            </div>
            <div className="doc-changer">
              <div className="nav-container">
                {/*<Icon*/}
                {/*  className={currentIndex - 1 < 0 ? "icons disabled" : "icons"}*/}
                {/*  onClick={this.previousDocument}*/}
                {/*  type="left"*/}
                {/*/>*/}
                <div className="image-navigation-wrapper flex-1">
                  <div className="image-navigation hide-scroll">
                    {consentDocs.length > 0 && this.getScroll()}
                  </div>
                </div>
                {/*<Icon*/}
                {/*  className={*/}
                {/*    currentIndex + 1 >= totalSize ? "icons disabled" : "icons"*/}
                {/*  }*/}
                {/*  onClick={this.nextDocument}*/}
                {/*  type="right"*/}
                {/*/>*/}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(ConsentDocumentView);
