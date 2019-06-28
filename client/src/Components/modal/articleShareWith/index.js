import React, { Component, Fragment } from "react";
import { Modal, Button } from "antd";
import { injectIntl } from "react-intl";
import "../style.less";
import messages from "./message";
import List from "./list";

class ArticleShareWith extends Component {
  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  footer = () => {
    const { formatMessage, handleCancel } = this;
    return (
      <Fragment>
        <div
          className={`flex align-items-center justify-content-end h72px mr24 ml24`}
        >
          <div className="flex align-items-center justify-content-end">
            <Button className="iqvia-btn cancel mr8" onClick={handleCancel}>
              {formatMessage(messages.close)}
            </Button>
          </div>
        </div>
      </Fragment>
    );
  };

  render() {
    const { show: visible, isError } = this.props;

    if (!visible) {
      return null;
    }

    const { handleCancel, footer } = this;
    const title = "Shared with";

    const modalProps = {
      visible: visible || isError,
      title: title,
      onCancel: handleCancel,
      wrapClassName: "global-modal full-height",
      destroyOnClose: true,
      bodyStyle: { height: "100%" },
      width: "480px",
      footer: footer()
    };

    let list = [];
    for (let i = 0; i < 100; i++) {
      list.push(
        <div key={i} className="mt8 mb8">
          {i + 1}
        </div>
      );
    }

    return (
      <Modal {...modalProps}>
        <div className="pl48 pr24 h100 overflow auto">
          <List {...this.props} />
        </div>
      </Modal>
    );
  }
}

export default injectIntl(ArticleShareWith);
