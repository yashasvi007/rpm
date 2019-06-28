import { Card, Checkbox } from "antd";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { ENTITY } from "../../constant";
import defaultProfilePic from "../../Assets/images/ico-placeholder-userdp.svg";
import errorIcon from "../../Assets/images/ico-err.svg";
import { USER_STATUS } from "../../constant";

import "./style.less";

class PatientCard extends Component {
  constructor(props) {
    super();
    this.state = {
      checked: false
    };
  }

  onChange = e => {
    let {
      showDischargeBarToggle,
      onPatientCardSelect,
      onPatientCardDeselect
    } = this.props;

    this.setState(
      {
        checked: e.target.checked
      },
      () => {
        let { checked } = this.state;
        if (checked) {
          if (showDischargeBarToggle) {
            showDischargeBarToggle(true);
          }
          onPatientCardSelect(this.props.data);
        } else {
          onPatientCardDeselect(this.props.data.id);
        }
      }
    );
  };

  isChecked = id => {
    if (this.props.patientDischargedList) {
      if (Object.keys(this.props.patientDischargedList).indexOf(id) !== -1) {
        return true;
      } else {
        return false;
      }
    } else if (
      this.props.selectedPatient &&
      this.props.selectedPatient.indexOf(id) !== -1
    ) {
      return true;
    } else {
      return false;
    }
  };

  openPatient = (entity, id) => {
    this.props.history.push(`/${entity}/${id}`);
  };

  render() {
    const {
      data,
      handleOnClick,
      checkbox,
      disabled,
      surveyId,
      wantCheckBox = true,
      className,
      key,
      onClickCard
    } = this.props;

    const { openPatient } = this;

    if (data.type === USER_STATUS.ENROLLED) {
    }
    return (
      <Card
        key={key}
        className={`${className} patient ${
          data.type && data.type === USER_STATUS.ENROLLED && this.state.checked
            ? "selected"
            : ""
        } `}
        onClick={e => {
          if (surveyId && handleOnClick) {
            handleOnClick(surveyId, data.id);
          }
        }}
      >
        <div className="">
          <div className="flex align-items-center">
            <img
              alt=""
              src={data.profilePicLink || defaultProfilePic}
              className="patientDp mr16"
            />
            <div
              className={`${
                data.type && data.type === USER_STATUS.DISCHARGED
                  ? "subdued"
                  : "dark"
              } patientInfo clickable`}
              onClick={e => {
                if (handleOnClick) {
                  openPatient(ENTITY.PATIENT, data.id);
                  if (onClickCard) {
                    onClickCard();
                  }
                }
              }}
            >
              {data.title
                ? data.title.length < 13
                  ? data.title
                  : data.title.substr(0, 13) + "..."
                : ""}{" "}
              ({data.age} {data.gender})
            </div>
            {data.checkbox && wantCheckBox ? (
              <div className="selectPatient">
                <Checkbox
                  onChange={this.onChange}
                  checked={checkbox ? checkbox : this.isChecked(data.id)}
                  disabled={disabled}
                />
              </div>
            ) : (
              ""
            )}
            {data.type && data.type === USER_STATUS.INACTIVE ? (
              <div className="selectPatient">
                <img src={errorIcon} alt="Patient Not enrolled" />
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            <ul className="patients ">
              <li>
                <span className="fontsize12 dark">{data.doctor}</span>
              </li>
              <li>
                <span className="fontsize12 label-color">{data.hospital}</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    );
  }
}

export default withRouter(PatientCard);
