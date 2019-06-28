import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Button } from "antd";
//import moment from "moment";
import AppHeader from "../../Header";
import DocumentViewer from "../../DocumentViewer";
import PdfViewer from "../../PdfViewer";
import backIcon from "../../../Assets/images/ico-back.svg";
import "./style.less";
import messages from "./messages";
import CommonUpload from "../../Common/upload";

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

  handleReupload = fileList => {
    const {
      reUploadConsentDocs,
      user_data: { basicInfo: { _id: userId } } = {}
    } = this.props;
    reUploadConsentDocs(userId, fileList).then(value => {
      this.setState(
        {
          isPdf: false,
          currentIndex: 0,
          totalSize: 0,
          isConsentFormUploaded: true
        },
        this.isPdf
      );
    });
  };

  render() {
    const {
      user_data: {
        documents: { consentForm: consentDocs = [] },
        baseDocUrl
      },
      modal = false
    } = this.props;
    let showIndex = consentDocs.length < 1 ? 0 : this.state.currentIndex + 1;
    const { isPdf, currentIndex, totalSize } = this.state;
    const uploadProps = { accept: "image/*,.pdf" };

    const { handleReupload, formatMessage } = this;
    //const savedOn = consentDocs[currentIndex];
    //const uploadDate = new moment(savedOn).format("DD/MM/YYYY hh:mm A");
    return (
      <Fragment>
        {!modal && <AppHeader />}
        {!modal && (
          <div className="hide-mobile hide-tablet-7 hide-tablet-9">
            <div className="consent-form fixed_header_sticky">
              <div className="  text-align-l flex column align-items-start justify-content-space-between  ">
                <div
                  className={
                    "flex row align-items-center justify-content-start w100 pl20"
                  }
                >
                  <img
                    className="clickable"
                    alt=""
                    onClick={e => {
                      e.preventDefault();
                      this.props.history.goBack();
                    }}
                    src={backIcon}
                    style={{ width: "20px" }}
                  />
                  <div className="dark fontsize12 pl20">
                    {formatMessage(messages.myProfile)}
                  </div>
                  <div className="text-align-l bold dark fontsize18 mb0 pl20">
                    {formatMessage(messages.consentDocs)}
                  </div>
                </div>
              </div>
              <div className="flex justify-content-end  align-items-center">
                <div className="fontsize12 cool-grey">
                  {formatMessage(messages.replaceWarning)}
                </div>
                <div className="mr16 ml16">
                  <CommonUpload
                    label={formatMessage(messages.reUploadText)}
                    uploadProps={uploadProps}
                    handleComplete={handleReupload}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="main-iqvia-container consent-document-viewer">
          {!modal && (
            <div
              className="dark fontsize12 hide-desktop"
              style={{ marginTop: 100 }}
            >
              {formatMessage(messages.myProfile)}
            </div>
          )}
          <div className=" text-align-l flex column align-items-start justify-content-center w100 mt32 ">
            <div
              className={
                "flex row align-items-center justify-content-start w100 mb20 hide-desktop"
              }
            >
              <img
                alt=""
                onClick={e => {
                  e.preventDefault();
                  this.props.history.goBack();
                }}
                src={backIcon}
                style={{ width: "20px" }}
              />
              <h1 className={"text-align-l bold dark fontsize18 mb0 pl20"}>
                {formatMessage(messages.consentDocs)}
              </h1>
            </div>

            <p className="text">
              {showIndex} / {totalSize}
            </p>
            {/* <div className="fontsize12 cool-grey">{`${formatMessage(
              messages.uploadedOn
            )} ${uploadDate}`}</div> */}
            {isPdf && (
              <div className="full-width full-height">
                <PdfViewer
                  doc={consentDocs[currentIndex]}
                  baseUrl={baseDocUrl}
                />
              </div>
            )}

            {/* {this.state.isPdf && (
              <div className="pdf-viewer">
                <p className="text">
                  {pageNumber} / {numPages}
                </p>
                <Document
                  file={this.state.pdfUrl}
                  onLoadSuccess={this.onDocumentLoadSuccess}
                >
                  <Page pageNumber={pageNumber} />
                </Document>
                <div className="page-number">
                  <div className="padding-10">
                    <Button onClick={this.previousPage}>Prev</Button>
                  </div>
                  <div className="padding-10">
                    <Button onClick={this.nextPage}>Next</Button>
                  </div>
                </div>
              </div>
            )} */}

            {!isPdf && (
              <div className="full-width">
                <DocumentViewer
                  doc={consentDocs[currentIndex]}
                  baseUrl={baseDocUrl}
                />
              </div>
            )}

            <div className="pdf-viewer flex align-items-center justify-content-space-between">
              <div>
                {!this.state.isPdf ? (
                  <div className="fontsize12 cool-grey">
                    Use Scroll to Zoom in/out
                  </div>
                ) : (
                  ""
                )}
                <div className="fontsize12 cool-grey">
                  Re-uploading will replace the existing files
                </div>
              </div>
              <div className="page-number">
                <div className="padding-10">
                  <Button
                    disabled={currentIndex - 1 < 0}
                    onClick={this.previousDocument}
                    className={"prev iqvia-btn"}
                  >
                    {formatMessage(messages.prevButton)}
                  </Button>
                </div>
                <div className="padding-10">
                  <Button
                    disabled={currentIndex + 1 >= totalSize}
                    className={"next iqvia-btn"}
                    onClick={this.nextDocument}
                  >
                    {formatMessage(messages.nextButton)}
                  </Button>
                </div>
              </div>
            </div>

            {!modal && (
              <div className="footer hide-desktop">
                <div className="flex justify-content-space-between align-items-center m0 ml16">
                  <div className="fontsize12 cool-grey mr16 ml16">
                    {formatMessage(messages.replaceWarning)}
                  </div>
                  <div className="mr16 ml16 mt10">
                    <CommonUpload
                      label={formatMessage(messages.reUploadText)}
                      uploadProps={uploadProps}
                      handleComplete={handleReupload}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(ConsentDocumentView);
