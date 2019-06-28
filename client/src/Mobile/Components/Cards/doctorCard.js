import { Card } from "antd";
import React from "react";
import "./style.less";
import defaultProfilePic from "../../../Assets/images/ico-placeholder-userdp.svg";
import { ENTITY } from "../../../constant";
import Col from "antd/es/grid/col";

const DoctorCard = ({ data, handleOnClick }) => {
  return (
    <Col key={data.title} xs={12} sm={12} md={6} lg={6}>
      <Card
        className="doctor clickable"
        key={data.title}
        onClick={e => handleOnClick(ENTITY.DOCTOR, data.id)}
      >
        <div>
          <div className="flex align-items-center">
            <img
              alt=""
              src={data.profilePicLink || defaultProfilePic}
              className="patientDp mr16"
            />
            <div className="dark patientInfo">{data.title}</div>
          </div>
          <div>
            <ul className="doctors">
              <li>
                <span className="fontsize12 dark">{data.hospital}</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </Col>
  );
};

export default DoctorCard;
