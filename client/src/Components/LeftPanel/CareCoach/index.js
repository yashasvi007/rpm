import React from "react";
import moment from "moment";
import _ from "lodash";
import CapsuleIcon from "../../../Assets/images/ico-capsule-flat-clr.png";

import "./style.less";

const LeftPanel = props => {
  let { programInfo, productsData } = props;
  return (
    <div className="flex column align-items-start leftPanelBox">
      <div className="clearFix-31" />
      <div className="flex row align-items-cente fontsize16 medium dark fw500">
        Program Info
      </div>
      <div className="clearFix-24" />
      <div className="flex column">
        <div className="flex row align-items-center medium fontsize12 cool-grey">
          Pharma Co
        </div>
        <div className="clearFix-4" />
        <div className="flex row align-items-center medium fontsize14">
          {(programInfo && programInfo.name) || ""}
        </div>
      </div>
      <div className="clearFix-24" />
      <div className="flex column">
        <div className="flex row align-items-center medium fontsize12 cool-grey ">
          Target Location
        </div>
        <div className="clearFix-4" />
        <div className="flex row align-items-center medium fontsize14">
          {(programInfo &&
            programInfo.targetLocation &&
            `${programInfo.targetLocation.country},${
              programInfo.targetLocation.city
            }`) ||
            ""}
        </div>
      </div>
      <div className="clearFix-24" />
      <div className="flex column">
        <div className="flex row align-items-center medium fontsize12 cool-grey ">
          Created On
        </div>
        <div className="clearFix-4" />
        <div className="flex row align-items-center medium fontsize14 dark">
          {(programInfo &&
            programInfo.createdAt &&
            moment(programInfo.createdAt).format("DD MMMM YYYY")) ||
            ""}
        </div>
      </div>
      <div className="clearFix-24" />
      <div className="flex column">
        <div className="flex row align-items-center medium fontsize12 cool-grey">
          Expires On
        </div>
        <div className="clearFix-4" />
        <div className="flex row align-items-center medium fontsize14">
          {(programInfo &&
            programInfo.expiresOn &&
            moment(programInfo.expiresOn).format("DD MMMM YYYY")) ||
            ""}
        </div>
      </div>
      <div className="clearFix-24" />
      <div className="flex column">
        <div className="flex row align-items-center medium fontsize12 cool-grey">
          Description
        </div>
        <div className="clearFix-4" />
        <div className="flex row align-items-center medium justify-content-center fontsize14">
          {(programInfo && programInfo.description) || ""}
        </div>
      </div>
      <div className="clearFix-24" />
      <div className="flex column">
        <div className="flex row align-items-center medium fontsize12 cool-grey ">
          {(productsData && Object.keys(productsData).length) || 0} Products
          selected
        </div>
        <div className="clearFix-4" />
        <div className="flex flex-wrap">
          {!_.isEmpty(productsData)
            ? Object.keys(productsData).map((key, index) => {
                let value = productsData[key];
                return (
                  <div className="product" key={index}>
                    <span>
                      <img src={CapsuleIcon} alt="product" />
                    </span>
                    <span>{value.name}</span>
                  </div>
                );
              })
            : ""}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
