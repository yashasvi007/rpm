import React from "react";
import "../style.less";
import { ENTITY } from "../../../constant";

const DoctorCard = ({
  name,
  city,
  country,
  doctorDp,
  speciality,
  onClick,
  id
}) => {
  //
  return (
    <div
      className="doctorCard"
      key={name}
      onClick={e => {
        e.preventDefault();
        if (onClick) {
          onClick(ENTITY.DOCTOR, id);
        }
      }}
    >
      <div>
        <div className="flex align-items-center clickable ">
          <img alt="" src={doctorDp} className="doctorDp mr16" />
          <div className="dark DoctorName">{name}</div>
        </div>
        <div>
          <ul className="doctors">
            <li>
              <span className="dark fontsize12 mb4 ">{speciality}</span>
            </li>
            <li>
              <span className="label-color fontsize12 mb4 doctorInfo">
                {city},{country}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
