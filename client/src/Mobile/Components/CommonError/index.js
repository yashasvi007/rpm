import React from "react";
import { Row, Col } from "antd";
import "./style.less";
import icoError from "../../../Assets/images/ico-err.svg";

const ErrorComponent = ({ msg, close, className }) => {
  if (close) {
    setTimeout(close, 4000);
  }
  if (!msg) {
    return null;
  }
  return (
    <div className={`iqvia-error ${className}`}>
      <div className="flex  pr8 pl8 pt16 pb16">
        <Row className="w100">
          <Col xs={12} sm={12} md={10} lg={10} xl={10} xxl={10}>
            <div>
              <img alt="" src={icoError} className="mr8 inline" />
              <div className="fontsize12 medium warning-color inline">
                {msg}
              </div>
            </div>
          </Col>
          {/* <Col xs={12} sm={12} md={2} lg={2} xl={2} xxl={2}>
            <Button className="got-it-btn" onClick={close}>
              <div className="flex align-items-center justify-content-center">
                <img alt="" src={checkMark} />
                <div className="dark fontsize14 medium ">Got It</div>
              </div>
            </Button>
          </Col> */}
        </Row>
      </div>
    </div>
  );
};

export default ErrorComponent;
