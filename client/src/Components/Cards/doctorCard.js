import { Card } from "antd";
import React from "react";
import "./style.less";
import defaultProfilePic from "../../Assets/images/ico-placeholder-userdp.svg";
import { ENTITY } from "../../constant";

const DoctorCard = ({ data, handleOnClick }) => {
  return (
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
  );
};

export default DoctorCard;
