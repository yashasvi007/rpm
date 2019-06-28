import { Card } from "antd";
import React from "react";
import moment from "moment";

import { ENTITY } from "../../constant";
import location from "../../Assets/images/ico-location.svg";
import capsule from "../../Assets/images/ico-capsule-tiny.svg";
import patients from "../../Assets/images/ico-users.svg";
import expiry from "../../Assets/images/ico-expiry.svg";
import "./style.less";

const ACTIVE = "Active";
const ProgramCard = ({ data, handleOnClick }) => {
  const createAt = moment(data.createdAt).format("DD MMM YYYY");
  const expiresOn = moment(data.expireOn).format("DD MMM YYYY");
  let duration = `${createAt}-${expiresOn}`;
  if (data.Valid === ACTIVE) duration = `Expires on ${expiresOn}`;

  return (
    <Card
      className="programs clickable"
      key={data.title}
      onClick={e => {
        handleOnClick(ENTITY.PROGRAM, data.id);
      }}
    >
      <div className={`${data.Valid}now`}>
        <span className="fontsize12">{data.Valid}</span>
      </div>
      <h4 className="programData">{data.title}</h4>
      <ul>
        <li>
          <span className="fontsize12 programData">
            <img alt="" src={location} className="cardImg" />
            {data.city}, {data.country}
          </span>
        </li>
        <li>
          <span className="fontsize12 programData">
            <img alt="" className="cardImg" src={expiry} />
            {duration}
          </span>
        </li>
        <li>
          <span className="fontsize12 programData">
            <img alt="" className="cardImg" src={capsule} />
            {data.products} Products
          </span>
        </li>
        <li>
          <span className="fontsize12 programData">
            <img alt="" className="cardImg" src={patients} />
            {data.patients} Patients
          </span>
        </li>
      </ul>
    </Card>
  );
};

export default ProgramCard;
