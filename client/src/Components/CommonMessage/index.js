import React from "react";
import { Row, Col } from "antd";
import "./style.less";
import verified from "../../Assets/images/ico-verified.svg";

const CommonMessage = ({ msg, close }) => {
  if (msg) {
    if (close) {
      setTimeout(close, 4000);
    }
    return (
      <div className={`iqvia-successful-msg`}>
        <div className="flex  pr8 pl24 pt12 pb12">
          <Row className="w100">
            <Col xs={12} sm={12} md={10} lg={10} xl={10} xxl={10}>
              <div>
                <img alt="" src={verified} className="mr8 inline" />
                <div className="fontsize12 medium successfull-color inline">
                  {msg}
                </div>
              </div>
            </Col>
            {/* {close && (
              <Col xs={12} sm={12} md={2} lg={2} xl={2} xxl={2}>
                <Button className="got-it-btn" onClick={close}>
                  <div className="flex align-items-center justify-content-center">
                    <img alt="" src={checkMark} />
                    <div className="dark fontsize14 medium ">Got It</div>
                  </div>
                </Button>
              </Col>
            )} */}
          </Row>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default CommonMessage;
