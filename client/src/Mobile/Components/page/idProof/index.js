import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Button } from "antd";
import AppHeader from "../../Header";
import DocumentViewer from "../../DocumentViewer";
import PdfViewer from "../../PdfViewer";
import backIcon from "../../../../Assets/images/ico-back.svg";
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

  handleReUpload = fileList => {
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

    const { handleReUpload, formatMessage } = this;
    return (
      <Fragment>
        <div className="consent-document-viewer">
          <div className=" text-align-l flex column align-items-start justify-content-center w100 mt32 ">
            <p className="text">
              {showIndex}/{this.state.totalSize}
            </p>
            {isPdf && (
              <div className="full-width full-height">
                <PdfViewer doc={idProof[currentIndex]} baseUrl={baseDocUrl} />
              </div>
            )}
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
                      handleComplete={handleReUpload}
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
