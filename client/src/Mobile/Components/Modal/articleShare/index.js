import React, { Component, Fragment } from "react";
import { Modal, Button } from "antd";
import { injectIntl } from "react-intl";
import "../style.less";
import messages from "./message";
import icoError from "../../../../Assets/images/ico-err.svg";
import Content from "./content";
import { USER_STATUS } from "../../../../constant";

class ShareArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patients: []
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  formatMessage = data => this.props.intl.formatMessage(data);

  isSaveDisabled = () => {
    const { patients } = this.state;
    return patients.length <= 0;
  };

  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  onShare = e => {
    e.preventDefault();
    const { share, articleId, fetchArticle } = this.props;
    const { patients } = this.state;
    share({ participants: patients, articleId })
      .then(res => {
        const { status } = res;
        if (status) {
          fetchArticle(articleId);
        }
      })
      .catch(err => {});
  };

  deselectAll = () => {
    this.setState({ patients: [] });
  };

  selectAll = patients => {
    const {
      users,
      article: { participants = {} }
    } = this.props;
    const alreadyShare = Object.keys(participants);

    const list = patients.filter(id => {
      if (alreadyShare.length > 0 && alreadyShare.includes(id)) {
        return false;
      }
      const { status } = users[id] || {};

      if (status === USER_STATUS.ENROLLED) {
        return true;
      } else {
        return false;
      }
    });
    this.setState({ patients: list });
  };

  handleCheck = (checked, id) => {
    const { patients } = this.state;
    if (checked) {
      this.setState({ patients: [...patients, id] });
    } else {
      this.setState({ patients: patients.filter(patient => patient !== id) });
    }
  };

  footer = () => {
    const { formatMessage, handleCancel, isSaveDisabled, onShare } = this;
    return (
      <Fragment>
        <div
          className={`flex align-items-center justify-content-end h72px mr24 ml24`}
        >
          <div className="flex align-items-center justify-content-end">
            <Button className="iqvia-btn cancel mr8" onClick={handleCancel}>
              {formatMessage(messages.cancel)}
            </Button>
            <Button
              type="primary iqvia-btn"
              onClick={onShare}
              disabled={isSaveDisabled()}
            >
              {formatMessage(messages.save)}
            </Button>
          </div>
        </div>
      </Fragment>
    );
  };

  render() {
    const {
      show: visible,
      change_password_error,
      is_changing_password_error = false
    } = this.props;

    const { deselectAll, selectAll, handleCheck } = this;
    const { patients } = this.state;

    if (!visible) {
      return null;
    }

    const { handleCancel, footer } = this;
    const title = "Share with Patients";

    const modalProps = {
      visible: visible,
      title: title,
      onCancel: handleCancel,
      wrapClassName: "m global-modal full-height",
      destroyOnClose: true,
      bodyStyle: { height: "100%" },
      width: "100%",
      footer: footer()
    };
    return (
      <Modal {...modalProps}>
        <div className="pl48 pr24 h100 overflow auto">
          <Content
            {...this.props}
            selectedPatients={patients}
            handleCheck={handleCheck}
            selectAll={selectAll}
            deselectAll={deselectAll}
          />
          {is_changing_password_error && (
            <div
              className={
                "w100 absolute flex row align-items-center justify-content-start"
              }
              style={{
                backgroundColor: "#fff8f5",
                bottom: "70px",
                height: "40px",
                marginLeft: "-48px"
              }}
            >
              <div
                style={{
                  display: "block",
                  width: "13px",
                  marginLeft: "24px",
                  textAlign: "center"
                }}
              >
                <img
                  alt=""
                  src={icoError}
                  className={"w100"}
                  style={{ display: "block" }}
                />
              </div>
              <div className={"fontsize12 medium warning-color ml8"}>
                {change_password_error.message}
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

export default injectIntl(ShareArticle);
