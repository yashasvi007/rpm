import React from "react";
import { Menu } from "antd";
import moment from "moment";
import backIcon from "../../../Assets/images/ico-back.png";
import "./style.less";
import { USER_CATEGORY } from "../../../constant";
import { makeQueryString, getQuery } from "../../../Helper/queryString";

const { Item } = Menu;

const ProgramDetailsBar = props => {
  const { category } = props;
  const goBack = () => {
    props.history.goBack();
  };
  const isActive = () => {
    let isActive =
      props.programData &&
      moment(props.programData.expiresOn).isAfter(moment(new Date()))
        ? "Active"
        : "Expired";
    return isActive;
  };

  const changeCurrentEntity = e => {
    const { key } = e;
    const {
      location: { pathname },
      replace
    } = props.history;
    const query = { tab: key };
    replace({ pathname, search: makeQueryString(query) });
  };

  const {
    patientCount,
    doctorCount,
    history: {
      location: { search }
    }
  } = props;
  const { tab = USER_CATEGORY.PATIENT } = getQuery(search);
  return (
    <div className="flex row align-items-center w100 navBarContainer">
      <div
        className="flex row align-items-center justify-content-center h100 pl24 pt24 wfc"
        onClick={goBack}
      >
        <div className="flex row align-items-center justify-content-center h100 mr16 wfc clickable">
          <img src={backIcon} className="ico-Back" alt="Go-back" />
        </div>
        <div className="flex row align-items-center justify-content-center h100 mr32 fontsize12 dark wfc">
          All Programs
        </div>
      </div>
      <div className="flex row align-items-center justify-content-start h100 mr77 fontsize18 medium fw500 dark wfc min-width-318">
        <span className="mr16">
          {props.programData && props.programData.name}
        </span>
        <div className="flex row align-items-center justify-content-center ActiveState  wfc">
          <span className="fontsize12"> {isActive()}</span>
        </div>
      </div>
      {/* <div className="flex row align-items-center justify-content-center ActiveState mr77 wfc">
        <span className="fontsize12"> {isActive()}</span>
      </div> */}
      {category === USER_CATEGORY.CARE_COACH && (
        <div className="flex column justify-content-end h100 navbarMenuContainer">
          <Menu
            mode="horizontal"
            onClick={changeCurrentEntity}
            defaultSelectedKeys={[tab]}
            selectedKeys={[tab]}
          >
            <Item key={USER_CATEGORY.PATIENT}>Patients({patientCount})</Item>
            <Item key={USER_CATEGORY.DOCTOR}>Doctors({doctorCount})</Item>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default ProgramDetailsBar;
