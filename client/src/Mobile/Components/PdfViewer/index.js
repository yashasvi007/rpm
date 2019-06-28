import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import "./style.less";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

class PdfViewer extends Component {
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
    for (let i = 1; i <= totalPages; i++) {
      pages.push(<Page key={i} pageNumber={i} />);
    }
    return pages;
  };

  render() {
    return (
      <Fragment>
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

export default injectIntl(PdfViewer);
