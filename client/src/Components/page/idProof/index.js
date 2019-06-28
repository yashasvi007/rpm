import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Button } from "antd";
import AppHeader from "../../Header";
import DocumentViewer from "../../DocumentViewer";
import PdfViewer from "../../PdfViewer";
import backIcon from "../../../Assets/images/ico-back.svg";
import "./style.less";
import messages from "./messages";
import CommonUpload from "../../Common/upload";

class IdProofViewer extends Component {
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
        documents: { idProof: consentDocs = [] },
        isIdProofUploaded
      }
    } = this.props;
    if (
      isIdProofUploaded &&
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
      reUploadIdProofs,
      user_data: { basicInfo: { _id: userId } } = {}
    } = this.props;
    reUploadIdProofs(userId, fileList).then(value => {
      this.setState(
        {
          isPdf: false,
          currentIndex: 0,
          totalSize: 0
        },
        this.isPdf
      );
    });
  };

  render() {
    const {
      user_data: {
        documents: { idProof: idProof = [] },
        baseDocUrl
      },
      modal = false
    } = this.props;
    console.log("id props", this.props);
    let showIndex = idProof.length < 1 ? 0 : this.state.currentIndex + 1;
    const { isPdf, currentIndex, totalSize } = this.state;
    const uploadProps = { accept: "image/*,.pdf" };
    console.log(
      "this.props.user_data",
      this.props.user_data.documents,
      currentIndex
    );

    const { handleReupload, formatMessage } = this;
    // const savedOn = idProof[currentIndex];
    // const uploadDate = new moment(savedOn).format("DD/MM/YYYY hh:mm A");
    return (
      <Fragment>
        {!modal && <AppHeader />}
        {!modal && (
          <div className="hide-mobile hide-tablet-7 hide-tablet-9">
            <div className="id-proof fixed_header_sticky">
              <div className=" text-align-l flex column align-items-start justify-content-center ">
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
                    {formatMessage(messages.idProof)}
                  </div>
                </div>
              </div>
              <div className="flex justify-content-end align-items-center">
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
              <div className={"text-align-l bold dark fontsize18 mb0 pl20"}>
                {formatMessage(messages.idProof)}
              </div>
            </div>

            <p className="text">
              {showIndex} / {this.state.totalSize}
            </p>
            {/* <div className="fontsize12 cool-grey">{`${formatMessage(
              messages.uploadedOn
            )} ${uploadDate}`}</div> */}
            {isPdf && (
              <div className="full-width full-height">
                <PdfViewer doc={idProof[currentIndex]} baseUrl={baseDocUrl} />
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
                    <Button onClick={this.nextDocument}>Next</Button>
                  </div>
                </div>
              </div>
            )} */}

            {!this.state.isPdf && (
              <div className="full-width">
                <DocumentViewer
                  doc={idProof[currentIndex]}
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
                    onClick={this.nextDocument}
                    className={"next iqvia-btn"}
                  >
                    {formatMessage(messages.nextButton)}
                  </Button>
                </div>
              </div>
            </div>

            {!modal && (
              <div className="footer hide-desktop">
                <div className="flex justify-content-space-between  align-items-center m0 ml16">
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

export default injectIntl(IdProofViewer);
