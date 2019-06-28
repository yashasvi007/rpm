import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import "./style.less";
import { Document, Page, pdfjs } from "react-pdf";
import moment from "moment";
import messages from "./messages";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

class IdProofViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1
    };
  }

  componentDidMount() {
    let pdfUrl = this.props.doc ? this.props.baseUrl + this.props.doc.file : "";
    this.setState({ pdfUrl: pdfUrl });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.doc !== prevProps.doc) {
      let pdfUrl = this.props.doc
        ? this.props.baseUrl + this.props.doc.file
        : "";
      this.setState({ pdfUrl: pdfUrl });
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  renderPages = () => {
    let pages = [];
    const totalPages = this.state.numPages;
    for (var i = 1; i <= totalPages; i++) {
      pages.push(<Page key={i} pageNumber={i} />);
    }
    return pages;
  };

  render() {
    // const { pageNumber, numPages } = this.state;
    const {
      intl: { formatMessage }
    } = this.props;
    const { doc = [] } = this.props;
    const savedOn = doc.uploadedOn;
    const uploadDate = new moment(savedOn).format("DD/MM/YYYY hh:mm A");

    return (
      <Fragment>
        {savedOn ? (
          <div className="full-width flex justify-content-space-between mb10">
            <div className="fontsize12 cool-grey">{`${formatMessage(
              messages.uploadedOn
            )} ${uploadDate}`}</div>
          </div>
        ) : null}
        <div className="pdf-viewer">
          <Document
            file={this.state.pdfUrl}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            {this.renderPages()}
          </Document>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(IdProofViewer);
