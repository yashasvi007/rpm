import React, { Component } from "react";
import { Button, Icon, message } from "antd";
import { withRouter } from "react-router-dom";
import AppHeader from "../../Commons/AppHeader";
import AppFooter from "../../Commons/AppFooter";
import axios from "axios";
import mimeTypes from "mime-types";
import "./style.css";
// const props = {
//   onChange(info) {
//     if (info.file.status !== "uploading") {
//
//     }
//     if (info.file.status === "done") {
//       message.success(`${info.file.name} file uploaded successfully`);
//     } else if (info.file.status === "error") {
//       message.error(`${info.file.name} file upload failed.`);
//     }
//   }
// };

class DocumentUpload extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      imageUrl: null,
      documentNames: [],
      documentUrls: [],
      base64Urls: [],
      docTypes: []
    };
    this.handleClick = this.handleClick.bind(this);
    //this.handleDocName = this.handleDocName.bind(this);
  }

  componentDidMount() {
    const provider = JSON.parse(localStorage.getItem("provider"));
    const bookingDate = localStorage.getItem("bookingDate");
    const bookingSlotSelected = localStorage.getItem("bookingSlotSelected");
    if (!(provider && bookingDate && bookingSlotSelected)) {
      this.props.history.push("/member/search");
    }
    localStorage.removeItem("documentUrls");
    localStorage.removeItem("documentNames");
  }

  handleClick(e) {
    let docNameArray = this.state.documentNames;
    let docUrlArray = this.state.documentUrls;
    let docTypesArray = this.state.docTypes;
    docNameArray.push("");
    docUrlArray.push("");
    docTypesArray.push("");

    this.setState({
      documentNames: docNameArray,
      documentUrls: docUrlArray,
      docTypesArray
    });
  }

  // removefile(e, key) {
  //   let tempDocNames = this.state.documentNames;
  //   let tempDocUrls = this.state.documentUrls;
  //   let tempDocTypes = this.state.docTypes;

  //   tempDocNames.splice(key, 1);
  //   tempDocUrls.splice(key, 1);
  //   tempDocTypes.splice(key, 1);
  //   this.setState(
  //     {
  //       documentNames: tempDocNames,
  //       documentUrls: tempDocUrls,
  //       docTypes: tempDocTypes
  //     },
  //     () =>
  //       (
  //         "docnames: ",
  //         this.state.documentNames,
  //         "docurls: ",
  //         this.state.documentUrls,
  //         "doctypes: ",
  //         this.state.docTypes
  //       )
  //   );
  // }

  handleDocName(e, key) {
    let value = e.target.value;
    // let key = e.target.ref;

    let docNames = this.state.documentNames.map((docname, index) => {
      //return index == key ?  value :  docname;
      if (index == key) {
        return value;
      } else {
        return docname;
      }
    });

    this.setState(
      { documentNames: docNames },
      () => ("docnames: ", this.state.documentNames)
    );
  }

  handleChange(e, key) {
    if (e.target.files) {
      let newDocUrls = this.state.documentUrls.map((docUrl, index) => {
        if (index == key) {
          return e.target.files[0];
        } else {
          return docUrl;
        }
      });
      let newDocTypes = this.state.docTypes.map((docType, index) => {
        if (index == key) {
          return mimeTypes.lookup(newDocUrls[index].name);
        } else return docType;
      });
      this.setState(
        { documentUrls: newDocUrls, docTypes: newDocTypes },
        () => (
          "docurls: ",
          this.state.documentUrls,
          "docTypes: ",
          this.state.docTypes
        )
      );

      // let reader = new FileReader();
      //
      // let name = e.target.files[0].name;
      // reader.readAsDataURL(e.target.files[0]);
      // let newDocUrls;
      // reader.onload = () => {
      //
      //   newDocUrls = this.state.documentUrls.map((docUrl, index) => {
      //     if (index == key) {
      //
      //       return reader.result;
      //     } else {
      //
      //       return docUrl;
      //     }
      //   });
      //   this.setState({ documentUrls: newDocUrls }, () =>
      //     ("docurls: ", this.state.documentUrls)
      //   );
      // };

      // reader.onerror = () =>
      //   this.setState({
      //     coverErrMsg: "Error uplading user cover!"
      //   });
    }
  }

  async renderConfirmationPage() {
    if (
      this.state.documentNames.indexOf("") != -1 ||
      this.state.documentUrls.indexOf("") != -1
    ) {
      message.error(
        "Please enter all document names and select appropriate files"
      );
    } else {
      let savedDocumentUrls = [];
      // let response = await axios.post("/api/uploadDocuments", {
      //   documentUrls: this.state.documentUrls
      // });
      if (this.state.documentUrls.length > 0) {
        let promise = this.state.documentUrls.map(async (docUrl, index) => {
          let url = await this.convertToBase64(docUrl);

          savedDocumentUrls.push(url);
        });
        Promise.all(promise).then(async results => {
          let response = await axios.post("/api/uploadDocuments", {
            documentUrls: savedDocumentUrls,
            documentTypes: this.state.docTypes
          });

          localStorage.setItem(
            "documentNames",
            JSON.stringify(this.state.documentNames)
          );
          localStorage.setItem("documentUrls", JSON.stringify(response.data));
          this.props.history.push("/member/confirmAppointment");
        });
      } else {
        this.props.history.push("/member/confirmAppointment");
      }
      //

      // localStorage.setItem(
      //   "documentUrls",
      //   JSON.stringify(this.state.documentUrls)
      // );
      // localStorage.setItem("documentNames", this.state.documentNames);
      // this.props.history.push("/member/confirmAppointment");
    }
  }

  convertToBase64(fileUrl) {
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(fileUrl);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject("Errorrr");
      };
    });
  }

  render() {
    return (
      <div>
        <AppHeader />
        <div>
          {" "}
          {/* <Upload onChange={info => this.handleChange(info)}>
            <Button>
              <Icon type="upload" /> Click To Upload Relevant Documents
            </Button>
          </Upload> */}
          <div className="documentUploadDiv">
            <div style={{ paddingRight: 20 }}>
              <h3>Upload Relevant Documents (Optional):</h3>
            </div>
            <div className="addDocButton">
              <Button onClick={this.handleClick}>
                Add Document
                <Icon type="plus" theme="outlined" />
              </Button>
            </div>
            <div>
              <Button
                type="primary"
                onClick={() => this.renderConfirmationPage()}
              >
                Next
                <Icon type="right" />
              </Button>
            </div>
          </div>
          {this.state.documentNames.length > 0 &&
            this.state.documentNames.map((document, index) => {
              return (
                <div key={index} className="docRow ">
                  <input
                    type="text"
                    key={index}
                    value={this.state.documentNames[index]}
                    name="documentName"
                    onChange={e => this.handleDocName(e, index)}
                  />
                  <input
                    className="fileButton"
                    key={"file" + index}
                    name="documentUrl"
                    type="file"
                    onChange={e => this.handleChange(e, index)}
                  />
                  {/* <Button
                    type="danger"
                    key={"cancel-" + index}
                    onClick={e => this.removefile(e, index)}
                  >
                    <Icon type="close" theme="outlined" />
                  </Button> */}
                </div>
              );
            })}
          {/* <div>
            <Button
              type="primary"
              onClick={() => this.renderConfirmationPage()}
            >
              Next
              <Icon type="right" />
            </Button>
          </div> */}
        </div>

        <AppFooter />
      </div>
    );
  }
}

export default withRouter(DocumentUpload);
